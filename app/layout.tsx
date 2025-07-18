import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IT2030.CH190 - ACB ATM locations in data",
  description: "ACB's ATM in Hồ Chí Minh city",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
