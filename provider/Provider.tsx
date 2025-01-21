'use client';

import { SessionProvider } from 'next-auth/react';
import React, { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SocketProvider from './SocketProvider';

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
          className="max-w-[90%] sm:max-w-[400px] mx-auto text-sm"
          progressClassName="h-1"
        />
        {children}
      </SocketProvider>
    </SessionProvider>
  );
}
