"use client"

import { useImages } from "@/app/hooks";
import { Box, Container, Slider } from "@mui/material";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Home({ params }: { params: { uuid: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const imageIndex = parseInt(searchParams.get('imageIndex') ?? '') || 1;
  const { images } = useImages(params.uuid);
  const [currentImage, setCurrentImage] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!images) {
      return;
    }
    setCurrentImage(images[imageIndex - 1]);
  }, [imageIndex, images]);

  const handleSliderChange = (event: Event, value: number | number[], activeThumb: number) => {
    if (value === imageIndex) {
      return;
    }
    router.push(`/mangas/${params.uuid}/images?` + new URLSearchParams({ imageIndex: value.toString() }));
  };

  return (
    <Container sx={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 2, gap: 2 }}>
      <Box sx={{ flex: 1, position: 'relative' }}>
        {currentImage &&
          <Image src={currentImage} alt={imageIndex.toString()} fill objectFit='contain'/>
        }
      </Box>
      <Box>
        <Slider
          defaultValue={imageIndex}
          step={1}
          min={1}
          max={images?.length}
          valueLabelDisplay={'auto'}
          onChange={handleSliderChange}
        />
      </Box>
    </Container>
  );
}
