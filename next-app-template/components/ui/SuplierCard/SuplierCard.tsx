'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Carousel } from '@mantine/carousel';
import { Avatar, Card, Group, Image, Rating, Text, Title } from '@mantine/core';

function SupplierCard({ userId, avatar, name, description, products }) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/user/${userId}`);
  };

  return (
    <Card
      padding="lg"
      radius="18"
      style={{ minHeight: '300px', cursor: 'pointer' }}
      onClick={handleCardClick}
    >
      <Group align="center">
        <Avatar src={avatar} size="lg" radius="xl" />
        <div>
          <Text size="lg">{name}</Text>
          <Rating value={5} readOnly size="sm" />
          <Text size="sm" color="dimmed">
            {description}
          </Text>
        </div>
      </Group>

      <Group mt="50" style={{ gap: '8px', justifyContent: 'space-between' }}>
        {products.map((product, index) => (
          <Image
            key={index}
            src={product.image}
            alt={product.title}
            height={100}
            width={100}
            radius="md"
            fit="cover"
          />
        ))}
      </Group>
    </Card>
  );
}

export function SuppliersCarousel() {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    async function fetchSuppliers() {
      try {
        const response = await fetch('http://localhost:5001/api/auth/sellers');
        const data = await response.json();
        setSuppliers(
          data.map((seller) => ({
            userId: seller._id, // Ensure each supplier has an ID for navigation
            avatar: seller.photo,
            name: `${seller.firstName} ${seller.lastName}`,
            description: seller.product || 'Описание отсутствует',
            products: seller.products || [],
          }))
        );
      } catch (error) {
        console.error('Ошибка при загрузке поставщиков:', error);
      }
    }
    fetchSuppliers();
  }, []);

  return (
    <div style={{ backgroundColor: '#f4f4f4', padding: '40px 0', maxHeight: '600px' }}>
      <div style={{ maxWidth: '90%', margin: 'auto', padding: '20px 0' }}>
        <Title size="30" mb="40" mt="20">
          Наши поставщики
        </Title>

        <Carousel slideSize="33%" slideGap="20" loop align="start">
          {suppliers.map((supplier, index) => (
            <Carousel.Slide key={index}>
              <SupplierCard {...supplier} />
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>
    </div>
  );
}

export default SuppliersCarousel;
