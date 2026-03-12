import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "../styles/globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lead-Gen-Score | entity x",
  description:
    "Finde in 2 Minuten heraus, wo dein Funnel Geld verbrennt – und wie du mehr Kunden aus dem gleichen Budget holst.",
  icons: {
    icon: "https://entityx.com/wp-content/uploads/2024/02/cropped-Favicon-WhiteonBlack-512px-32x32.png",
  },
  openGraph: {
    title: "Lead-Gen-Score | entity x",
    description:
      "Finde in 2 Minuten heraus, wo dein Funnel Geld verbrennt – und wie du mehr Kunden aus dem gleichen Budget holst.",
    images: [
      "https://entityx.com/wp-content/uploads/2024/03/strategy.png.webp",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        suppressHydrationWarning
        className={`${playfair.variable} ${dmSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
