import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";
import AuthContextProvider from "./context/AuthContext";
import ChatSocketContextProvider from "./context/ChatContext";
import SocketContextProvider from "./context/SocketContext";
import "./globals.css";
import ProtectedRoute from "../components/ProtectedRoute";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PONG CLUB",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContextProvider>
          {children}
          {/* <ChatSocketContextProvider>
              <SocketContextProvider>{children}</SocketContextProvider>
            </ChatSocketContextProvider> */}
        </AuthContextProvider>
      </body>
    </html>
  );
}
