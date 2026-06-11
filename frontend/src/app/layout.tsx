import type { Metadata } from "next";

import  "./globals.css";

export const metadata: Metadata = {
  title: "AI Meeting Assistant",
  description: "Upload transcripts, get summaries, extract action items, ask questions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
