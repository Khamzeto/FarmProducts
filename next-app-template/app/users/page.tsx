// components/UserManagement.js

'use client';

import { useEffect, useState } from 'react';
import { IconCheck, IconEdit, IconTrash, IconUser, IconX } from '@tabler/icons-react';
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Card,
  Center,
  Container,
  Group,
  Loader,
  Modal,
  ScrollArea,
  Select,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { HeaderMegaMenu } from '@/components/ui/Header/Header';
import StickyHeader from '@/components/ui/StickyHeader/StickyHeader';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedRole, setEditedRole] = useState('');
  const [confirmDeleteUserId, setConfirmDeleteUserId] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/auth/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error('Не удалось получить список пользователей');
      }
    } catch (error) {
      console.error('Ошибка при получении списка пользователей:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (userId, newRole) => {
    setEditingUserId(userId);
    setEditedRole(newRole);
  };

  const saveRoleChange = async (userId) => {
    try {
      const response = await fetch('http://localhost:5001/api/auth/update-role', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, role: editedRole }),
      });

      if (response.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user._id === userId ? { ...user, role: editedRole } : user))
        );
      } else {
        console.error('Не удалось обновить роль пользователя');
      }
    } catch (error) {
      console.error('Ошибка при обновлении роли пользователя:', error);
    } finally {
      setEditingUserId(null);
      setEditedRole('');
    }
  };

  const cancelRoleChange = () => {
    setEditingUserId(null);
    setEditedRole('');
  };

  const confirmDelete = (userId) => {
    setConfirmDeleteUserId(userId);
  };

  const deleteUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/auth/user/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      } else {
        console.error('Не удалось удалить пользователя');
      }
    } catch (error) {
      console.error('Ошибка при удалении пользователя:', error);
    } finally {
      setConfirmDeleteUserId(null);
    }
  };

  if (loading) {
    return <Loader size="xl" />;
  }

  return (
    <>
      <HeaderMegaMenu />
      <StickyHeader />
      <Container size="lg" py="md">
        <Card shadow="0" radius="md" p="lg">
          <Title order={3} align="center" mb="40">
            Управление пользователями
          </Title>
          <ScrollArea>
            <Table highlightOnHover>
              <thead>
                <tr>
                  <th>Пользователь</th>
                  <th>Email</th>
                  <th>Роль</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <Group spacing="sm">
                        <Avatar color="cyan" radius="xl">
                          <IconUser size={20} />
                        </Avatar>
                        <div>
                          <Text weight={500}>
                            {user.firstName || '-'} {user.lastName || '-'}
                          </Text>
                          <Text size="xs" color="dimmed">
                            {user.createdAt && new Date(user.createdAt).toLocaleDateString()}
                          </Text>
                        </div>
                      </Group>
                    </td>
                    <td>
                      <Text>{user.email}</Text>
                    </td>
                    <td>
                      {editingUserId === user._id ? (
                        <Select
                          data={[
                            { value: 'admin', label: 'Администратор' },
                            { value: 'seller', label: 'Продавец' },
                            { value: 'user', label: 'Пользователь' },
                          ]}
                          value={editedRole}
                          onChange={(value) => setEditedRole(value)}
                        />
                      ) : (
                        <Badge
                          color={
                            user.role === 'admin'
                              ? 'blue'
                              : user.role === 'seller'
                                ? 'green'
                                : 'gray'
                          }
                        >
                          {user.role === 'admin'
                            ? 'Администратор'
                            : user.role === 'seller'
                              ? 'Продавец'
                              : 'Пользователь'}
                        </Badge>
                      )}
                    </td>
                    <td>
                      <Badge color={user.isVerified ? 'teal' : 'red'}>
                        {user.isVerified ? 'Верифицирован' : 'Не верифицирован'}
                      </Badge>
                    </td>
                    <td>
                      {editingUserId === user._id ? (
                        <Group spacing="xs">
                          <ActionIcon color="green" onClick={() => saveRoleChange(user._id)}>
                            <IconCheck size={18} />
                          </ActionIcon>
                          <ActionIcon color="red" onClick={cancelRoleChange}>
                            <IconX size={18} />
                          </ActionIcon>
                        </Group>
                      ) : (
                        <Group spacing="xs">
                          <ActionIcon
                            color="blue"
                            onClick={() => handleRoleChange(user._id, user.role)}
                          >
                            <IconEdit size={18} />
                          </ActionIcon>
                          <ActionIcon color="red" onClick={() => confirmDelete(user._id)}>
                            <IconTrash size={18} />
                          </ActionIcon>
                        </Group>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </ScrollArea>
        </Card>
      </Container>

      <Modal
        opened={confirmDeleteUserId !== null}
        onClose={() => setConfirmDeleteUserId(null)}
        title="Подтвердите удаление"
        centered
      >
        <Text>Вы уверены, что хотите удалить этого пользователя?</Text>
        <Group position="right" mt="md">
          <Button variant="default" onClick={() => setConfirmDeleteUserId(null)}>
            Отмена
          </Button>
          <Button color="red" onClick={() => deleteUser(confirmDeleteUserId)}>
            Удалить
          </Button>
        </Group>
      </Modal>
    </>
  );
}
