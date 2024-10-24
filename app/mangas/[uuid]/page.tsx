"use client"

import { useManga } from "@/app/hooks";
import { Button, ButtonGroup, Container, Link, Paper, Stack, Typography } from "@mui/material";
import Image from "next/image";

export default function Manga({ params }: { params: { uuid: string } }) {
  const { manga } = useManga(params.uuid);

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
        <Link href={`/mangas/${params.uuid}/images`}>
          <Paper sx={{ position: 'relative', width: 300, height: 400 }}>
            {manga?.coverFilename &&
              <Image src={`/api/images/${manga.coverFilename}`} alt='cover' fill objectFit='contain'/>}
          </Paper>
        </Link>
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
            {JSON.parse(manga?.tags ?? '[]').map((tag: string, index: number) =>
              <Button key={index} variant='outlined' style={{ textTransform: 'none' }}>{tag}</Button>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
}
