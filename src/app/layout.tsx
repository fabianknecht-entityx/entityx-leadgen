import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import Script from "next/script";
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
    "Diese Analyse zeigt dir in 2 Minuten, an welchen Stellen dein System qualifizierte Interessenten verliert – und wo die größten Hebel liegen.",
  icons: {
    icon: "https://entityx.com/wp-content/uploads/2024/02/cropped-Favicon-WhiteonBlack-512px-32x32.png",
  },
  openGraph: {
    title: "Lead-Gen-Score | entity x",
    description:
      "Diese Analyse zeigt dir in 2 Minuten, an welchen Stellen dein System qualifizierte Interessenten verliert – und wo die größten Hebel liegen.",
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
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-K763BLJ');`}
        </Script>
      </head>
      <body
        suppressHydrationWarning
        className={`${playfair.variable} ${dmSans.variable} antialiased`}
      >
        {/* Google Tag Manager (noscript fallback) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-K763BLJ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
