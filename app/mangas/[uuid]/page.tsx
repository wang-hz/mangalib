"use client"

import { Button, ButtonGroup, Container, Paper, Stack, Typography } from "@mui/material";
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
    <Container sx={{ paddingTop: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Stack>
        <Stack direction='row' sx={{ alignItems: 'baseline', gap: 1 }}>
          <Typography variant='h6'>{manga?.title}</Typography>
          {manga?.title !== manga?.originalTitle &&
            <Typography variant='subtitle1'>{manga?.originalTitle}</Typography>
          }
        </Stack>
        <Typography variant='subtitle2'>{manga?.fullTitle}</Typography>
      </Stack>
      <Stack direction='row' gap={4}>
        <Paper sx={{ position: 'relative', width: 300, height: 400 }}>
          {cover && <Image src={cover} alt='cover' fill objectFit='contain'/>}
        </Paper>
        <Stack gap={1}>
          <Stack direction='row' gap={1}>
            {manga?.artist &&
              <ButtonGroup>
                <Button>artist</Button>
                <Button sx={{ textTransform: 'none' }}>{manga?.artist}</Button>
              </ButtonGroup>
            }
            {manga?.group &&
              <ButtonGroup>
                <Button>group</Button>
                <Button sx={{ textTransform: 'none' }}>{manga?.group}</Button>
              </ButtonGroup>
            }
          </Stack>
          <Stack direction='row' gap={1}>
            {manga?.group &&
              <ButtonGroup>
                <Button>event</Button>
                <Button sx={{ textTransform: 'none' }}>{manga?.event}</Button>
              </ButtonGroup>
            }
            {manga?.parody &&
              <ButtonGroup>
                <Button>parody</Button>
                <Button sx={{ textTransform: 'none' }}>{manga?.parody}</Button>
              </ButtonGroup>
            }
          </Stack>
          <Stack direction='row' gap={1}>
            {manga?.tags.map((tag, index) =>
              <Button key={index} variant='outlined' style={{ textTransform: 'none' }}>{tag}</Button>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
}
