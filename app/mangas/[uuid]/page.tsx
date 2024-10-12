"use client"

import { Box, Button, ButtonGroup, Stack } from "@mui/material";
import { useEffect, useState } from "react";

interface MangaModel {
  title: string,
  originalTitle: string,
  fullTitle: string,
  artist: string,
  group: string,
  event: string,
  parody: string,
  tags: string[]
}

const getManga = async (uuid: string) => {
  return fetch(`/api/mangas/${uuid}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('failed to fetch manga');
      }
      return response.json();
    })
    .catch((error) => {
      console.error(error);
    });
}

export default function Home({ params }: { params: { uuid: string } }) {
  const [manga, setManga] = useState<MangaModel | undefined>(undefined);

  useEffect(() => {
    getManga(params.uuid).then((data) => setManga(data));
  }, [params.uuid]);

  return (
    <Stack gap={1}>
      {Object.entries(manga ?? {})
        .filter(([key, value]) => !!value && key !== 'tags')
        .map(([key, value], index) =>
          <ButtonGroup key={index}>
            <Button>{key}</Button>
            <Button style={{ textTransform: 'none' }}>{value}</Button>
          </ButtonGroup>)}
      <Stack direction='row' gap={1}>
        {manga?.tags.map((tag, index) =>
          <Button key={index} variant='outlined' style={{ textTransform: 'none' }}>{tag}</Button>
        )}
      </Stack>
    </Stack>
  );
}
