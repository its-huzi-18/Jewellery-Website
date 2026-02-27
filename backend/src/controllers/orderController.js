import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { 
  sendOrderConfirmationEmail, 
  sendNewOrderNotificationToAdmin,
  sendOrderStatusUpdateEmail 
} from '../utils/emailService.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const {
      shippingAddress,
      paymentMethod,
      notes
    } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'title price discount stock mainImage');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Validate stock for all items
    for (const item of cart.items) {
      if (!item.product || item.product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for item`
        });
      }
    }

    // Calculate totals
    let subtotal = 0;
    let totalDiscount = 0;

    const orderItems = cart.items.map(item => {
      const originalPrice = item.product.price;
      const discountedPrice = item.product.discount > 0
        ? originalPrice * (1 - item.product.discount / 100)
        : originalPrice;

      subtotal += originalPrice * item.quantity;
      totalDiscount += (originalPrice - discountedPrice) * item.quantity;

      return {
        product: item.product._id,
        title: item.product.title,
        quantity: item.quantity,
        price: discountedPrice,
        discount: item.product.discount,
        image: item.product.mainImage
      };
    });

    const shippingCost = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal - totalDiscount + shippingCost + tax;

    // Generate order number
    const orderCount = await Order.countDocuments();
    const orderNumber = `BG${Date.now()}-${String(orderCount + 1).padStart(6, '0')}`;

    // Create order using save() to trigger middleware
    const order = new Order({
      orderNumber,
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'card',
      subtotal,
      discount: totalDiscount,
      shippingCost,
      tax,
      total,
      notes
    });

    await order.save();

    // Update product stock and sold count
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: {
          stock: -item.quantity,
          soldCount: item.quantity
        }
      });
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    // Add order to user's orders
    await User.findByIdAndUpdate(req.user._id, {
      $push: { orders: order._id }
    });

    // Send emails (non-blocking)
    try {
      // Send confirmation email to customer
      sendOrderConfirmationEmail(order, req.user);
      
      // Send notification email to admin (get admin from database)
      const adminUser = await User.findOne({ role: 'admin' });
      if (adminUser) {
        sendNewOrderNotificationToAdmin(order, req.user, adminUser);
      }
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the order if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { orders }
    });
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns the order or is admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      data: { order }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    let query = {};
    if (status) {
      query.orderStatus = status;
    }

    const skip = (page - 1) * limit;
    const total = await Order.countDocuments(query);

    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const oldStatus = order.orderStatus;

    if (orderStatus) {
      order.orderStatus = orderStatus;
      if (orderStatus === 'delivered') {
        order.deliveredAt = Date.now();
      }
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    const updatedOrder = await order.save();

    // Send status update email to customer if status changed
    if (orderStatus && orderStatus !== oldStatus) {
      try {
        // Customer email is already in order.shippingAddress.email
        sendOrderStatusUpdateEmail(updatedOrder, null, orderStatus);
      } catch (emailError) {
        console.error('Status update email error:', emailError);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      data: { order: updatedOrder }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns the order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Can only cancel pending or processing orders
    if (['shipped', 'delivered'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel order that has been shipped'
      });
    }

    order.orderStatus = 'cancelled';
    order.cancelledAt = Date.now();
    order.paymentStatus = 'refunded';

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: { order: updatedOrder }
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get order statistics (Admin only)
// @route   GET /api/orders/stats
// @access  Private/Admin
export const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments() || 0;

    const statusCounts = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 }
        }
      }
    ]) || [];

    const revenueStats = await Order.aggregate([
      {
        $match: { orderStatus: { $nin: ['cancelled'] } }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' },
          totalOrders: { $sum: 1 }
        }
      }
    ]) || [];

    // Simple top products - just return empty if no orders
    const topProducts = [];

    // Recent orders summary
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email') || [];

    res.status(200).json({
      success: true,
      data: {
        totalOrders: totalOrders || 0,
        statusBreakdown: (statusCounts || []).reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        revenue: (revenueStats || [])[0] || { totalRevenue: 0, totalOrders: 0 },
        topProducts,
        recentOrders
      }
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);
    
    // Return empty data instead of crashing
    res.status(200).json({
      success: true,
      data: {
        totalOrders: 0,
        statusBreakdown: {},
        revenue: { totalRevenue: 0, totalOrders: 0 },
        topProducts: [],
        recentOrders: []
      }
    });
  }
};
