import {
  IconBook,
  IconGridDots,
  IconHeart,
  IconSearch,
  IconShoppingCart,
  IconUserEdit,
} from '@tabler/icons-react';
import { Anchor, Button, Group, Input, Text, Title } from '@mantine/core';
import { ImageCarousel } from '../ui/Carousel/Carousel';
import { FooterLinks } from '../ui/Footer/Footer';
import { HeaderMegaMenu } from '../ui/Header/Header';
import InfoSection from '../ui/InfoSection/InfoSection';
import NewArrivalsCarousel from '../ui/News/News';
import { ProductCarousel } from '../ui/ProductCarousel/ProductCarosel';
import { StickyHeader } from '../ui/StickyHeader/StickyHeader';
import SuppliersCarousel from '../ui/SuplierCard/SuplierCard';
import classes from './Welcome.module.css';

export function Welcome() {
  return (
    <>
      <HeaderMegaMenu />
      <StickyHeader />

      <ImageCarousel />
      <ProductCarousel />
      <NewArrivalsCarousel />
      <SuppliersCarousel />
      <InfoSection />
      <FooterLinks />
    </>
  );
}
