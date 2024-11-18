'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  IconArrowLeft,
  IconHeart,
  IconMinus,
  IconPlus,
  IconShoppingCart,
} from '@tabler/icons-react';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Group,
  Image,
  Paper,
  Rating,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { HeaderMegaMenu } from '@/components/ui/Header/Header';
import ProductModal from '@/components/ui/ProductModal/ProductModal';
import StickyHeader from '@/components/ui/StickyHeader/StickyHeader';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [favorites, setFavorites] = useState({});
  const [cart, setCart] = useState({});

  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');

  useEffect(() => {
    fetchProducts();
    loadFavorites();
    loadCart();

    const handleCartUpdated = loadCart;
    const handleFavoritesUpdated = loadFavorites;

    window.addEventListener('cartUpdated', handleCartUpdated);
    window.addEventListener('favoritesUpdated', handleFavoritesUpdated);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdated);
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdated);
    };
  }, [category, subcategory]);

  const loadFavorites = () => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || {};
    setFavorites(storedFavorites);
  };

  const loadCart = () => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || {};
    setCart(storedCart);
  };

  const fetchProducts = async () => {
    const query = category
      ? `category=${encodeURIComponent(category)}`
      : `subcategory=${encodeURIComponent(subcategory)}`;
    const response = await fetch(`http://localhost:5001/api/products?${query}`);
    const data = await response.json();
    setProducts(data);

    const categoriesResponse = await fetch('http://localhost:5001/api/categories');
    const categoriesData = await categoriesResponse.json();

    const selected = categoriesData.find(
      (cat) => cat.name === category || cat.subcategories.some((sub) => sub.name === subcategory)
    );
    setSelectedCategory(selected);
    setSubcategories(selected?.subcategories || []);
  };

  const toggleFavorite = (product) => {
    const updatedFavorites = { ...favorites };
    if (updatedFavorites[product._id]) {
      delete updatedFavorites[product._id];
    } else {
      updatedFavorites[product._id] = product;
    }
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);

    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  const addToCart = (product) => {
    const updatedCart = { ...cart };
    if (updatedCart[product._id]) {
      updatedCart[product._id].quantity += 1;
    } else {
      updatedCart[product._id] = { ...product, quantity: 1 };
    }
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCart(updatedCart);

    window.dispatchEvent(new Event('cartUpdated'));
  };

  const incrementQuantity = (productId) => {
    const updatedCart = { ...cart };
    updatedCart[productId].quantity += 1;
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCart(updatedCart);

    window.dispatchEvent(new Event('cartUpdated'));
  };

  const decrementQuantity = (productId) => {
    const updatedCart = { ...cart };
    if (updatedCart[productId].quantity > 1) {
      updatedCart[productId].quantity -= 1;
    } else {
      delete updatedCart[productId];
    }
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCart(updatedCart);

    window.dispatchEvent(new Event('cartUpdated'));
  };

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  return (
    <>
      <HeaderMegaMenu />
      <StickyHeader />
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />

      <Box mt="30" style={{ maxWidth: 1200, margin: 'auto', display: 'flex' }}>
        <Paper p="20" radius="20" withBorder style={{ width: 250, marginRight: 20 }}>
          <Title order={4} mb="sm">
            Категории
          </Title>
          <Stack mt="20">
            {selectedCategory && (
              <>
                <Text
                  style={{
                    cursor: 'pointer',
                    fontWeight: category === selectedCategory.name ? 700 : 500,
                  }}
                  onClick={() =>
                    router.push(`/products?category=${encodeURIComponent(selectedCategory.name)}`)
                  }
                >
                  {selectedCategory.name}
                </Text>
                <Stack pl="md">
                  {subcategories.map((sub) => (
                    <Text
                      key={sub.id}
                      size="sm"
                      color="dimmed"
                      style={{
                        cursor: 'pointer',
                        fontWeight: subcategory === sub.name ? 700 : 500,
                      }}
                      onClick={() =>
                        router.push(`/products?subcategory=${encodeURIComponent(sub.name)}`)
                      }
                    >
                      - {sub.name}
                    </Text>
                  ))}
                </Stack>
              </>
            )}
          </Stack>
        </Paper>

        <Box style={{ flexGrow: 1 }}>
          <Button
            variant="outline"
            radius="14"
            leftSection={<IconArrowLeft />}
            onClick={() => router.push('/catalog')}
            style={{ marginBottom: '20px' }}
          >
            Назад к каталогу
          </Button>
          <Title order={3} mb="md">
            {category ? ` ${category}` : ` ${subcategory}`}
          </Title>

          <div
            style={{
              display: 'grid',
              gap: '20px',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            }}
          >
            {products.length > 0 ? (
              products.map((product) => (
                <Card
                  key={product._id}
                  padding="lg"
                  radius="18"
                  withBorder
                  style={{ minHeight: '400px', position: 'relative', cursor: 'pointer' }}
                >
                  <Card.Section onClick={() => openProductModal(product)}>
                    <Image src={product.image} height={160} alt={product.title} />
                    <Badge
                      color="red"
                      size="sm"
                      radius="sm"
                      variant="filled"
                      style={{ position: 'absolute', top: 10, left: 10 }}
                    >
                      {`${product.discount}%`}
                    </Badge>
                    <ActionIcon
                      variant="default"
                      radius="xl"
                      size="lg"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent modal from opening
                        toggleFavorite(product);
                      }}
                      style={{ position: 'absolute', top: 10, right: 10 }}
                    >
                      <IconHeart
                        color={favorites[product._id] ? 'red' : 'gray'}
                        fill={favorites[product._id] ? 'red' : 'none'}
                        size={18}
                      />
                    </ActionIcon>
                  </Card.Section>

                  <Group mt="md" mb="xs">
                    <Text>{product.title}</Text>
                    <Text size="xs" color="dimmed">
                      {product.description}
                    </Text>
                  </Group>

                  <Group mt="xs">
                    <Text color="dimmed" style={{ textDecoration: 'line-through' }}>
                      {product.oldPrice} ₽
                    </Text>
                    <Text color="red" size="xl">
                      {product.price} ₽
                    </Text>
                  </Group>
                  <Rating value={product.rating} readOnly mt="xs" />

                  {cart[product._id] ? (
                    <Group
                      mt="md"
                      style={{
                        backgroundColor: '#f0f0f0',
                        padding: '10px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <ActionIcon
                        size="lg"
                        radius="xl"
                        variant="filled"
                        style={{ backgroundColor: '#54e382', color: 'black' }}
                        onClick={() => decrementQuantity(product._id)}
                      >
                        <IconMinus size={16} />
                      </ActionIcon>
                      <Text size="lg" style={{ margin: '0 15px' }}>
                        {cart[product._id].quantity}
                      </Text>
                      <ActionIcon
                        size="lg"
                        radius="xl"
                        variant="filled"
                        style={{ backgroundColor: '#54e382', color: 'black' }}
                        onClick={() => incrementQuantity(product._id)}
                      >
                        <IconPlus size={16} />
                      </ActionIcon>
                    </Group>
                  ) : (
                    <Button
                      style={{ backgroundColor: '#54e382', color: 'black' }}
                      fullWidth
                      mt="md"
                      radius="md"
                      leftSection={<IconShoppingCart size={18} />}
                      onClick={() => addToCart(product)}
                    >
                      В корзину
                    </Button>
                  )}
                </Card>
              ))
            ) : (
              <Text>Нет продуктов для отображения</Text>
            )}
          </div>
        </Box>
      </Box>
    </>
  );
}
