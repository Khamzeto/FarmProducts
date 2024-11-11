'use client';

import { Carousel } from '@mantine/carousel';
import { Image } from '@mantine/core';

export function ImageCarousel() {
  return (
    <Carousel mt="10" withIndicators slideSize="100%" loop>
      <Carousel.Slide>
        <Image
          src="https://cdn.esh-derevenskoe.ru/image/cache/catalog/c30f08-1150x450.jpg?v=3"
          alt="Slide 1"
          height={600}
        />
      </Carousel.Slide>
      <Carousel.Slide>
        <Image
          src="https://cdn.esh-derevenskoe.ru/image/cache/catalog/c30f08-1150x450.jpg?v=3"
          alt="Slide 2"
          fit="cover"
          height={600}
        />
      </Carousel.Slide>
      <Carousel.Slide>
        <Image
          src="https://cdn.esh-derevenskoe.ru/image/cache/catalog/c30f08-1150x450.jpg?v=3"
          alt="Slide 3"
          fit="cover"
          height={600}
        />
      </Carousel.Slide>
    </Carousel>
  );
}
