'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconFolder, IconTrash } from '@tabler/icons-react';
import {
  ActionIcon,
  Box,
  Button,
  Center,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { HeaderMegaMenu } from '@/components/ui/Header/Header';

export default function CatalogListPage() {
  const [catalogs, setCatalogs] = useState([]);
  const router = useRouter();

  // Fetch catalogs from the backend
  const fetchCatalogs = async () => {
    const response = await fetch('http://localhost:5001/api/categories');
    const data = await response.json();
    setCatalogs(data);
  };

  useEffect(() => {
    fetchCatalogs();
  }, []);

  // Function to delete a catalog
  const deleteCatalog = async (catalogId) => {
    const response = await fetch(`http://localhost:5001/api/categories/${catalogId}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      // Remove the deleted catalog from the state
      setCatalogs(catalogs.filter((catalog) => catalog._id !== catalogId));
    } else {
      alert('Ошибка при удалении каталога');
    }
  };

  return (
    <>
      <HeaderMegaMenu />
      <Box mb="40" mt="50" style={{ maxWidth: 600, margin: 'auto' }}>
        <Group justify="space-between" mb="md">
          <Title order={2} style={{ fontWeight: 700 }}>
            Каталоги
          </Title>
          <Button
            size="sm"
            radius="9"
            style={{
              backgroundColor: '#10b981',
              color: '#ffffff',
            }}
            onClick={() => router.push('/create-catalog')}
          >
            Создать Каталог
          </Button>
        </Group>

        <Divider mb="lg" />

        <Stack>
          {catalogs.length === 0 ? (
            <Center>
              <Text color="dimmed" size="md">
                Каталоги пока не созданы
              </Text>
            </Center>
          ) : (
            catalogs.map((catalog) => (
              <Paper
                key={catalog._id}
                p="md"
                radius="md"
                withBorder
                style={{
                  borderColor: '#e0e0e0',
                  backgroundColor: '#f9f9f9',
                }}
              >
                <Group justify="space-between">
                  <Text size="md" style={{ display: 'flex', alignItems: 'center' }}>
                    <IconFolder size={20} color="#555" style={{ marginRight: 8 }} />
                    {catalog.name}
                  </Text>
                  <ActionIcon
                    onClick={() => deleteCatalog(catalog._id)}
                    size="lg"
                    radius="xl"
                    variant="light"
                    style={{
                      color: '#e63946',
                    }}
                  >
                    <IconTrash size={18} />
                  </ActionIcon>
                </Group>
                <Stack mt="sm">
                  {catalog.subcategories.map((subcategory, index) => (
                    <Text key={index} size="sm" style={{ color: '#555', paddingLeft: '24px' }}>
                      - {subcategory.name}
                    </Text>
                  ))}
                </Stack>
              </Paper>
            ))
          )}
        </Stack>
      </Box>
    </>
  );
}
