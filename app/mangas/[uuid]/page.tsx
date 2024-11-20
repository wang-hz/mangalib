"use client"

import { useManga } from "@/app/hooks";
import {
  Button,
  Chip,
  Container,
  Link,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Tag {
  name: string,
  type: string | null
}

export default function Manga({ params }: { params: { uuid: string } }) {
  const router = useRouter();
  const { manga } = useManga(params.uuid);
  const [artists, setArtists] = useState<string[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [events, setEvents] = useState<string[]>([]);
  const [parodies, setParodies] = useState<string[]>([]);
  const [customTags, setCustomTags] = useState<string[]>([]);

  useEffect(() => {
    if (!Array.isArray(manga?.tags)) {
      return;
    }
    setArtists(manga.tags.filter((tag: Tag) => tag.type === 'artist').map((tag: Tag) => tag.name));
    setGroups(manga.tags.filter((tag: Tag) => tag.type === 'group').map((tag: Tag) => tag.name));
    setEvents(manga.tags.filter((tag: Tag) => tag.type === 'event').map((tag: Tag) => tag.name));
    setParodies(manga.tags.filter((tag: Tag) => tag.type === 'parody').map((tag: Tag) => tag.name));
    setCustomTags(manga.tags.filter((tag: Tag) => !tag.type).map((tag: Tag) => tag.name));
  }, [manga]);

  const handleStartReadingButtonClick = () => {
    router.push(`/mangas/${params.uuid}/images`);
  };

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
      <Stack direction='row' gap={4}>
        <Link href={`/mangas/${params.uuid}/images`}>
          <Paper sx={{ position: 'relative', width: 300, height: 400 }}>
            {manga?.coverFilename &&
              <Image src={`/api/images/${manga.coverFilename}`} alt='cover' fill objectFit='contain'/>
            }
          </Paper>
        </Link>
        <Stack flex={1}>
          <Stack flex={1} gap={4}>
            <Stack>
              <Typography variant='h6'>{manga?.title}</Typography>
              {manga?.title !== manga?.originalTitle &&
                <Typography variant='subtitle1'>{manga?.originalTitle}</Typography>
              }
              <Typography variant='subtitle2'>{manga?.fullTitle}</Typography>
            </Stack>
            <Stack gap={1}>
              {artists.length > 0 &&
                <Stack direction='row' gap={1}>
                  {artists.map((artist: string, index: number) =>
                    <Chip key={index} label={`artist: ${artist}`} variant='outlined'/>
                  )}
                </Stack>
              }
              {groups.length > 0 &&
                <Stack direction='row' gap={1}>
                  {groups.map((group: string, index: number) =>
                    <Chip key={index} label={`group: ${group}`} variant='outlined'/>
                  )}
                </Stack>
              }
              {events.length > 0 &&
                <Stack direction='row' gap={1}>
                  {events.map((event: string, index: number) =>
                    <Chip key={index} label={`event: ${event}`} variant='outlined'/>
                  )}
                </Stack>
              }
              {parodies.length > 0 &&
                <Stack direction='row' gap={1}>
                  {parodies.map((parody: string, index: number) =>
                    <Chip key={index} label={`parody: ${parody}`} variant='outlined'/>
                  )}
                </Stack>
              }
              {customTags.length > 0 &&
                <Stack direction='row' gap={1}>
                  {customTags.map((customTag: string, index: number) =>
                    <Chip key={index} label={customTag} variant='outlined'/>
                  )}
                </Stack>
              }
            </Stack>
          </Stack>
          <Stack alignItems='flex-start'>
            <Button variant='contained' onClick={handleStartReadingButtonClick}>read</Button>
          </Stack>
        </Stack>
      </Stack>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {manga?.path &&
              <TableRow>
                <TableCell align='right' width={300}>path</TableCell>
                <TableCell>{manga.path}</TableCell>
              </TableRow>
            }
            {manga?.fileModifiedTime &&
              <TableRow>
                <TableCell align='right' width={300}>file modified time</TableCell>
                <TableCell>{new Date(manga.fileModifiedTime).toLocaleString()}</TableCell>
              </TableRow>
            }
            {manga?.createdAt &&
              <TableRow>
                <TableCell align='right' width={300}>created at</TableCell>
                <TableCell>{new Date(manga.createdAt).toLocaleString()}</TableCell>
              </TableRow>
            }
            {manga?.updatedAt &&
              <TableRow>
                <TableCell align='right' width={300}>updated at</TableCell>
                <TableCell>{new Date(manga.updatedAt).toLocaleString()}</TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
