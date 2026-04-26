import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CreatorHub - Grow Your OnlyFans Empire",
  description:
    "The all-in-one platform to manage subscribers, automate DM funnels, optimize PPV pricing, and track your content performance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${geistSans.variable} font-sans antialiased bg-zinc-950 text-zinc-300`}
      >
        <CustomCursor />
        {children}
        <Toaster richColors closeButton position="top-right" theme="dark" />
      </body>
    </html>
  );
}
