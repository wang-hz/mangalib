"use client"

import { usePagedMangas } from "@/app/hooks";
import { Card, CardActionArea, CardHeader, CardMedia, Grid2, Pagination, Stack, Typography } from "@mui/material";
import { Manga } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function MangaGrid() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageIndex = parseInt(searchParams.get('pageIndex') ?? '') || 1;
  const pageSize = parseInt(searchParams.get('pageSize') ?? '') || 12;
  const [pageCount, setPageCount] = useState(0);
  const { total, mangas } = usePagedMangas(pageIndex, pageSize);

  useEffect(
    () => setPageCount(Math.ceil(total / pageSize)),
    [pageSize, total]
  );

  const handlePaginationChange = (_: React.ChangeEvent<unknown>, value: number) => {
    router.push('/mangas?' + new URLSearchParams({
      pageIndex: value.toString(),
      pageSize: pageSize.toString()
    }));
  };

  return (
    <Stack flex={1} gap={2} margin={4}>
      {pageCount > 0 &&
        <Stack alignItems='center' gap={1}>
          <Pagination
            count={pageCount}
            page={pageIndex}
            onChange={handlePaginationChange}
          />
          <Typography>
            {`${total} mangas are found.`}
          </Typography>
        </Stack>
      }
      <Grid2 container flex={1} spacing={2}>
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
        <Stack alignItems='center'>
          <Pagination
            count={pageCount}
            page={pageIndex}
            onChange={handlePaginationChange}
          />
        </Stack>
      }
    </Stack>
  );
}
