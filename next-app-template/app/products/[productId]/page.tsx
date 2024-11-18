'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { IconArrowLeft, IconHeart, IconShoppingCart } from '@tabler/icons-react';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Image,
  LoadingOverlay,
  Modal,
  Rating,
  Text,
  Title,
} from '@mantine/core';
import { HeaderMegaMenu } from '@/components/ui/Header/Header';
import StickyHeader from '@/components/ui/StickyHeader/StickyHeader';

export default function ProductDetailPage() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(true);
  const router = useRouter();

  const { productId } = useParams();

  const fetchProduct = async () => {
    setLoading(true);
    const response = await fetch(`http://localhost:5001/api/products/${productId}`);
    const data = await response.json();
    setProduct(data);
    setLoading(false);
  };

  useEffect(() => {
    if (productId) fetchProduct();
  }, [productId]);

  const goBack = () => router.push('/catalog');

  if (loading) return <LoadingOverlay visible={loading} />;

  return (
    <>
      <HeaderMegaMenu />

      <StickyHeader />

      {/* Modal for Product Details */}
      <Modal
        opened={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={product?.title || 'Детали товара'}
        centered
        size="lg"
        padding="md"
      >
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '30px',
            padding: '30px',
            borderRadius: '16px',
            boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
            backgroundColor: '#fff',
          }}
        >
          {/* Image and Title Section */}
          <Box style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            <Image
              src={product?.image}
              alt={product?.title}
              width={300}
              height={300}
              style={{
                width: '300px',
                height: '300px',
                borderRadius: '16px',
                objectFit: 'cover',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
              }}
            />

            {/* Product Information */}
            <Box style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Title order={2}>{product?.title}</Title>
                <ActionIcon variant="light" radius="xl" size="lg">
                  <IconHeart size={20} />
                </ActionIcon>
              </div>

              <Text color="dimmed" size="sm" mt="xs">
                От {product?.autor}
              </Text>
              <Rating value={product?.rating} readOnly mt="sm" />

              <Text mt="md" size="sm" style={{ lineHeight: 1.6 }}>
                {product?.description}
              </Text>

              <Group mt="lg" align="center">
                <Text size="xl" color="red">
                  {product?.price} ₽
                </Text>
                {product?.oldPrice && (
                  <Text color="dimmed" style={{ textDecoration: 'line-through' }}>
                    {product.oldPrice} ₽
                  </Text>
                )}
                {product?.discount && (
                  <Badge color="green" radius="sm" size="lg">
                    -{product.discount}%
                  </Badge>
                )}
              </Group>
              <Text size="xs" color="dimmed" mt="xs">
                Скидка действует до {new Date(product?.discountValidUntil).toLocaleDateString()}
              </Text>

              <Button
                mt="lg"
                radius="md"
                fullWidth
                variant="filled"
                leftSection={<IconShoppingCart size={18} />}
                style={{
                  backgroundColor: '#54e382',
                  color: '#000',
                  boxShadow: '0px 4px 12px rgba(84, 227, 130, 0.3)',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                Добавить в корзину
              </Button>
            </Box>
          </Box>

          {/* Divider and Details Section */}
          <Divider my="xl" />
          <Box>
            <Title order={4} mb="sm">
              Детали товара
            </Title>
            <Box style={{ lineHeight: 1.6 }}>
              <Text size="sm">
                Пищевая ценность: белки - {product?.nutrition?.proteins || 'N/A'}, жиры -{' '}
                {product?.nutrition?.fats || 'N/A'}, углеводы -{' '}
                {product?.nutrition?.carbohydrates || 'N/A'}
              </Text>
              <Text size="sm" mt="xs">
                Энергетическая ценность: {product?.energyValue?.kcal} ккал /{' '}
                {product?.energyValue?.kJ} кДж
              </Text>
              <Text size="sm" mt="xs">
                Срок годности: {product?.expiration}
              </Text>
              <Text size="sm" mt="xs">
                Условия хранения: {product?.storageConditions}
              </Text>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
