import { AppBar, Link, Toolbar } from "@mui/material";
import type { Metadata } from "next";
import "./globals.css";
import React from "react";

export const metadata: Metadata = {
  title: "mangalib",
  description: "Manga Library",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body style={{ margin: 0 }}>
    <AppBar style={{ position: 'sticky', flex: '0 0 auto' }}>
      <Toolbar>
        <Link href='/' color='inherit' variant='h6' underline='none'>
          mangalib
        </Link>
      </Toolbar>
    </AppBar>
    {children}
    </body>
    </html>
  );
}
