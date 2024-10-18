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
      </head>
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
