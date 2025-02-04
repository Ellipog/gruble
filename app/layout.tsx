import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gruble - Word Game Sheet Generator",
  description:
    "Generate custom word game sheets with your preferred categories and letters",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
