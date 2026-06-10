import AuthForm from "@/components/AuthForm";
export default async function Login({searchParams}:{searchParams:Promise<{next?:string}>}){const{next}=await searchParams;return <section className="section prose"><p className="eyebrow">Acceso</p><h1>Iniciar sesión</h1><AuthForm mode="login" redirectTo={next}/></section>}
