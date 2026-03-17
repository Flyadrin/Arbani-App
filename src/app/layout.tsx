import type { Metadata } from "next";
import { Cinzel, Lato } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: "Arbani Tour - Biro Umroh & Haji Terpercaya",
  description: "Arbani Tour - Biro Terpercaya Zona Nyaman. Layanan perjalanan umroh dan haji terpercaya di Semarang.",
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${cinzel.variable} ${lato.variable} antialiased`}
        style={{ fontFamily: "var(--font-lato), sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
