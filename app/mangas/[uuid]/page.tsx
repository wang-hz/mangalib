"use client"

import { Button, ButtonGroup, Paper, Stack } from "@mui/material";
import Image from "next/image";
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
};

const getImages = async (mangaUuid: string) => {
  return fetch(`/api/mangas/${mangaUuid}/images`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('failed to fetch images of manga');
      }
      return response.json();
    })
    .catch((error) => {
      console.error(error);
    })
};

export default function Home({ params }: { params: { uuid: string } }) {
  const [manga, setManga] = useState<MangaModel | undefined>(undefined);
  const [cover, setCover] = useState<string | undefined>(undefined);

  useEffect(() => {
    getManga(params.uuid).then((data) => setManga(data));
    getImages(params.uuid).then((data) => setCover(data.images[0]));
  }, [params.uuid]);

  return (
    <Stack direction='row' gap={1}>
      <Paper style={{ position: 'relative', width: '300px', height: '400px' }}>
        {cover && <Image src={cover} alt='cover' fill objectFit='contain'/>}
      </Paper>
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
    </Stack>
  );
}
