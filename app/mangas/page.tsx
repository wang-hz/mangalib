"use client"

import { Box, List, ListItemButton, ListItemText, Pagination } from "@mui/material";
import { manga } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const getMangasByPage = async (pageIndex: number, pageSize: number) => {
  return fetch('/api/mangas?' + new URLSearchParams({
    pageIndex: pageIndex.toString(),
    pageSize: pageSize.toString()
  }).toString())
    .then((response) => {
      if (!response.ok) {
        throw new Error('failed to fetch mangas');
      }
      return response.json();
    })
    .catch((error) => {
      console.error(error);
    });
};

export default function Home() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const pageIndex = parseInt(searchParams.get('pageIndex') ?? '') || 1;
  const pageSize = parseInt(searchParams.get('pageSize') ?? '') || 10;

  const [mangas, setMangas] = useState<manga[]>([]);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
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
    <Box>
      <List>
        {mangas.map((manga, index) =>
          <ListItemButton key={index} href={`/mangas/${manga.uuid}`}>
            <ListItemText primary={manga.fullTitle}/>
          </ListItemButton>
        )}
      </List>
      <Pagination
        count={pageCount}
        page={pageIndex}
        onChange={handlePaginationChange}
      />
    </Box>
  );
}
