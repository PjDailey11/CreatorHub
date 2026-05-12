import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/auth/auth-provider";
import { getServerAuthSnapshot } from "@/lib/auth/server-auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CreatorHub - CRM and workflow software for subscription creators",
  description:
    "Independent CRM and workflow software for subscription creators. Import subscriber data, organize follow-up workflows, review pricing guidance, and track performance.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialAuth = await getServerAuthSnapshot();

  return (
    <html
      lang="en"
      className="dark scroll-smooth"
      data-theme="dark"
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.variable} bg-background text-foreground font-sans antialiased`}
      >
        <AuthProvider initialAuth={initialAuth}>
          <CustomCursor />
          {children}
          <Toaster richColors closeButton position="top-right" theme="dark" />
        </AuthProvider>
      </body>
    </html>
  );
}
