"use client";
import { SessionProvider } from "next-auth/react";
import React, { Children, ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import SocketProvider from "./SocketProvider";

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <SocketProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeButton={true}
          pauseOnHover={true}
        />
        {children}
      </SocketProvider>
    </SessionProvider>
  );
}
