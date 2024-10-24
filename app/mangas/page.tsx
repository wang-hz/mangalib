'use client'

import MangaGrid from "@/components/manga-grid";
import { Container } from "@mui/material";
import React from "react";

export default function Mangas() {
  return (
    <Container sx={{ flex: 1 }}>
      <MangaGrid/>
    </Container>
  );
}
