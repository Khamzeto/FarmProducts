'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  IconHeart,
  IconInfoCircle,
  IconMail,
  IconMinus,
  IconPackage,
  IconPlus,
  IconShoppingCart,
  IconUser,
} from '@tabler/icons-react';
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Image,
  Loader,
  Paper,
  Rating,
  SimpleGrid,
  Text,
  Title,
} from '@mantine/core';
import { HeaderMegaMenu } from '@/components/ui/Header/Header';
import ProductModal from '@/components/ui/ProductModal/ProductModal';
import StickyHeader from '@/components/ui/StickyHeader/StickyHeader';

export default function ViewUserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();

  const userId = pathname.split('/').pop();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      console.error('ID пользователя не найден в URL');
      return;
    }

    async function fetchUserData() {
      try {
        const response = await fetch(`http://localhost:5001/api/auth/user/${userId}`);
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Ошибка при загрузке данных пользователя:', error);
      } finally {
        setLoading(false);
      }
    }

    async function fetchUserProducts() {
      try {
        const response = await fetch(`http://localhost:5001/api/products/user/${userId}`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Ошибка при загрузке продуктов пользователя:', error);
      }
    }

    fetchUserData();
    fetchUserProducts();
  }, [userId]);

  if (loading) return <Loader size="xl" />;
  if (!user) return <Text color="red">Пользователь не найден</Text>;

  function ProductCard({
    image,
    discount,
    title,
    description,
    price,
    oldPrice,
    rating,
    _id,
    autor,
    category,
    subcategory,
    discountValidUntil,
    energyValue,
    expiration,
    isWeighted,
    nutrition,
    storageConditions,
    weightRange,
  }) {
    const [quantity, setQuantity] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
      // Функция для синхронизации с localStorage
      const syncWithLocalStorage = () => {
        const cartData = JSON.parse(localStorage.getItem('cart')) || {};
        const favoritesData = JSON.parse(localStorage.getItem('favorites')) || {};
        setQuantity(cartData[_id]?.quantity || 0);
        setIsFavorite(!!favoritesData[_id]);
      };

      // Вызовем синхронизацию при первом рендере
      syncWithLocalStorage();

      // Добавим обработчик для события 'storage'
      window.addEventListener('storage', syncWithLocalStorage);

      return () => {
        window.removeEventListener('storage', syncWithLocalStorage);
      };
    }, [_id]);

    const updateLocalStorage = (newQuantity) => {
      const cartData = JSON.parse(localStorage.getItem('cart')) || {};
      if (newQuantity === 0) {
        delete cartData[_id];
      } else {
        cartData[_id] = { id: _id, title, image, price: Number(price), quantity: newQuantity };
      }
      localStorage.setItem('cart', JSON.stringify(cartData));

      // Принудительное обновление компонента через событие
      setQuantity(newQuantity);
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('cartUpdated'));
    };

    const handleAddToCart = (event) => {
      event.stopPropagation();
      updateLocalStorage(1);
    };

    const incrementQuantity = (event) => {
      event.stopPropagation();
      const newQuantity = quantity + 1;
      updateLocalStorage(newQuantity);
    };

    const decrementQuantity = (event) => {
      event.stopPropagation();
      const newQuantity = quantity > 1 ? quantity - 1 : 0;
      updateLocalStorage(newQuantity);
    };

    const toggleFavorite = (event) => {
      event.stopPropagation();
      const favoritesData = JSON.parse(localStorage.getItem('favorites')) || {};
      if (isFavorite) {
        delete favoritesData[_id];
      } else {
        favoritesData[_id] = { id: _id, title, image, price };
      }
      localStorage.setItem('favorites', JSON.stringify(favoritesData));
      setIsFavorite(!isFavorite);
      window.dispatchEvent(new Event('favoritesUpdated'));
    };

    return (
      <Card
        padding="lg"
        radius="18"
        style={{ minHeight: '400px', cursor: 'pointer' }}
        onClick={() => {
          setSelectedProduct({
            _id,
            image,
            discount,
            title,
            description,
            price,
            oldPrice,
            rating,
            autor,
            category,
            subcategory,
            discountValidUntil,
            energyValue,
            expiration,
            isWeighted,
            nutrition,
            storageConditions,
            weightRange,
          });
          setIsModalOpen(true);
        }}
      >
        <Card.Section>
          <Image src={image} height={160} alt={title} />
          {discount && (
            <Badge
              color="red"
              size="sm"
              radius="sm"
              variant="filled"
              style={{ position: 'absolute', top: 10, left: 10 }}
            >
              -{discount}%
            </Badge>
          )}
          <ActionIcon
            variant="default"
            radius="xl"
            size="lg"
            style={{ position: 'absolute', top: 10, right: 10, color: isFavorite ? 'red' : 'gray' }}
            onClick={toggleFavorite}
          >
            <IconHeart
              color={isFavorite ? 'red' : 'gray'}
              fill={isFavorite ? 'red' : 'none'}
              size={18}
            />
          </ActionIcon>
        </Card.Section>

        <Group mt="md" mb="xs">
          <Text>{title}</Text>
          <Text color="dimmed" size="xs">
            {description}
          </Text>
        </Group>

        <Group mt="xs">
          {oldPrice && (
            <Text color="dimmed" style={{ textDecoration: 'line-through' }}>
              {oldPrice} ₽
            </Text>
          )}
          <Text color="red" size="xl">
            {price} ₽
          </Text>
        </Group>

        <Rating value={rating} readOnly mt="xs" />

        {quantity === 0 ? (
          <Button
            style={{ backgroundColor: '#54e382', color: 'black' }}
            fullWidth
            mt="md"
            radius="md"
            leftSection={<IconShoppingCart size={18} />}
            onClick={handleAddToCart}
          >
            В корзину
          </Button>
        ) : (
          <Group
            mt="md"
            style={{
              backgroundColor: '#f0f0f0',
              padding: '10px',
              borderRadius: '12px',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <ActionIcon
              size="lg"
              radius="xl"
              color="teal"
              onClick={decrementQuantity}
              style={{ backgroundColor: '#54e382', color: 'black' }}
            >
              <IconMinus size={16} />
            </ActionIcon>
            <Text size="lg" style={{ margin: '0 15px' }}>
              {quantity}
            </Text>
            <ActionIcon
              size="lg"
              radius="xl"
              color="teal"
              onClick={incrementQuantity}
              style={{ backgroundColor: '#54e382', color: 'black' }}
            >
              <IconPlus size={16} />
            </ActionIcon>
          </Group>
        )}
      </Card>
    );
  }

  return (
    <>
      <HeaderMegaMenu />
      <StickyHeader />
      <Paper radius="md" p="xl" style={{ maxWidth: 800, margin: 'auto' }}>
        <Group>
          <Avatar src={user.photo} size={100} radius="xl" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Title order={3} style={{ color: '#333' }}>
                {user.firstName} {user.lastName}
              </Title>
              <Badge color="green" variant="outline">
                {user.role === 'admin'
                  ? 'Администратор'
                  : user.role === 'seller'
                    ? 'Продавец'
                    : 'Пользователь'}
              </Badge>
            </div>
          </div>
        </Group>

        <Divider my="lg" style={{ borderColor: '#e0e0e0' }} />

        <Group px="lg">
          <Group>
            <IconMail size={16} color="#333" />
            <Text size="sm" style={{ color: '#333' }}>
              Email:
            </Text>
            <Text size="sm" color="dimmed">
              {user.email}
            </Text>
          </Group>
          <Group>
            <IconUser size={16} color="#333" />
            <Text size="sm" style={{ color: '#333' }}>
              Верификация:
            </Text>
            <Text size="sm" color={user.isVerified ? 'green' : 'red'}>
              {user.isVerified ? 'Подтверждён' : 'Не подтверждён'}
            </Text>
          </Group>
        </Group>

        {(user.description || user.product) && (
          <>
            <Divider my="lg" style={{ borderColor: '#e0e0e0' }} />
            <Group px="lg">
              {user.product && (
                <Group>
                  <IconPackage size={16} color="#333" />
                  <Text size="sm" style={{ color: '#333' }}>
                    Продукт:
                  </Text>
                  <Text size="sm" color="dimmed">
                    {user.product}
                  </Text>
                </Group>
              )}
              {user.description && (
                <Group>
                  <IconInfoCircle size={16} color="#333" />
                  <Text size="sm" style={{ color: '#333' }}>
                    Описание:
                  </Text>
                  <Text size="sm" color="dimmed">
                    {user.description}
                  </Text>
                </Group>
              )}
            </Group>
          </>
        )}

        {user.role !== 'user' && (
          <>
            <Divider my="lg" style={{ borderColor: '#e0e0e0' }} />
            <Title order={4} style={{ color: '#333' }}>
              Продукты пользователя
            </Title>
            {products.length > 0 ? (
              <SimpleGrid cols={3} spacing="lg" mt="md">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    image={product.image}
                    discount={product.discount}
                    title={product.title}
                    description={product.description}
                    price={product.price}
                    oldPrice={product.oldPrice}
                    rating={product.rating}
                    _id={product._id}
                    autor={product.autor} // добавьте остальные свойства
                    category={product.category}
                    subcategory={product.subcategory}
                    discountValidUntil={product.discountValidUntil}
                    energyValue={product.energyValue}
                    expiration={product.expiration}
                    isWeighted={product.isWeighted}
                    nutrition={product.nutrition}
                    storageConditions={product.storageConditions}
                    weightRange={product.weightRange}
                  />
                ))}
              </SimpleGrid>
            ) : (
              <Text color="dimmed" mt="md">
                У пользователя пока нет продуктов.
              </Text>
            )}
          </>
        )}

        <Divider my="lg" style={{ borderColor: '#e0e0e0' }} />
        <Text size="xs" color="dimmed" style={{ fontStyle: 'italic' }}>
          Профиль создан: {new Date(user.createdAt).toLocaleDateString()}
        </Text>
      </Paper>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
