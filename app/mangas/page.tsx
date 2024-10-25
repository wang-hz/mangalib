import MangaGrid from "@/components/manga-grid";
import { Stack } from "@mui/material";
import React from "react";

export default function Mangas() {
  return (
    <Stack flex={1}>
      <MangaGrid/>
    </Stack>
  );
}
