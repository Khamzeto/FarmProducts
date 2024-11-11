const Order = require('../models/Order');
const Product = require('../models/Product');

// Создание новой заявки на покупку продукта
exports.createOrder = async (req, res) => {
  try {
    const { items, buyerDetails, totalAmount } = req.body;
    const userId = req.body.userId || req.user._id; // Получаем userId из тела запроса или из токена пользователя

    const updatedItems = await Promise.all(
      items.map(async item => {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }
        return {
          ...item,
          sellerId: product.userId,
        };
      })
    );

    const newOrder = new Order({
      userId, // Добавляем userId в заказ
      items: updatedItems,
      buyerDetails,
      totalAmount,
      status: 'pending',
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error });
  }
};

// Получение заявок на продукты текущего продавца
exports.getOrdersBySeller = async (req, res) => {
  try {
    const { sellerId } = req.params;
    console.log('Fetching orders for sellerId:', sellerId);
    const orders = await Order.find({ 'items.sellerId': sellerId }).populate(
      'items.productId'
    );
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

// Обновление статуса заявки (например, отмена или завершение)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ message: 'Error updating order status', error });
  }
};
// Получение всех заказов по userId
exports.getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).populate('items.productId'); // Подгружаем детали товаров

    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders by userId:', error);
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};
