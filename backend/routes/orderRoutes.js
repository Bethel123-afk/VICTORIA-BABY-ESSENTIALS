const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User'); // Import User for details
const { protect, admin } = require('../middleware/authMiddleware');
const { sendEmail, getOrderEmailTemplate, getAdminOrderAlertTemplate } = require('../utils/emailService');
router.post('/', protect, async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    } else {
      const order = new Order({
        orderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        totalPrice,
      });

      const createdOrder = await order.save();
      
      // Send Confirmation Email
      const user = await User.findById(req.user._id);
      if (user) {
        await sendEmail({
          email: user.email,
          subject: `Procurement Manifest Confirmed - #${createdOrder._id.toString().slice(-8).toUpperCase()}`,
          html: getOrderEmailTemplate(createdOrder, 'placed'),
        }).catch(err => console.error('Manifest Email failed:', err));
      }

      res.status(201).json(createdOrder);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
router.put('/:id/pay', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer?.email_address,
      };

      const updatedOrder = await order.save();

      // Send Payment Receipt Email to Customer
      sendEmail({
        email: req.user.email,
        subject: `Payment Confirmed - Order #${updatedOrder._id.toString().slice(-8).toUpperCase()}`,
        html: getOrderEmailTemplate(updatedOrder, 'placed'),
      }).catch(err => console.error('Customer payment email receipt failed:', err));

      // Send Alert Email to Admin
      if (process.env.ADMIN_EMAIL) {
        sendEmail({
          email: process.env.ADMIN_EMAIL,
          subject: `Alert: New Paid Order #${updatedOrder._id.toString().slice(-8).toUpperCase()}`,
          html: getAdminOrderAlertTemplate(updatedOrder, req.user),
        }).catch(err => console.error('Admin order alert failed:', err));
      }

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'email name');

    if (order) {
      order.status = req.body.status;
      
      if (req.body.status === 'Delivered' && !order.isDelivered) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      }

      const updatedOrder = await order.save();
      
      // Update User through Email
      if (order.user && order.user.email) {
          await sendEmail({
              email: order.user.email,
              subject: `Manifest Status Updated - #${order._id.toString().slice(-8).toUpperCase()} is ${order.status.toUpperCase()}`,
              html: getOrderEmailTemplate(updatedOrder, 'updated'),
          }).catch(err => console.error('Manifest update email failed:', err));
      }

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
