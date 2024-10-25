"use client"

import { useManga } from "@/app/hooks";
import { Box, Chip, Container, Link, Paper, Stack, Typography } from "@mui/material";
import Image from "next/image";

export default function Manga({ params }: { params: { uuid: string } }) {
  const { manga } = useManga(params.uuid);

  return (
    <Container sx={{ paddingTop: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Stack direction='row' gap={4} margin={4}>
        <Link href={`/mangas/${params.uuid}/images`}>
          <Paper sx={{ position: 'relative', width: 300, height: 400 }}>
            {manga?.coverFilename &&
              <Image src={`/api/images/${manga.coverFilename}`} alt='cover' fill objectFit='contain'/>
            }
          </Paper>
        </Link>
        <Stack gap={4}>
          <Stack gap={1}>
            <Stack direction='row' gap={1} sx={{ alignItems: 'baseline' }}>
              <Typography variant='h6'>{manga?.title}</Typography>
              {manga?.title !== manga?.originalTitle &&
                <Typography variant='subtitle1'>{manga?.originalTitle}</Typography>
              }
            </Stack>
            <Typography variant='subtitle2'>{manga?.fullTitle}</Typography>
          </Stack>
          <Stack gap={1}>
            {manga?.artist &&
              <Box>
                <Chip label={`artist: ${manga.artist}`} variant='outlined'/>
              </Box>
            }
            {manga?.group &&
              <Box>
                <Chip label={`group: ${manga.group}`} variant='outlined'/>
              </Box>
            }
            {manga?.event &&
              <Box>
                <Chip label={`event: ${manga.event}`} variant='outlined'/>
              </Box>
            }
            {manga?.parody &&
              <Box>
                <Chip label={`parody: ${manga.parody}`} variant='outlined'/>
              </Box>
            }
            <Stack direction='row' gap={1}>
              {JSON.parse(manga?.tags ?? '[]').map((tag: string, index: number) =>
                <Chip key={index} label={tag} variant='outlined'/>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
}
