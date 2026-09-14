import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CU-SUCCEED — Digital Platform",
  description:
    "The complete digital ecosystem for student assessment, training, and employability development.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  // Light is the default in globals.css. This runs before the rest of the
  // body is parsed, so a visitor who saved dark mode never sees a light
  // flash before ThemeToggle mounts. suppressHydrationWarning covers the
  // class the script adds to <html> differing from the server markup.
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(localStorage.getItem('sa_theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}",
          }}
        />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
