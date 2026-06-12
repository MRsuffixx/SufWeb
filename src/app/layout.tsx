import "~/styles/globals.css";

import { type Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { LenisProvider } from "~/components/layout/LenisProvider";
import { CustomCursor } from "~/components/layout/CustomCursor";
import { NoiseOverlay } from "~/components/ui/NoiseOverlay";
import { ScrollProgress } from "~/components/ui/ScrollProgress";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Dev Portfolio — Crafting Digital Experiences",
    template: "%s | Dev Portfolio",
  },
  description:
    "Full-stack engineer crafting high-performance, visually stunning digital experiences. Specializing in Next.js, TypeScript, and 3D web.",
  keywords: [
    "developer portfolio",
    "full-stack engineer",
    "Next.js",
    "TypeScript",
    "React",
    "UI/UX",
  ],
  authors: [{ name: "Developer" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Dev Portfolio — Crafting Digital Experiences",
    description:
      "Full-stack engineer crafting high-performance, visually stunning digital experiences.",
    siteName: "Dev Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dev Portfolio — Crafting Digital Experiences",
    description:
      "Full-stack engineer crafting high-performance, visually stunning digital experiences.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body>
        <TRPCReactProvider>
          <LenisProvider>
            <CustomCursor />
            <ScrollProgress />
            <NoiseOverlay />
            {children}
          </LenisProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
