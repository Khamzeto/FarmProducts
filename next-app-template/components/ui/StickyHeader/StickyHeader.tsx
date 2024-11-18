// StickyHeader.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  IconGridDots,
  IconHeart,
  IconSearch,
  IconShoppingCart,
  IconUser,
} from '@tabler/icons-react';
import { ActionIcon, Button, Group, Input, Menu, Modal, Text } from '@mantine/core';
import AuthModal from '../AuthModal/AuthModal';
import Favorites from '../Favorites/Favorites';
import ShoppingCart from '../ShoppingCard/ShoppingCard';

export function StickyHeader() {
  const router = useRouter();
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [favoritesModalOpen, setFavoritesModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false); // State for AuthModal
  const [totalAmount, setTotalAmount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [userRole, setUserRole] = useState('');

  type CartItem = {
    price: number;
    quantity: number;
  };

  const calculateTotalAmount = () => {
    const cartData: Record<string, CartItem> = JSON.parse(localStorage.getItem('cart') || '{}');
    const total = Object.values(cartData).reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
    setTotalAmount(total);
  };

  const calculateFavoritesCount = () => {
    const favoritesData = JSON.parse(localStorage.getItem('favorites')) || {};
    setFavoritesCount(Object.keys(favoritesData).length);
  };

  useEffect(() => {
    calculateTotalAmount();
    calculateFavoritesCount();
    const role = localStorage.getItem('role');
    setUserRole(role); // Default to 'user' if no role is set
  }, []);

  useEffect(() => {
    const handleCartUpdate = () => calculateTotalAmount();
    const handleFavoritesUpdate = () => calculateFavoritesCount();

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
    };
  }, []);

  return (
    <>
      <Modal
        opened={cartModalOpen}
        onClose={() => setCartModalOpen(false)}
        size="lg"
        radius="24"
        p="14"
        centered
      >
        <ShoppingCart />
      </Modal>

      <Modal
        opened={favoritesModalOpen}
        onClose={() => setFavoritesModalOpen(false)}
        size="lg"
        radius="24"
        p="14"
        centered
      >
        <Favorites />
      </Modal>

      {/* Auth Modal */}
      <AuthModal
        opened={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccessfulAuth={() => setUserRole(localStorage.getItem('role'))}
      />

      <div
        style={{
          position: 'sticky',
          top: '0',
          zIndex: '10',
          backgroundColor: '#ffffff',
          padding: '20px 20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Button
            variant="filled"
            radius="md"
            style={{ backgroundColor: '#54e382', color: 'black' }}
            onClick={() => router.push('/catalog')}
          >
            <IconGridDots size={20} style={{ marginRight: '8px' }} />
            Каталог
          </Button>
          <Input
            leftSection={<IconSearch size={18} color="gray" />}
            placeholder="Поиск"
            style={{ flex: 1, backgroundColor: '#f4f4f4', borderRadius: '8px' }}
          />
          <Button
            variant="filled"
            radius="md"
            style={{ backgroundColor: '#54e382', color: 'black' }}
          >
            Доставка: все дни
          </Button>
          <Group>
            <Button variant="default" radius="md" onClick={() => setCartModalOpen(true)}>
              <IconShoppingCart />
              {totalAmount > 0 && (
                <Text style={{ marginLeft: '8px', fontWeight: 'bold' }}>{totalAmount} ₽</Text>
              )}
            </Button>
            <Button variant="default" radius="md" onClick={() => setFavoritesModalOpen(true)}>
              <IconHeart
                size={20}
                color={favoritesCount > 0 ? 'red' : 'gray'}
                fill={favoritesCount > 0 ? 'red' : 'none'}
              />
              {favoritesCount > 0 && (
                <Text style={{ marginLeft: '8px', fontWeight: 'bold' }}>{favoritesCount}</Text>
              )}
            </Button>
            <Menu shadow="md" width={200} withArrow>
              <Menu.Target>
                <Button
                  variant="default"
                  radius="md"
                  onClick={() => !userRole && setAuthModalOpen(true)}
                >
                  <IconUser />
                </Button>
              </Menu.Target>
              {userRole && (
                <Menu.Dropdown>
                  <Menu.Item onClick={() => router.push('/profile')}>Профиль</Menu.Item>
                  {(userRole === 'user' || userRole === 'seller') && (
                    <Menu.Item onClick={() => router.push('/orders')}>Заказы</Menu.Item>
                  )}
                  {userRole === 'seller' && (
                    <Menu.Item onClick={() => router.push('/my-orders')}>Мои заказы</Menu.Item>
                  )}
                  {userRole !== 'user' && (
                    <Menu.Item onClick={() => router.push('/edit-profile')}>
                      Настройки аккаунта
                    </Menu.Item>
                  )}
                  <Menu.Divider />
                  {userRole === 'seller' && (
                    <Menu.Item onClick={() => router.push('/create-product')}>
                      Добавить продукт
                    </Menu.Item>
                  )}
                  {userRole !== 'user' && userRole !== 'seller' && (
                    <>
                      <Menu.Item onClick={() => router.push('/all-catalog')}>Каталоги</Menu.Item>
                      {userRole === 'admin' && (
                        <Menu.Item onClick={() => router.push('/create-catalog')}>
                          Создать каталог
                        </Menu.Item>
                      )}
                      {userRole === 'admin' && (
                        <Menu.Item onClick={() => router.push('/users')}>Пользователи</Menu.Item>
                      )}
                    </>
                  )}
                </Menu.Dropdown>
              )}
            </Menu>
          </Group>
        </div>
      </div>
    </>
  );
}

export default StickyHeader;
