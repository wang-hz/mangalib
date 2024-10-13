"use client"

import { getMangasByPage } from "@/app/requests";
import { Card, CardActionArea, CardHeader, CardMedia, Container, Grid2, Pagination } from "@mui/material";
import { manga } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const pageIndex = parseInt(searchParams.get('pageIndex') ?? '') || 1;
  const pageSize = parseInt(searchParams.get('pageSize') ?? '') || 12;

  const [mangas, setMangas] = useState<manga[]>([]);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    setMangas([]);
    getMangasByPage(pageIndex, pageSize)
      .then((data) => {
        setMangas(data.items);
        setPageCount(Math.ceil(data.total / pageSize));
      })
  }, [pageIndex, pageSize]);

  const handlePaginationChange = (_: React.ChangeEvent<unknown>, value: number) => {
    router.push('/mangas?' + new URLSearchParams({
      pageIndex: value.toString(),
      pageSize: pageSize.toString()
    }));
  };

  return (
    <Container sx={{ paddingTop: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Grid2 container spacing={2}>
        {mangas.map((manga, index) =>
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
      <Pagination
        count={pageCount}
        page={pageIndex}
        onChange={handlePaginationChange}
      />
    </Container>
  );
}
