"use client";

import { motion } from "framer-motion";

export default function AnimatedVampire() {
  return (
    <motion.img
      className="hero-character"
      src="/images/vampi.png"
      alt="Vampira del Archivo Sobrenatural"
      initial={{ opacity: 0, x: 60, scale: 0.94 }}
      animate={{ opacity: 1, x: 0, scale: 1, y: [0, -18, 0] }}
      transition={{
        opacity: { duration: 0.8 },
        x: { duration: 0.8 },
        scale: { duration: 0.8 },
        y: { duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
      }}
      whileHover={{ scale: 1.03, rotate: 1 }}
    />
  );
}
