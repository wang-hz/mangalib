"use client"

import { useManga } from "@/app/hooks";
import { updateManga } from "@/app/requests";
import {
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";

export default function Manga({ params }: { params: { uuid: string } }) {
  const router = useRouter();
  const { manga, reloadManga } = useManga(params.uuid);
  const [artists, setArtists] = useState<string[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [events, setEvents] = useState<string[]>([]);
  const [parodies, setParodies] = useState<string[]>([]);
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    if (!Array.isArray(manga?.tags)) {
      return;
    }
    setArtists(manga.tags
      .filter(({ type }: { type: string }) => type === 'artist')
      .map(({ name }: { name: string }) => name)
    );
    setGroups(manga.tags
      .filter(({ type }: { type: string }) => type === 'group')
      .map(({ name }: { name: string }) => name)
    );
    setEvents(manga.tags
      .filter(({ type }: { type: string }) => type === 'event')
      .map(({ name }: { name: string }) => name)
    );
    setParodies(manga.tags
      .filter(({ type }: { type: string }) => type === 'parody')
      .map(({ name }: { name: string }) => name)
    );
    setCustomTags(manga.tags
      .filter(({ type }: { type: string }) => !type)
      .map(({ name }: { name: string }) => name)
    );
  }, [manga]);

  const handleReadClick = () => {
    router.push(`/mangas/${params.uuid}/images`);
  };

  const handleEditClick = () => {
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };

  return <>
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
          <Stack alignItems='flex-start' direction='row' gap={2}>
            <Button variant='contained' onClick={handleReadClick}>read</Button>
            <Button variant='outlined' onClick={handleEditClick}>edit</Button>
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
    <Dialog
      open={editDialogOpen}
      onClose={handleEditDialogClose}
      PaperProps={{
        component: 'form',
        onSubmit: async (event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries((formData as any).entries());
          const title = formJson.title;
          const originalTitle = formJson.originalTitle;
          const fullTitle = formJson.fullTitle;
          await updateManga(params.uuid, { title, originalTitle, fullTitle });
          await reloadManga();
          handleEditDialogClose();
        },
      }}
    >
      <DialogTitle>EDIT</DialogTitle>
      <DialogContent>
        <DialogContentText></DialogContentText>
        <TextField
          autoFocus
          fullWidth
          defaultValue={manga?.title}
          margin='dense'
          name='title'
          label='Title'
          variant='standard'
        />
        <TextField
          autoFocus
          fullWidth
          defaultValue={manga?.originalTitle}
          margin='dense'
          name='originalTitle'
          label='Original Title'
          variant='standard'
        />
        <TextField
          autoFocus
          fullWidth
          defaultValue={manga?.fullTitle}
          margin='dense'
          name='fullTitle'
          label='Full Title'
          variant='standard'
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleEditDialogClose}>cancel</Button>
        <Button type='submit'>save</Button>
      </DialogActions>
    </Dialog>
  </>;
}
