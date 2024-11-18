import { useEffect, useState } from 'react';
import { IconLock, IconMail, IconUser } from '@tabler/icons-react';
import { Button, Divider, Modal, Tabs, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

export default function AuthModal({ opened, onClose, onSuccessfulAuth }) {
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [email, setEmail] = useState('');
  const form = useForm({
    initialValues: {
      email: '',
      code: '',
      firstName: '',
      lastName: '',
    },
  });

  // Функция отправки кода подтверждения
  const handleSendCode = async () => {
    const response = await fetch('http://localhost:5001/api/auth/send-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: form.values.email,
        firstName: form.values.firstName,
        lastName: form.values.lastName,
      }),
    });

    if (response.ok) {
      setIsVerificationSent(true);
      setEmail(form.values.email);
      form.reset();
    } else {
      alert('Ошибка при отправке кода');
    }
  };

  // Функция подтверждения кода
  const handleConfirmCode = async () => {
    const response = await fetch('http://localhost:5001/api/auth/confirm-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code: form.values.code }),
    });

    const data = await response.json();

    if (response.ok) {
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', data.userId);
        localStorage.setItem('role', data.role);
        window.location.reload();
        onSuccessfulAuth();
        onClose();
      }
    } else {
      alert(data.message || 'Неверный или просроченный код');
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      padding="xl"
      radius="24"
      overlayProps={{ color: 'rgba(0, 0, 0, 0.6)' }}
      style={{ minWidth: '400px', width: '40%' }}
      withCloseButton
      title="Авторизация"
    >
      <Tabs defaultValue="login">
        <Tabs.List>
          <Tabs.Tab value="login">Вход</Tabs.Tab>
          <Tabs.Tab value="register">Регистрация</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="login" pt="xs">
          {isVerificationSent ? (
            <>
              <Text size="sm" mt="md">
                Введите код, отправленный на email: {email}
              </Text>
              <TextInput
                leftSection={<IconLock />}
                label="Код подтверждения"
                placeholder="6-значный код"
                {...form.getInputProps('code')}
                mt="md"
              />
              <Button fullWidth mt="xl" onClick={handleConfirmCode} color="teal">
                Подтвердить
              </Button>
            </>
          ) : (
            <>
              <TextInput
                leftSection={<IconMail size="16" />}
                label="Email"
                placeholder="Введите ваш email"
                {...form.getInputProps('email')}
                mt="md"
              />
              <Button radius="9" fullWidth mt="xl" onClick={handleSendCode} color="teal">
                Отправить код
              </Button>
            </>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="register" pt="xs">
          {isVerificationSent ? (
            <>
              <Text size="sm" mt="md">
                Введите код, отправленный на email: {email}
              </Text>
              <TextInput
                leftSection={<IconLock />}
                label="Код подтверждения"
                placeholder="6-значный код"
                {...form.getInputProps('code')}
                mt="md"
              />
              <Button fullWidth mt="xl" onClick={handleConfirmCode} color="teal">
                Подтвердить
              </Button>
            </>
          ) : (
            <>
              <TextInput
                leftSection={<IconMail size="16" />}
                label="Email"
                placeholder="Введите ваш email"
                {...form.getInputProps('email')}
                mt="md"
              />
              <TextInput
                leftSection={<IconUser size="16" />}
                label="Имя"
                placeholder="Введите ваше имя"
                {...form.getInputProps('firstName')}
                mt="md"
              />
              <TextInput
                leftSection={<IconUser size="16" />}
                label="Фамилия"
                placeholder="Введите вашу фамилию"
                {...form.getInputProps('lastName')}
                mt="md"
              />
              <Button radius="9" fullWidth mt="xl" onClick={handleSendCode} color="teal">
                Отправить код для регистрации
              </Button>
            </>
          )}
        </Tabs.Panel>
      </Tabs>

      <Divider my="sm" />
      <Text size="xs" color="dimmed">
        Мы отправим код подтверждения на указанный email.
      </Text>
    </Modal>
  );
}
