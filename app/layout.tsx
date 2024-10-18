import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Drum Machine",
  description: "A versatile drum machine app where you can click or tap pads to play sounds, change pad sounds with a long press or right-click, drag and drop audio files onto pads, switch between drum kits using a dropdown, change colors with a palette icon, and toggle dark mode with a sun/moon icon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <title>Drum Machine</title>
        <meta name="description" content={metadata.description ?? "Default Description"} />
        <meta name="keywords" content="drum machine, music app, audio, sound, drum kits, music production" />
        <meta name="author" content="Your Name or Company" />
        <meta property="og:title" content="Drum Machine" />
        <meta property="og:description" content={metadata.description ?? "Default Description"} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://drrrumm.ing" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Drum Machine" />
        <meta name="twitter:description" content={metadata.description ?? "Default Description"} />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2235699957137388" crossOrigin="anonymous"></script>
        <script async src="https://telegram.org/js/telegram-widget.js?22" data-telegram-login="drrrumming_bot" data-size="large" data-auth-url="https://www.drrrumm.ing/" data-request-access="write"></script>
      </head>
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
