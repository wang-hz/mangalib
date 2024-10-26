import MangaList from "@/components/manga-list";
import { Stack } from "@mui/material";
import React from "react";

export default function Mangas() {
  return (
    <Stack flex={1}>
      <MangaList/>
    </Stack>
  );
}
