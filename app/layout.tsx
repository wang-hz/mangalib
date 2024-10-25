import SettingsIcon from '@mui/icons-material/Settings';
import { AppBar, Link, Stack, Toolbar } from "@mui/material";
import { grey } from "@mui/material/colors";
import type { Metadata } from "next";
import React from "react";
import "./globals.css";

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
    <html>
    <body>
    <AppBar>
      <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href='/' color='inherit' variant='h6' underline='none'>
          mangalib
        </Link>
        <Link href='/settings' color="inherit">
          <SettingsIcon/>
        </Link>
      </Toolbar>
    </AppBar>
    <Stack flex={1} sx={{ backgroundColor: grey[100]} }>
      <Toolbar/>
      <Stack flex={1}>
        {children}
      </Stack>
    </Stack>
    </body>
    </html>
  );
}
