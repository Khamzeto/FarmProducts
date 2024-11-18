'use client';

import { useEffect, useState } from 'react';
import { IconChevronRight, IconFolder, IconUpload } from '@tabler/icons-react';
import {
  Box,
  Button,
  Divider,
  FileInput,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { HeaderMegaMenu } from '@/components/ui/Header/Header';
import StickyHeader from '@/components/ui/StickyHeader/StickyHeader';

export default function CatalogPage() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now()); // Unique key to reset FileInput

  // Add new category with an image
  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setCategories([
        ...categories,
        { name: newCategory, image: newImage, subcategories: [], newSubcategory: '' },
      ]);
      setNewCategory('');
      setNewImage(null); // Clear the image in state after adding
      setFileInputKey(Date.now()); // Reset the FileInput by updating its key
    }
  };

  // Convert image to Base64
  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewImage(reader.result); // Save Base64 image
    };
    reader.readAsDataURL(file);
  };

  // Add subcategory to a specific category
  const handleAddSubcategory = (index) => {
    const updatedCategories = [...categories];
    const { newSubcategory } = updatedCategories[index];
    if (newSubcategory.trim()) {
      updatedCategories[index].subcategories.push({ name: newSubcategory });
      updatedCategories[index].newSubcategory = '';
      setCategories(updatedCategories);
    }
  };

  // Update subcategory input
  const handleSubcategoryInputChange = (index, value) => {
    const updatedCategories = [...categories];
    updatedCategories[index].newSubcategory = value;
    setCategories(updatedCategories);
  };

  // Save all categories with images to the backend
  const saveCategories = async () => {
    const response = await fetch('http://localhost:5001/api/categories/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categories),
    });
    const result = await response.json();
    if (result.success) {
      alert('Каталог успешно сохранен!');
    } else {
      alert('Ошибка при сохранении каталога.');
    }
  };

  return (
    <>
      <HeaderMegaMenu />

      <StickyHeader />
      <Box mt="40" style={{ maxWidth: 600, margin: 'auto' }}>
        <Title order={2} mb="md" style={{ fontWeight: 700 }}>
          Создать Каталог
        </Title>

        <Divider label="Новая Категория" labelPosition="center" my="lg" />

        <Stack>
          <TextInput
            placeholder="Название категории"
            value={newCategory}
            onChange={(event) => setNewCategory(event.currentTarget.value)}
            radius="md"
            size="md"
            styles={{
              input: { backgroundColor: '#f9f9f9', borderColor: '#e0e0e0', color: '#333' },
            }}
            style={{ flex: 1 }}
          />
          <FileInput
            key={fileInputKey} // Unique key forces re-render to clear FileInput
            label="Загрузить изображение"
            placeholder="Изображение категории"
            onChange={handleImageUpload} // Convert image to Base64
            styles={{ input: { cursor: 'pointer' } }}
          />
          <Button
            onClick={handleAddCategory}
            fullWidth
            radius="md"
            style={{
              backgroundColor: '#10b981',
              color: '#ffffff',
              marginTop: '1rem',
            }}
          >
            Создать Каталог
          </Button>
        </Stack>

        <Divider label="Категории и Подкатегории" labelPosition="center" my="lg" />

        <Stack>
          {categories.map((category, index) => (
            <Paper
              key={index}
              p="md"
              radius="md"
              withBorder
              style={{
                borderColor: '#e0e0e0',
                backgroundColor: '#f9f9f9',
              }}
            >
              <Group>
                <Text size="md" style={{ display: 'flex', alignItems: 'center' }}>
                  <IconFolder size={20} color="#555" style={{ marginRight: 8 }} />
                  {category.name}
                </Text>
                {category.image && (
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: '8px',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#f0f0f0',
                    }}
                  >
                    <img
                      src={category.image}
                      alt="Категория"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )}
              </Group>

              <Stack mt="sm">
                {category.subcategories.map((subcategory, subIndex) => (
                  <Group key={subIndex} style={{ color: '#333' }}>
                    <IconChevronRight size={16} />
                    <Text size="sm">{subcategory.name}</Text>
                  </Group>
                ))}
              </Stack>

              <Group mt="sm" align="center">
                <TextInput
                  placeholder="Добавить подкатегорию"
                  value={category.newSubcategory || ''}
                  onChange={(event) =>
                    handleSubcategoryInputChange(index, event.currentTarget.value)
                  }
                  radius="md"
                  size="sm"
                  styles={{
                    input: { backgroundColor: '#f0f0f0', borderColor: '#e0e0e0', color: '#333' },
                  }}
                  style={{ flex: 1 }}
                />
                <Button
                  onClick={() => handleAddSubcategory(index)}
                  size="sm"
                  radius="md"
                  style={{
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                  }}
                >
                  Добавить Подкатегорию
                </Button>
              </Group>
            </Paper>
          ))}
        </Stack>

        <Button
          onClick={saveCategories}
          fullWidth
          mt="xl"
          size="md"
          radius="xl"
          style={{
            backgroundColor: '#10b981',
            color: '#ffffff',
          }}
        >
          Сохранить Все Категории
        </Button>
      </Box>
    </>
  );
}
