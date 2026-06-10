"use client";

import { ToastContainer } from "react-toastify";

export default function Notifications(){
  return <ToastContainer position="top-right" autoClose={3200} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover theme="dark"/>;
}
