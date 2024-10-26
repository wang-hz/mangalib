"use client"

import { usePagedMangas } from "@/app/hooks";
import { MangaCard } from "@/components/manga-card";
import { Box, Pagination, Stack, Typography } from "@mui/material";
import { Manga } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function MangaList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageIndex = parseInt(searchParams.get('pageIndex') ?? '') || 1;
  const pageSize = parseInt(searchParams.get('pageSize') ?? '') || 20;
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
    <Stack flex={1} gap={2} margin={2}>
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
      <Box flex={1} gap={2} display='flex' flexDirection='row' flexWrap='wrap' justifyContent='center'>
        {mangas?.map((manga: Manga, index: number) =>
          <MangaCard key={index} manga={manga}/>
        )}
      </Box>
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
