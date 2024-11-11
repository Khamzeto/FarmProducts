const User = require('../models/userModel');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Product = require('../models/Product');

// In-memory store for codes
const verificationCodes = {};

// JWT секретный ключ (рекомендуется хранить его в .env файле)
const JWT_SECRET = 'your_jwt_secret';

// Configure Nodemailer transporter for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'iimya266@gmail.com',
    pass: 'ksnz zdqp uuyv dxmw',
  },
});

// Генерация 6-значного кода подтверждения
const generateVerificationCode = () => crypto.randomInt(100000, 999999).toString();

// Проверка на истечение срока действия кода (10 минут)
const isCodeExpired = timestamp => {
  const expirationTime = 10 * 60 * 1000; // 10 минут в миллисекундах
  return Date.now() - timestamp > expirationTime;
};

// Контроллер для отправки кода подтверждения
// Контроллер для отправки кода подтверждения
exports.sendVerificationCode = async (req, res) => {
  const { email, firstName, lastName } = req.body;
  const verificationCode = generateVerificationCode();

  try {
    // Проверяем, существует ли пользователь в базе данных
    let user = await User.findOne({ email });

    // Если пользователь не найден, требуется имя и фамилия для регистрации
    if (!user && (!firstName || !lastName)) {
      return res.status(400).json({
        message: 'Для регистрации нового пользователя необходимо указать имя и фамилию.',
      });
    }

    // Сохраняем код подтверждения с временной меткой и дополнительной информацией
    verificationCodes[email] = {
      code: verificationCode,
      timestamp: Date.now(),
      firstName: firstName || null, // Сохраняем имя, если указано
      lastName: lastName || null, // Сохраняем фамилию, если указано
    };

    // Отправляем код на почту
    await transporter.sendMail({
      from: 'iimya6@gmail.com',
      to: email,
      subject: 'Ваш код подтверждения',
      text: `Ваш код подтверждения: ${verificationCode}`,
    });

    res.status(200).json({ message: 'Код отправлен' });
  } catch (error) {
    console.error('Ошибка при отправке кода:', error);
    res.status(500).json({ message: 'Ошибка при отправке кода' });
  }
};

exports.confirmCode = async (req, res) => {
  const { email, code, role } = req.body;
  const storedCodeInfo = verificationCodes[email];

  if (!storedCodeInfo) {
    return res.status(400).json({ message: 'Неверный или просроченный код' });
  }

  const { code: storedCode, timestamp, firstName, lastName } = storedCodeInfo;

  if (isCodeExpired(timestamp)) {
    delete verificationCodes[email];
    return res.status(400).json({ message: 'Неверный или просроченный код' });
  }

  if (storedCode === code) {
    delete verificationCodes[email];

    try {
      let user = await User.findOne({ email });

      if (user) {
        if (user.isVerified) {
          const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
          );

          return res.status(200).json({
            message: 'Вы успешно вошли в аккаунт',
            token,
            role: user.role,
            userId: user._id, // Добавляем ID пользователя в ответ
          });
        } else {
          user.isVerified = true;
          await user.save();
        }
      } else {
        user = new User({
          email,
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          isVerified: true,
          role: role || 'user',
        });
        await user.save();
      }

      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(200).json({
        message: 'Код подтвержден, пользователь верифицирован',
        token,
        role: user.role,
        userId: user._id, // Добавляем ID пользователя в ответ
      });
    } catch (error) {
      console.error('Ошибка при сохранении пользователя:', error);
      res.status(500).json({ message: 'Ошибка при сохранении пользователя' });
    }
  } else {
    res.status(400).json({ message: 'Неверный код' });
  }
};

// Контроллер для изменения роли пользователя (только для администратора)
exports.updateUserRole = async (req, res) => {
  const { userId, role } = req.body;

  try {
    // Находим пользователя по ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Проверяем, что роль является допустимой
    const validRoles = ['admin', 'seller', 'user'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Недопустимая роль' });
    }

    // Обновляем роль пользователя
    user.role = role;
    await user.save();

    res.status(200).json({ message: `Роль пользователя обновлена на ${role}` });
  } catch (error) {
    console.error('Ошибка при изменении роли:', error);
    res.status(500).json({ message: 'Ошибка при изменении роли' });
  }
};
// Контроллер для получения данных о пользователе по _id
exports.getUserById = async (req, res) => {
  const { userId } = req.params; // Получаем userId из параметров маршрута

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Возвращаем данные о пользователе
    res.status(200).json({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isVerified: user.isVerified,
      photo: user.photo, // Добавлено поле фото
      product: user.product, // Добавлено поле товара
      description: user.description, // Добавлено поле описания
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error('Ошибка при получении данных пользователя:', error);
    res.status(500).json({ message: 'Ошибка при получении данных пользователя' });
  }
};
exports.updateUserInfo = async (req, res) => {
  const { userId } = req.params; // Получаем userId из параметров маршрута
  const { firstName, lastName, photo, product, description } = req.body; // Данные для обновления

  try {
    // Ищем пользователя по userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Обновляем только указанные поля
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (photo !== undefined) user.photo = photo;
    if (product !== undefined) user.product = product;
    if (description !== undefined) user.description = description;

    // Сохраняем обновленного пользователя
    await user.save();

    res.status(200).json({ message: 'Информация о пользователе обновлена', user });
  } catch (error) {
    console.error('Ошибка при обновлении информации о пользователе:', error);
    res.status(500).json({ message: 'Ошибка при обновлении информации о пользователе' });
  }
};
exports.getSellersWithProducts = async (req, res) => {
  try {
    // Находим всех пользователей с ролью 'seller'
    const sellers = await User.find({ role: 'seller' })
      .select('firstName lastName photo product') // Поля, которые нужно вернуть для каждого пользователя
      .lean(); // Преобразует документ в обычный объект JavaScript

    // Асинхронно добавляем продукты для каждого продавца
    const sellersWithProducts = await Promise.all(
      sellers.map(async seller => {
        const products = await Product.find({ userId: seller._id })
          .select('title image price oldPrice description') // Поля, которые нужно вернуть для каждого продукта
          .lean();

        // Возвращаем продавца вместе с продуктами
        return { ...seller, products };
      })
    );

    res.status(200).json(sellersWithProducts);
  } catch (error) {
    console.error('Ошибка при получении продавцов с продуктами:', error);
    res.status(500).json({ message: 'Ошибка при получении продавцов с продуктами' });
  }
};
exports.deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Удаляем пользователя по ID
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.status(200).json({ message: 'Пользователь успешно удален' });
  } catch (error) {
    console.error('Ошибка при удалении пользователя:', error);
    res.status(500).json({ message: 'Ошибка при удалении пользователя' });
  }
};

// Контроллер для получения всех пользователей
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Исключаем поле пароля, если оно есть
    res.status(200).json(users);
  } catch (error) {
    console.error('Ошибка при получении списка пользователей:', error);
    res.status(500).json({ message: 'Ошибка при получении списка пользователей' });
  }
};
