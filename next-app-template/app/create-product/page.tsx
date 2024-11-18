'use client';

import { useEffect, useState } from 'react';
import { IconDiscount2, IconEdit, IconPlus, IconTag, IconUpload } from '@tabler/icons-react';
import {
  Button,
  Divider,
  FileInput,
  Group,
  NumberInput,
  Paper,
  Select,
  Stack,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';

import '@mantine/dates/styles.css';

import { HeaderMegaMenu } from '@/components/ui/Header/Header';
import StickyHeader from '@/components/ui/StickyHeader/StickyHeader';

export default function ProductForm() {
  const [form, setForm] = useState({
    title: '',
    image: null,
    autor: '',
    price: '',
    oldPrice: '',
    discount: '',
    discountValidUntil: null,
    rating: 0,
    weightRange: '0.500 - 1.500 кг',
    isWeighted: true,
    description: '',
    category: '',
    subcategory: '',
    nutrition: { proteins: '', fats: '', carbohydrates: '' },
    energyValue: { kcal: '', kJ: '' },
    expiration: '',
    storageConditions: '',
  });

  const [catalogs, setCatalogs] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  // Fetch categories from the backend
  const fetchCatalogs = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/categories');
      const data = await response.json();
      setCatalogs(data);
    } catch (error) {
      console.error('Ошибка при загрузке категорий:', error);
    }
  };

  useEffect(() => {
    fetchCatalogs();
  }, []);

  // Handle category selection change and load relevant subcategories
  const handleCategoryChange = (value) => {
    setForm((prevForm) => ({ ...prevForm, category: value, subcategory: '' }));
    const selectedCategory = catalogs.find((catalog) => catalog.name === value);
    setSubcategories(selectedCategory ? selectedCategory.subcategories : []);
  };

  // Convert image to Base64
  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prevForm) => ({
        ...prevForm,
        image: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleNestedChange = (section, field, value) => {
    setForm({ ...form, [section]: { ...form[section], [field]: value } });
  };

  const handleSubmit = async () => {
    const userId = localStorage.getItem('user'); // Получаем userId из localStorage

    if (!userId) {
      alert('Пользователь не найден. Пожалуйста, войдите в систему.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, userId }), // Добавляем userId в тело запроса
      });
      const result = await response.json();
      if (response.ok) {
        alert('Продукт успешно создан!');
      } else {
        alert(`Ошибка при создании продукта: ${result.message || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      console.error('Ошибка при отправке продукта:', error);
      alert('Ошибка при отправке данных на сервер');
    }
  };

  return (
    <>
      <HeaderMegaMenu />

      <StickyHeader />
      <Paper
        p="xl"
        mt="30"
        mb="30"
        radius="md"
        withBorder
        style={{ maxWidth: 700, margin: 'auto' }}
      >
        <Title order={2} mb="md" style={{ fontWeight: 700, color: '#333' }}>
          Добавить Новый Продукт
        </Title>

        <Stack>
          <Divider label="Основная информация" labelPosition="center" />

          <TextInput
            leftSection={<IconEdit />}
            label="Название продукта"
            placeholder="Введите название продукта"
            value={form.title}
            onChange={(event) => handleChange('title', event.currentTarget.value)}
            required
          />

          <FileInput
            leftSection={<IconUpload />}
            label="Загрузить изображение"
            placeholder="Нажмите для загрузки изображения"
            onChange={handleImageUpload}
            styles={{ input: { cursor: 'pointer' } }}
          />

          <TextInput
            leftSection={<IconTag />}
            label="Автор"
            placeholder="Введите имя автора продукта"
            value={form.autor}
            onChange={(event) => handleChange('autor', event.currentTarget.value)}
          />

          <Group grow>
            <NumberInput
              label="Цена"
              placeholder="Введите цену"
              value={form.price}
              onChange={(value) => handleChange('price', value)}
              required
              min={0}
            />

            <NumberInput
              label="Старая цена"
              placeholder="Введите старую цену"
              value={form.oldPrice}
              onChange={(value) => handleChange('oldPrice', value)}
              min={0}
            />
          </Group>

          <Divider label="Скидка" labelPosition="center" />

          <Group grow>
            <TextInput
              label="Скидка (%)"
              placeholder="Например: 10%"
              value={form.discount}
              onChange={(event) => handleChange('discount', event.currentTarget.value)}
              leftSection={<IconDiscount2 />}
            />
            <DatePickerInput
              label="Скидка действует до"
              placeholder="Выберите дату"
              value={form.discountValidUntil}
              onChange={(date) => handleChange('discountValidUntil', date)}
              styles={{ input: { cursor: 'pointer' } }}
            />
          </Group>

          <Divider label="Категория и Описание" labelPosition="center" />

          <Group grow>
            <Select
              label="Категория"
              placeholder="Выберите категорию"
              value={form.category}
              onChange={handleCategoryChange}
              data={catalogs.map((catalog) => catalog.name)}
            />

            <Select
              label="Подкатегория"
              placeholder="Выберите подкатегорию"
              value={form.subcategory}
              onChange={(value) => handleChange('subcategory', value)}
              data={subcategories.map((subcategory) => subcategory.name)}
              disabled={!subcategories.length}
            />
          </Group>

          <Textarea
            label="Описание продукта"
            placeholder="Опишите продукт, его особенности и свойства"
            value={form.description}
            onChange={(event) => handleChange('description', event.currentTarget.value)}
            autosize
            minRows={3}
          />

          <Divider label="Пищевая и Энергетическая ценность" labelPosition="center" />

          <Title order={4} style={{ color: '#333', marginTop: '10px' }}>
            Пищевая ценность (на 100 г)
          </Title>
          <Group grow>
            <TextInput
              label="Белки"
              placeholder="Например: 0.5 г"
              value={form.nutrition.proteins}
              onChange={(event) =>
                handleNestedChange('nutrition', 'proteins', event.currentTarget.value)
              }
            />
            <TextInput
              label="Жиры"
              placeholder="Например: 0.3 г"
              value={form.nutrition.fats}
              onChange={(event) =>
                handleNestedChange('nutrition', 'fats', event.currentTarget.value)
              }
            />
            <TextInput
              label="Углеводы"
              placeholder="Например: 11.5 г"
              value={form.nutrition.carbohydrates}
              onChange={(event) =>
                handleNestedChange('nutrition', 'carbohydrates', event.currentTarget.value)
              }
            />
          </Group>

          <Title order={4} style={{ color: '#333', marginTop: '10px' }}>
            Энергетическая ценность
          </Title>
          <Group grow>
            <TextInput
              label="Ккал"
              placeholder="Например: 67 ккал"
              value={form.energyValue.kcal}
              onChange={(event) =>
                handleNestedChange('energyValue', 'kcal', event.currentTarget.value)
              }
            />
            <TextInput
              label="кДж"
              placeholder="Например: 280.3 кДж"
              value={form.energyValue.kJ}
              onChange={(event) =>
                handleNestedChange('energyValue', 'kJ', event.currentTarget.value)
              }
            />
          </Group>

          <Divider label="Сроки хранения" labelPosition="center" />

          <TextInput
            label="Срок годности"
            placeholder="Например: 7 суток"
            value={form.expiration}
            onChange={(event) => handleChange('expiration', event.currentTarget.value)}
          />

          <TextInput
            label="Условия хранения"
            placeholder="Например: при температуре от +2 до +6 °С"
            value={form.storageConditions}
            onChange={(event) => handleChange('storageConditions', event.currentTarget.value)}
          />

          <Button
            leftSection={<IconPlus />}
            onClick={handleSubmit}
            fullWidth
            mt="xl"
            size="md"
            radius="md"
            style={{
              backgroundColor: '#10b981',
              color: '#ffffff',
            }}
          >
            Создать Продукт
          </Button>
        </Stack>
      </Paper>
    </>
  );
}
