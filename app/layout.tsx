import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gruble-ark Generator",
  description:
    "Generer egendefinerte gruble-ark med dine foretrukne kategorier og bokstaver",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className="font-sans">{children}</body>
    </html>
  );
}
