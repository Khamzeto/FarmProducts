'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconEdit, IconUser } from '@tabler/icons-react';
import { Avatar, Button, Group, Loader, Paper, Textarea, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { HeaderMegaMenu } from '@/components/ui/Header/Header';
import StickyHeader from '@/components/ui/StickyHeader/StickyHeader';

export default function EditProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const fileInputRef = useRef(null);

  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      photo: null,
      product: '',
      description: '',
    },
  });

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
        form.setValues({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          photo: data.photo || null,
          product: data.product || '',
          description: data.description || '',
        });
      } catch (error) {
        console.error('Ошибка при загрузке данных пользователя:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      form.setFieldValue('photo', reader.result); // Set Base64 string as photo value
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values) => {
    const userId = localStorage.getItem('user');
    try {
      const response = await fetch(`http://localhost:5001/api/auth/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        alert('Информация успешно обновлена!');
        router.push(`/profile`);
      } else {
        const errorData = await response.json();
        alert(`Ошибка при обновлении: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Ошибка при отправке данных:', error);
      alert('Ошибка при обновлении данных на сервере');
    }
  };

  return (
    <>
      <HeaderMegaMenu />
      <StickyHeader />
      <Paper radius="md" p="xl" style={{ maxWidth: 600, margin: 'auto' }}>
        <Title order={2} mb="lg" style={{ color: '#333' }}>
          Редактировать Профиль
        </Title>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Group justify="center" mb="lg">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              accept="image/*"
            />
            <Avatar
              src={form.values.photo}
              size={100}
              radius="xl"
              style={{
                cursor: 'pointer',
                border: '1px solid #66bb6a',
              }}
              onClick={() => fileInputRef.current.click()} // Open file input on avatar click
            />
          </Group>
          <TextInput
            label="Имя"
            placeholder="Введите ваше имя"
            leftSection={<IconUser size={14} />}
            {...form.getInputProps('firstName')}
            required
          />
          <TextInput
            label="Фамилия"
            placeholder="Введите вашу фамилию"
            leftSection={<IconUser size={14} />}
            {...form.getInputProps('lastName')}
            required
            mt="sm"
          />
          <TextInput
            label="Продукт"
            placeholder="Введите название вашего продукта"
            leftSection={<IconEdit size={14} />}
            {...form.getInputProps('product')}
            mt="sm"
          />
          <Textarea
            label="Описание"
            placeholder="Введите описание вашего продукта или профиля"
            {...form.getInputProps('description')}
            mt="sm"
            autosize
            minRows={3}
          />
          <Group mt="xl">
            <Button type="submit" color="teal" radius="md">
              Сохранить изменения
            </Button>
          </Group>
        </form>
      </Paper>
    </>
  );
}
