'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import { Box, Collapse, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { HeaderMegaMenu } from '@/components/ui/Header/Header';
import StickyHeader from '@/components/ui/StickyHeader/StickyHeader';

export default function CatalogPage() {
  const [categories, setCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const router = useRouter();

  // Fetch categories from the backend
  const fetchCategories = async () => {
    const response = await fetch('http://localhost:5001/api/categories');
    const data = await response.json();
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Toggle subcategories visibility for a specific category
  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // Navigate to products page with category or subcategory name
  const navigateToProducts = (type, name) => {
    router.push(`/products?${type}=${encodeURIComponent(name)}`);
  };

  return (
    <>
      <HeaderMegaMenu />
      <StickyHeader />
      <Box mt="30" mb="20" style={{ maxWidth: 1200, margin: 'auto', display: 'flex' }}>
        {/* Sidebar for categories */}
        <Paper p="20" radius="20" withBorder style={{ width: 250, marginRight: 20 }}>
          <Title order={4} mb="sm">
            Категории
          </Title>
          <Stack mt="20">
            {categories.map((category) => (
              <Box key={category.id}>
                <Group
                  onClick={() => toggleCategory(category.id)}
                  style={{
                    cursor: 'pointer',
                    color: expandedCategories[category.id] ? '#10b981' : '#333',
                    fontWeight: expandedCategories[category.id] ? 700 : 500,
                  }}
                >
                  <Text
                    style={{ fontWeight: 500 }}
                    onClick={() => navigateToProducts('category', category.name)}
                  >
                    {category.name}
                  </Text>
                  {expandedCategories[category.id] ? (
                    <IconChevronDown size={18} />
                  ) : (
                    <IconChevronRight size={18} />
                  )}
                </Group>
                <Collapse in={expandedCategories[category.id]}>
                  <Stack pl="md" mt="xs">
                    {category.subcategories.length > 0 ? (
                      category.subcategories.map((subcategory) => (
                        <Text
                          key={subcategory.id}
                          size="sm"
                          color="dimmed"
                          onClick={() => navigateToProducts('subcategory', subcategory.name)}
                          style={{ cursor: 'pointer' }}
                        >
                          - {subcategory.name}
                        </Text>
                      ))
                    ) : (
                      <Text size="sm" color="dimmed">
                        Нет подкатегорий
                      </Text>
                    )}
                  </Stack>
                </Collapse>
              </Box>
            ))}
          </Stack>
        </Paper>

        {/* Custom grid for highlighted categories */}
        <Box style={{ flexGrow: 1 }}>
          <Title order={3} mb="md">
            Каталог
          </Title>
          <div
            style={{
              display: 'grid',
              gap: '16px',
              gridTemplateColumns: 'repeat(3, 1fr)',
            }}
          >
            {categories.map((category) => (
              <div
                key={category.id}
                style={{
                  position: 'relative',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  width: '100%',
                  paddingTop: '100%',
                  backgroundImage: `url(${category.image || 'https://via.placeholder.com/300'})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
                onClick={() => navigateToProducts('category', category.name)}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  }}
                ></div>
                <div
                  style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    fontSize: '24px',
                    zIndex: 1,
                  }}
                >
                  {category.name}
                </div>
              </div>
            ))}
          </div>
        </Box>
      </Box>
    </>
  );
}
