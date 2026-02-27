import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'title price discount images mainImage stock');

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Calculate totals
    let totalPrice = 0;
    let totalDiscount = 0;

    cart.items = cart.items.filter(item => {
      if (!item.product) return false; // Remove if product deleted
      
      const product = item.product;
      const originalPrice = product.price;
      const discountedPrice = product.discount > 0 
        ? originalPrice * (1 - product.discount / 100) 
        : originalPrice;
      
      // Update item price if product price changed
      item.price = discountedPrice;
      
      totalPrice += discountedPrice * item.quantity;
      totalDiscount += (originalPrice - discountedPrice) * item.quantity;
      
      return true;
    });

    cart.totalPrice = totalPrice;
    cart.totalDiscount = totalDiscount;
    await cart.save();

    res.status(200).json({
      success: true,
      data: { cart }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Find product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }

    // Get or create cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Calculate discounted price
    const discountedPrice = product.discount > 0
      ? product.price * (1 - product.discount / 100)
      : product.price;

    // Check if item already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].price = discountedPrice;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        price: discountedPrice,
        image: product.mainImage
      });
    }

    await cart.save();

    // Populate cart before sending response
    cart = await Cart.findById(cart._id)
      .populate('items.product', 'title price discount images mainImage stock');

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: { cart }
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update/:itemId
// @access  Private
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const itemIndex = cart.items.findIndex(
      item => item._id && item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    if (quantity <= 0) {
      // Remove item
      cart.items.splice(itemIndex, 1);
    } else {
      // Check stock
      const productId = cart.items[itemIndex].product;
      if (productId) {
        const product = await Product.findById(productId);
        if (product && product.stock < quantity) {
          return res.status(400).json({
            success: false,
            message: 'Insufficient stock'
          });
        }
      }
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();

    const updatedCart = await Cart.findById(cart._id)
      .populate('items.product', 'title price discount images mainImage stock');

    res.status(200).json({
      success: true,
      message: 'Cart updated',
      data: { cart: updatedCart }
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:itemId
// @access  Private
export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = cart.items.filter(
      item => item._id && item._id.toString() !== itemId
    );

    await cart.save();

    const updatedCart = await Cart.findById(cart._id)
      .populate('items.product', 'title price discount images mainImage stock');

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: { cart: updatedCart }
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      data: { cart }
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get cart count
// @route   GET /api/cart/count
// @access  Private
export const getCartCount = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    
    const count = cart ? cart.totalItems : 0;

    res.status(200).json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Get cart count error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
