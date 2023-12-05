import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ModalProvider from "@/components/providers/modal-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { SocketProvider } from "@/components/providers/socket-provider";

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "ChatForge",
  description:
    "Transform your communication experience with ChatForge – where connectivity meets innovation. Elevate your team collaboration to new heights, inspired by the fluidity of platforms like Discord and Slack",
  keywords: [
    "nextjs",
    "nodejs",
    "javascript",
    "chat-app",
    "discord",
    "slack",
    "socket.io",
    "websocket",
    "typescript",
    "prisma",
    "postgresql",
    "clerk",
    "ChatForge",
  ],
  authors: [{ name: "Kei-K", url: "https://github.com/Kei-K23" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${lato.className} antialiased dark:bg-[#0d0d0f]`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="chatforge-theme"
          >
            <SocketProvider>
              <ModalProvider />
              {children}
              <Toaster />
            </SocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
