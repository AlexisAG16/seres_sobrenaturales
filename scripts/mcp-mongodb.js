#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require("fs");
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb");

const projectRoot = path.resolve(__dirname, "..");
loadEnvFile(path.join(projectRoot, ".env.local"));

const uri = process.env.MONGO_URI;
const databaseName = process.env.MONGO_DB_NAME;

if (!uri || !databaseName) {
  throw new Error("MONGO_URI and MONGO_DB_NAME must be defined in .env.local");
}

let clientPromise;
let buffer = "";
let activeRequests = 0;
let stdinEnded = false;

const tools = [
  tool("mongodb_database_info", "Show the current MongoDB database and collections.", {}),
  tool("mongodb_list_collections", "List collections in the configured database.", {}),
  tool("mongodb_count_documents", "Count documents using an optional filter.", {
    collection: { type: "string" },
    filter: { type: "object", default: {} },
  }, ["collection"]),
  tool("mongodb_find_documents", "Find documents with filter, projection, sorting, and limit.", {
    collection: { type: "string" },
    filter: { type: "object", default: {} },
    projection: { type: "object", default: {} },
    sort: { type: "object", default: {} },
    limit: { type: "number", default: 20, minimum: 1, maximum: 100 },
  }, ["collection"]),
  tool("mongodb_insert_document", "Insert one document.", {
    collection: { type: "string" },
    document: { type: "object" },
  }, ["collection", "document"]),
  tool("mongodb_update_document", "Update one matching document.", {
    collection: { type: "string" },
    filter: { type: "object" },
    update: { type: "object" },
  }, ["collection", "filter", "update"]),
  tool("mongodb_delete_document", "Delete one matching document.", {
    collection: { type: "string" },
    filter: { type: "object" },
  }, ["collection", "filter"]),
  tool("mongodb_aggregate", "Run an aggregation pipeline.", {
    collection: { type: "string" },
    pipeline: { type: "array", items: { type: "object" }, default: [] },
    limit: { type: "number", default: 50, minimum: 1, maximum: 100 },
  }, ["collection", "pipeline"]),
];

process.stdin.setEncoding("utf8");
process.stdin.on("data", async (chunk) => {
  buffer += chunk;
  let newline;
  while ((newline = buffer.indexOf("\n")) >= 0) {
    const line = buffer.slice(0, newline).trim();
    buffer = buffer.slice(newline + 1);
    if (!line) continue;
    try {
      activeRequests += 1;
      await handleMessage(JSON.parse(line));
    } catch (error) {
      sendError(null, -32700, error.message);
    } finally {
      activeRequests = Math.max(0, activeRequests - 1);
      await closeAfterInput();
    }
  }
});
process.stdin.on("end", async () => {
  stdinEnded = true;
  await closeAfterInput();
});
process.on("SIGINT", closeAndExit);
process.on("SIGTERM", closeAndExit);

async function handleMessage(message) {
  if (message.method === "notifications/initialized") return;
  if (message.method === "initialize") {
    return sendResult(message.id, {
      protocolVersion: "2024-11-05",
      capabilities: { tools: {} },
      serverInfo: { name: "vampinfo-mongodb", version: "1.0.0" },
    });
  }
  if (message.method === "tools/list") return sendResult(message.id, { tools });
  if (message.method === "tools/call") {
    try {
      const result = await callTool(message.params?.name, message.params?.arguments || {});
      return sendResult(message.id, { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] });
    } catch (error) {
      return sendResult(message.id, { isError: true, content: [{ type: "text", text: error.message }] });
    }
  }
  sendError(message.id, -32601, `Unsupported method: ${message.method}`);
}

async function callTool(name, args) {
  const db = await getDb();
  if (name === "mongodb_database_info") return { database: db.databaseName, collections: await listCollections(db) };
  if (name === "mongodb_list_collections") return listCollections(db);
  if (name === "mongodb_count_documents") return { collection: args.collection, count: await db.collection(args.collection).countDocuments(normalize(args.filter || {})) };
  if (name === "mongodb_find_documents") return db.collection(args.collection).find(normalize(args.filter || {})).project(args.projection || {}).sort(args.sort || {}).limit(clamp(args.limit, 20)).toArray();
  if (name === "mongodb_insert_document") {
    const now = new Date();
    const result = await db.collection(args.collection).insertOne(normalize({ ...args.document, createdAt: args.document.createdAt || now, updatedAt: args.document.updatedAt || now }));
    return { acknowledged: result.acknowledged, insertedId: result.insertedId };
  }
  if (name === "mongodb_update_document") {
    const update = normalize(args.update || {});
    const result = await db.collection(args.collection).updateOne(normalize(args.filter || {}), { ...update, $set: { ...(update.$set || {}), updatedAt: new Date() } });
    return { acknowledged: result.acknowledged, matchedCount: result.matchedCount, modifiedCount: result.modifiedCount };
  }
  if (name === "mongodb_delete_document") {
    const result = await db.collection(args.collection).deleteOne(normalize(args.filter || {}));
    return { acknowledged: result.acknowledged, deletedCount: result.deletedCount };
  }
  if (name === "mongodb_aggregate") return db.collection(args.collection).aggregate([...normalize(args.pipeline || []), { $limit: clamp(args.limit, 50) }]).toArray();
  throw new Error(`Unknown tool: ${name}`);
}

async function getDb() {
  if (!clientPromise) clientPromise = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 }).connect();
  return (await clientPromise).db(databaseName);
}

async function listCollections(db) {
  return db.listCollections({}, { nameOnly: true }).toArray();
}

function tool(name, description, properties, required = []) {
  return { name, description, inputSchema: { type: "object", properties, required, additionalProperties: false } };
}

function normalize(value) {
  if (Array.isArray(value)) return value.map(normalize);
  if (!value || typeof value !== "object") return value;
  if (typeof value.$oid === "string") return new ObjectId(value.$oid);
  if (typeof value.$date === "string") return new Date(value.$date);
  return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, normalize(child)]));
}

function clamp(value, fallback) {
  const parsed = Number(value || fallback);
  return Math.max(1, Math.min(100, Number.isFinite(parsed) ? parsed : fallback));
}

function loadEnvFile(filePath) {
  const contents = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator < 0) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    if (!process.env[key]) process.env[key] = value;
  }
}

function sendResult(id, result) {
  process.stdout.write(`${JSON.stringify({ jsonrpc: "2.0", id, result })}\n`);
}

function sendError(id, code, message) {
  process.stdout.write(`${JSON.stringify({ jsonrpc: "2.0", id, error: { code, message } })}\n`);
}

async function closeAndExit() {
  if (clientPromise) (await clientPromise).close();
  process.exit(0);
}

async function closeAfterInput() {
  if (stdinEnded && activeRequests === 0 && !process.env.MCP_KEEP_ALIVE) await closeAndExit();
}
