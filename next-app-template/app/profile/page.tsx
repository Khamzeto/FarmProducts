'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  IconDiscount2,
  IconEdit,
  IconInfoCircle,
  IconMail,
  IconPackage,
  IconTag,
  IconTrash,
  IconUpload,
  IconUser,
} from '@tabler/icons-react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  FileInput,
  Group,
  Image,
  Loader,
  Modal,
  NumberInput,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { HeaderMegaMenu } from '@/components/ui/Header/Header';
import StickyHeader from '@/components/ui/StickyHeader/StickyHeader';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const [catalogs, setCatalogs] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem('user');
    if (!userId) {
      setLoading(false);
      console.error('ID пользователя не найден в localStorage');
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
    fetchCatalogs();
  }, []);

  const fetchCatalogs = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/categories');
      const data = await response.json();
      setCatalogs(data);
    } catch (error) {
      console.error('Ошибка при загрузке категорий:', error);
    }
  };

  const form = useForm({
    initialValues: {
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
    },
  });

  const handleCategoryChange = (value) => {
    form.setFieldValue('category', value);
    const selectedCategory = catalogs.find((catalog) => catalog.name === value);
    setSubcategories(selectedCategory ? selectedCategory.subcategories : []);
    form.setFieldValue('subcategory', '');
  };

  const handleImageUpload = (file) => {
    if (!file) {
      form.setFieldValue('image', null);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      form.setFieldValue('image', reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleNestedChange = (section, field, value) => {
    form.setFieldValue(section, {
      ...form.values[section],
      [field]: value,
    });
  };

  if (loading) {
    return <Loader size="xl" />;
  }

  if (!user) {
    return <Text color="red">Пользователь не найден</Text>;
  }

  const handleEditProfile = () => {
    router.push(`/edit-profile`);
  };

  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    form.setValues({
      title: product.title || '',
      image: product.image || null,
      autor: product.autor || '',
      price: product.price || '',
      oldPrice: product.oldPrice || '',
      discount: product.discount || '',
      discountValidUntil: product.discountValidUntil ? new Date(product.discountValidUntil) : null,
      rating: product.rating || 0,
      weightRange: product.weightRange || '',
      isWeighted: product.isWeighted || false,
      description: product.description || '',
      category: product.category || '',
      subcategory: product.subcategory || '',
      nutrition: product.nutrition || { proteins: '', fats: '', carbohydrates: '' },
      energyValue: product.energyValue || { kcal: '', kJ: '' },
      expiration: product.expiration || '',
      storageConditions: product.storageConditions || '',
    });
    handleCategoryChange(product.category);
    setEditModalOpen(true);
  };

  const handleUpdateProduct = async (values) => {
    try {
      const response = await fetch(`http://localhost:5001/api/products/${currentProduct._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, userId: user._id }),
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === updatedProduct._id ? updatedProduct : product
          )
        );
        setEditModalOpen(false);
      } else {
        console.error('Ошибка при обновлении продукта');
      }
    } catch (error) {
      console.error('Ошибка при обновлении продукта:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    const confirmDelete = window.confirm('Вы уверены, что хотите удалить этот продукт?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5001/api/products/${productId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setProducts(products.filter((product) => product._id !== productId));
      } else {
        console.error('Ошибка при удалении продукта');
      }
    } catch (error) {
      console.error('Ошибка при удалении продукта:', error);
    }
  };

  return (
    <>
      <HeaderMegaMenu />
      <StickyHeader />

      {/* Модальное окно для редактирования продукта */}
      <Modal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Редактировать продукт"
        centered
        size="lg"
      >
        <form onSubmit={form.onSubmit(handleUpdateProduct)}>
          <Stack>
            <Divider label="Основная информация" labelPosition="center" />

            <TextInput
              leftSection={<IconEdit />}
              label="Название продукта"
              placeholder="Введите название продукта"
              {...form.getInputProps('title')}
              required
            />

            <FileInput
              leftSection={<IconUpload />}
              label="Загрузить изображение"
              placeholder="Нажмите для загрузки изображения"
              onChange={handleImageUpload}
              styles={{ input: { cursor: 'pointer' } }}
              accept="image/*"
            />

            {form.values.image && (
              <Image
                src={form.values.image}
                alt="Предпросмотр изображения"
                height={150}
                fit="contain"
              />
            )}

            <TextInput
              leftSection={<IconTag />}
              label="Автор"
              placeholder="Введите имя автора продукта"
              {...form.getInputProps('autor')}
            />

            <Group grow>
              <NumberInput
                label="Цена"
                placeholder="Введите цену"
                {...form.getInputProps('price')}
                required
                min={0}
              />

              <NumberInput
                label="Старая цена"
                placeholder="Введите старую цену"
                {...form.getInputProps('oldPrice')}
                min={0}
              />
            </Group>

            <Divider label="Скидка" labelPosition="center" />

            <Group grow>
              <TextInput
                label="Скидка (%)"
                placeholder="Например: 10%"
                {...form.getInputProps('discount')}
                leftSection={<IconDiscount2 />}
              />
              <DatePickerInput
                label="Скидка действует до"
                placeholder="Выберите дату"
                value={form.values.discountValidUntil}
                onChange={(date) => form.setFieldValue('discountValidUntil', date)}
                styles={{ input: { cursor: 'pointer' } }}
              />
            </Group>

            <Divider label="Категория и Описание" labelPosition="center" />

            <Group grow>
              <Select
                label="Категория"
                placeholder="Выберите категорию"
                data={catalogs.map((catalog) => catalog.name)}
                value={form.values.category}
                onChange={handleCategoryChange}
              />

              <Select
                label="Подкатегория"
                placeholder="Выберите подкатегорию"
                data={subcategories.map((subcategory) => subcategory.name)}
                value={form.values.subcategory}
                onChange={(value) => form.setFieldValue('subcategory', value)}
                disabled={!subcategories.length}
              />
            </Group>

            <Textarea
              label="Описание продукта"
              placeholder="Опишите продукт, его особенности и свойства"
              {...form.getInputProps('description')}
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
                value={form.values.nutrition.proteins}
                onChange={(event) =>
                  handleNestedChange('nutrition', 'proteins', event.currentTarget.value)
                }
              />
              <TextInput
                label="Жиры"
                placeholder="Например: 0.3 г"
                value={form.values.nutrition.fats}
                onChange={(event) =>
                  handleNestedChange('nutrition', 'fats', event.currentTarget.value)
                }
              />
              <TextInput
                label="Углеводы"
                placeholder="Например: 11.5 г"
                value={form.values.nutrition.carbohydrates}
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
                value={form.values.energyValue.kcal}
                onChange={(event) =>
                  handleNestedChange('energyValue', 'kcal', event.currentTarget.value)
                }
              />
              <TextInput
                label="кДж"
                placeholder="Например: 280.3 кДж"
                value={form.values.energyValue.kJ}
                onChange={(event) =>
                  handleNestedChange('energyValue', 'kJ', event.currentTarget.value)
                }
              />
            </Group>

            <Divider label="Сроки хранения" labelPosition="center" />

            <TextInput
              label="Срок годности"
              placeholder="Например: 7 суток"
              {...form.getInputProps('expiration')}
            />

            <TextInput
              label="Условия хранения"
              placeholder="Например: при температуре от +2 до +6 °С"
              {...form.getInputProps('storageConditions')}
            />

            <Group mt="md">
              <Button variant="default" onClick={() => setEditModalOpen(false)}>
                Отмена
              </Button>
              <Button type="submit" color="teal">
                Сохранить
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

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
            <Button
              leftSection={<IconEdit size={16} />}
              color="teal"
              variant="outline"
              size="xs"
              radius="md"
              mt="sm"
              onClick={handleEditProfile}
            >
              Редактировать профиль
            </Button>
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
              Ваши продукты
            </Title>

            {products.length > 0 ? (
              <SimpleGrid cols={3} spacing="lg" mt="md">
                {products.map((product) => (
                  <Card
                    key={product._id}
                    radius="18"
                    padding="sm"
                    style={{ backgroundColor: '#ffffff', border: '1px solid #e0e0e0' }}
                  >
                    <Card.Section>
                      <Image src={product.image} alt={product.title} height={150} fit="cover" />
                    </Card.Section>
                    <Text size="sm" mt="xs" style={{ color: '#333', fontSize: '0.9rem' }}>
                      {product.title}
                    </Text>
                    <Text
                      size="xs"
                      color="dimmed"
                      mt="xs"
                      style={{ minHeight: '30px', fontSize: '0.8rem' }}
                    >
                      {product.description || 'Описание отсутствует'}
                    </Text>
                    <Group mt="xs">
                      <Text size="sm" color="green" style={{ fontSize: '0.9rem' }}>
                        {product.price} ₽
                      </Text>
                      {product.oldPrice && (
                        <Text
                          size="xs"
                          style={{
                            textDecoration: 'line-through',
                            color: '#b0bec5',
                            fontSize: '0.8rem',
                          }}
                        >
                          {product.oldPrice} ₽
                        </Text>
                      )}
                    </Group>
                    <Group mt="sm">
                      <Button
                        variant="outline"
                        color="blue"
                        size="xs"
                        radius="md"
                        onClick={() => handleEditProduct(product)}
                      >
                        <IconEdit size={14} /> Редактировать
                      </Button>
                      <Button
                        variant="outline"
                        color="red"
                        size="xs"
                        radius="md"
                        onClick={() => handleDeleteProduct(product._id)}
                      >
                        <IconTrash size={14} /> Удалить
                      </Button>
                    </Group>
                  </Card>
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
    </>
  );
}
