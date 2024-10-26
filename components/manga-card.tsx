import { Box, Link, Paper, Typography } from "@mui/material";
import { Manga } from "@prisma/client";
import Image from "next/image";
import React from "react";

export function MangaCard(props: { manga: Manga }) {
  return (
    <Link
      href={`/mangas/${props.manga.uuid}`}
      underline='none'
    >
      <Paper sx={{ width: 200, height: 300, display: 'flex', flexDirection: 'column' }}>
        <Box marginX={2} marginY={1}>
          <Typography
            variant='body2'
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {props.manga.fullTitle}
          </Typography>
        </Box>
        <Box sx={{ position: 'relative', flex: 1 }}>
          <Image src={`/api/images/${props.manga.coverFilename}`} alt='cover' fill objectFit='contain'/>
        </Box>
      </Paper>
    </Link>
  );
}
