"use client"

import { useMangasUpdateStatus, usePagedMangas } from "@/app/hooks";
import { UpdateRecordStatus } from "@/app/models";
import { updateMangas } from "@/app/requests";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardHeader,
  CardMedia,
  Container,
  Grid2,
  LinearProgress,
  Pagination
} from "@mui/material";
import { Manga } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageIndex = parseInt(searchParams.get('pageIndex') ?? '') || 1;
  const pageSize = parseInt(searchParams.get('pageSize') ?? '') || 18;
  const { total, mangas } = usePagedMangas(pageIndex, pageSize);
  const { mangasUpdateStatus } = useMangasUpdateStatus();
  const [pageCount, setPageCount] = useState(0);
  const [updating, setUpdating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [buttonText, setButtonText] = useState('update library');

  useEffect(() => setPageCount(Math.ceil(total / pageSize)),
    [total, pageIndex, pageSize]
  );

  useEffect(() => {
      setUpdating(mangasUpdateStatus?.status !== UpdateRecordStatus.ALL_UPDATED);
      setProgress(100 * mangasUpdateStatus?.progress / mangasUpdateStatus?.total);
      if (mangasUpdateStatus?.status === UpdateRecordStatus.UPDATING) {
        setUpdating(true);
        setProgress(100 * mangasUpdateStatus?.progress / mangasUpdateStatus?.total);
        setButtonText('updating existing mangas');
      } else if (mangasUpdateStatus?.status === UpdateRecordStatus.CREATING) {
        setUpdating(true);
        setProgress(100 * mangasUpdateStatus?.progress / mangasUpdateStatus?.total);
        setButtonText('appending new mangas');
      } else {
        setUpdating(false);
        setProgress(0);
        setButtonText('update library');
      }
    },
    [mangasUpdateStatus]
  );

  const handleUpdateLibraryClick = () => {
    updateMangas()
      .then(() => setUpdating(true))
      .catch((error) => console.error(error));
  };

  const handlePaginationChange = (_: React.ChangeEvent<unknown>, value: number) => {
    router.push('/mangas?' + new URLSearchParams({
      pageIndex: value.toString(),
      pageSize: pageSize.toString()
    }));
  };

  return (
    <Box>
      {updating && <LinearProgress variant='determinate' value={progress}/>}
      <Container sx={{ paddingTop: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          variant='outlined'
          onClick={handleUpdateLibraryClick}
          disabled={updating}
        >
          {buttonText}
        </Button>
        <Grid2 container spacing={2}>
          {mangas?.map((manga: Manga, index: number) =>
            <Grid2 key={index} size={2}>
              <Card>
                <CardActionArea href={`/mangas/${manga.uuid}`}>
                  <CardHeader
                    title={manga.fullTitle}
                    titleTypographyProps={{ fontSize: 14 }}
                  />
                  <CardMedia
                    component='img'
                    image={`/api/images/${manga.coverFilename}`}
                    alt={manga.title ?? ''}
                  />
                </CardActionArea>
              </Card>
            </Grid2>
          )}
        </Grid2>
        {pageCount > 0 &&
          <Pagination
            count={pageCount}
            page={pageIndex}
            onChange={handlePaginationChange}
          />
        }
      </Container>
    </Box>
  );
}
