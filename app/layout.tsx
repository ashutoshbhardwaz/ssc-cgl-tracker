import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SSC CGL 2027 Preparation Tracker",
  description: "SAFAR 3.0 - Master Study Planner for SSC CGL 2027",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
