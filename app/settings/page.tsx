"use client"

import { useMangasUpdateStatus } from "@/app/hooks";
import { UpdateRecordStatus } from "@/app/models";
import { updateMangas } from "@/app/requests";
import { Box, Button, Container, LinearProgress, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function Settings() {
  const { mangasUpdateStatus } = useMangasUpdateStatus();
  const [updating, setUpdating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [updateStatus, setUpdateStatus] = useState('');

  useEffect(() => {
      setUpdating(mangasUpdateStatus?.status !== UpdateRecordStatus.ALL_UPDATED);
      setProgress(100 * mangasUpdateStatus?.progress / mangasUpdateStatus?.total);
      if (mangasUpdateStatus?.status === UpdateRecordStatus.UPDATING) {
        setUpdating(true);
        setProgress(100 * mangasUpdateStatus?.progress / mangasUpdateStatus?.total);
        setUpdateStatus('updating existing mangas...');
      } else if (mangasUpdateStatus?.status === UpdateRecordStatus.CREATING) {
        setUpdating(true);
        setProgress(100 * mangasUpdateStatus?.progress / mangasUpdateStatus?.total);
        setUpdateStatus('appending new mangas...');
      } else {
        setUpdating(false);
        setProgress(0);
        setUpdateStatus('');
      }
    },
    [mangasUpdateStatus]
  );

  const handleUpdateLibraryClick = () => updateMangas().then(() => setUpdating(true));

  return (
    <Container>
      <Stack gap={4} marginTop={4}>
        <Box display='flex' flexDirection='row' justifyContent='space-between' alignItems='baseline'>
          <Button
            disabled={updating}
            variant='contained'
            onClick={handleUpdateLibraryClick}
          >
            update library
          </Button>
          <Typography>{updateStatus}</Typography>
        </Box>
        {updating &&
          <LinearProgress variant="determinate" value={progress}/>
        }
      </Stack>
    </Container>
  );
}
