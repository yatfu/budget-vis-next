import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import Nav from "./components/Nav";
import { authenticate } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Budget Visualizer",
  description:
    "a way for users to efficiently track their expenses without overly complex interfaces",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userId = await authenticate();
  
  return (
    <html lang="en" className={cn("font-sans", "dark", "max-w-250 m-auto px-3")}>
      <body className="antialiased">
        <Nav userId={userId} />
        {children}
      </body>
    </html>
  );
}
