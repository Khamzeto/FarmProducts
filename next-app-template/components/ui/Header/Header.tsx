'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  IconBook,
  IconChevronDown,
  IconGridDots,
  IconHeart,
  IconSearch,
  IconShoppingCart,
  IconUser,
} from '@tabler/icons-react';
import {
  Box,
  Burger,
  Button,
  Center,
  Collapse,
  Divider,
  Drawer,
  Group,
  HoverCard,
  Input,
  Modal,
  ScrollArea,
  SimpleGrid,
  Text,
  ThemeIcon,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import AuthModal from '../AuthModal/AuthModal';
import classes from './Header.module.css';

const mockdata = [
  {
    icon: IconBook,
    title: 'Documentation',
    description: 'Extensive documentation to help you get started.',
  },
  {
    icon: IconChevronDown,
    title: 'Features',
    description: 'Explore the features available in our product.',
  },
];

export function HeaderMegaMenu() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const [authModalOpened, setAuthModalOpened] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track authentication
  const theme = useMantineTheme();

  // Check for token in localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsAuthenticated(true);
  }, []);

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  const links = mockdata.map((item) => (
    <UnstyledButton className={classes.subLink} key={item.title}>
      <Group wrap="nowrap" align="flex-start">
        <ThemeIcon size={34} variant="default" radius="md">
          <item.icon style={{ width: 22, height: 22 }} color={theme.colors.blue[6]} />
        </ThemeIcon>
        <div>
          <Text size="sm" fw={500}>
            {item.title}
          </Text>
          <Text size="xs" c="dimmed">
            {item.description}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  ));

  const openAuthModal = (register = false) => {
    setIsRegistering(register);
    setAuthModalOpened(true);
  };
  const router = useRouter();

  const handleClick = () => {
    router.push('/'); // переход на главную страницу
  };

  return (
    <Box p={0}>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <div onClick={handleClick} style={{ cursor: 'pointer' }}>
            Ешьте деревенское
          </div>

          <Group visibleFrom="sm">
            {isAuthenticated ? (
              <>
                <Button
                  radius="md"
                  style={{ backgroundColor: '#54e382', color: 'black' }}
                  onClick={handleLogout}
                >
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Button
                  radius="md"
                  style={{ backgroundColor: '#f4f4f4', color: 'black' }}
                  onClick={() => openAuthModal(false)}
                >
                  Войти
                </Button>
                <Button
                  radius="md"
                  style={{ backgroundColor: '#54e382', color: 'black' }}
                  onClick={() => openAuthModal(true)}
                >
                  Зарегистрироваться
                </Button>
              </>
            )}
          </Group>

          <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - 80px)`} mx="-md">
          <Divider my="sm" />
          <a href="#" className={classes.link}>
            Home
          </a>
          <UnstyledButton className={classes.link} onClick={toggleLinks}>
            <Center inline>
              <Box component="span" mr={5}>
                Features
              </Box>
              <IconChevronDown style={{ width: 16, height: 16 }} color={theme.colors.blue[6]} />
            </Center>
          </UnstyledButton>
          <Collapse in={linksOpened}>{links}</Collapse>
          <a href="#" className={classes.link}>
            Learn
          </a>
          <a href="#" className={classes.link}>
            Academy
          </a>
          <Divider my="sm" />
          <Group justify="center" grow pb="xl" px="md">
            {isAuthenticated ? (
              <Button variant="default" onClick={handleLogout}>
                Выйти
              </Button>
            ) : (
              <>
                <Button variant="default" onClick={() => openAuthModal(false)}>
                  Войти
                </Button>
                <Button
                  style={{ backgroundColor: '#54e382', color: 'black' }}
                  onClick={() => openAuthModal(true)}
                >
                  Зарегистрироваться
                </Button>
              </>
            )}
          </Group>
        </ScrollArea>
      </Drawer>

      <AuthModal
        opened={authModalOpened}
        onClose={() => setAuthModalOpened(false)}
        onSuccessfulAuth={() => setIsAuthenticated(true)} // Добавляем callback для успешной авторизации
      />
    </Box>
  );
}
