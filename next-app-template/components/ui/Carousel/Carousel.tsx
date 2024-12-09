'use client';

import { Carousel } from '@mantine/carousel';
import { Image } from '@mantine/core';

export function ImageCarousel() {
  return (
    <Carousel mt="10" withIndicators slideSize="100%" loop>
      <Carousel.Slide>
        <Image
          src="./2beram.jpeg"
          alt="Slide 1"
          height={600}
        />
      </Carousel.Slide>
  
    </Carousel>
  );
}
