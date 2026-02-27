import Setting from '../models/Setting.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { processImage } from '../middleware/upload.js';

// @desc    Get all settings
// @route   GET /api/settings
// @access  Private/Admin
export const getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    
    // If no settings exist, create default ones
    if (!settings) {
      settings = await Setting.create({});
    }

    res.status(200).json({
      success: true,
      data: { settings }
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private/Admin
export const updateSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();

    if (!settings) {
      settings = await Setting.create(req.body);
    } else {
      // Update settings
      Object.assign(settings, req.body);
      settings.updatedAt = Date.now();
      await settings.save();
    }

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: { settings }
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update admin profile
// @route   PUT /api/settings/admin-profile
// @access  Private/Admin
export const updateAdminProfile = async (req, res) => {
  try {
    const { name, email, phone, currentPassword, newPassword } = req.body;

    const admin = await User.findOne({ role: 'admin' });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin user not found'
      });
    }

    // Update basic info
    if (name) admin.name = name;
    if (email) admin.email = email;
    if (phone) admin.phone = phone;

    // Update password if provided
    if (currentPassword && newPassword) {
      const isMatch = await admin.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }
      admin.password = newPassword;
    }

    // Update profile image if uploaded
    if (req.file) {
      const processedImage = await processImage(req.file.path, req.file.filename);
      admin.profileImage = processedImage.url;
    }

    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Admin profile updated successfully',
      data: {
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          phone: admin.phone,
          profileImage: admin.profileImage
        }
      }
    });
  } catch (error) {
    console.error('Update admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get admin profile
// @route   GET /api/settings/admin-profile
// @access  Private/Admin
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findOne({ role: 'admin' }).select('-password');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin user not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { admin }
    });
  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update social media links
// @route   PUT /api/settings/social-media
// @access  Private/Admin
export const updateSocialMedia = async (req, res) => {
  try {
    const { socialMedia } = req.body;

    let settings = await Setting.findOne();

    if (!settings) {
      settings = await Setting.create({ socialMedia });
    } else {
      settings.socialMedia = { ...settings.socialMedia, ...socialMedia };
      settings.updatedAt = Date.now();
      await settings.save();
    }

    res.status(200).json({
      success: true,
      message: 'Social media links updated successfully',
      data: { settings }
    });
  } catch (error) {
    console.error('Update social media error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update contact information
// @route   PUT /api/settings/contact
// @access  Private/Admin
export const updateContact = async (req, res) => {
  try {
    const { contactEmail, contactPhone, contactAddress } = req.body;

    let settings = await Setting.findOne();

    if (!settings) {
      settings = await Setting.create({ contactEmail, contactPhone, contactAddress });
    } else {
      if (contactEmail) settings.contactEmail = contactEmail;
      if (contactPhone) settings.contactPhone = contactPhone;
      if (contactAddress) settings.contactAddress = contactAddress;
      
      settings.updatedAt = Date.now();
      await settings.save();
    }

    res.status(200).json({
      success: true,
      message: 'Contact information updated successfully',
      data: { settings }
    });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update business settings
// @route   PUT /api/settings/business
// @access  Private/Admin
export const updateBusinessSettings = async (req, res) => {
  try {
    const { currency, currencySymbol, taxRate, freeShippingThreshold, shippingCost } = req.body;

    let settings = await Setting.findOne();

    if (!settings) {
      settings = await Setting.create({ currency, currencySymbol, taxRate, freeShippingThreshold, shippingCost });
    } else {
      if (currency) settings.currency = currency;
      if (currencySymbol) settings.currencySymbol = currencySymbol;
      if (taxRate !== undefined) settings.taxRate = taxRate;
      if (freeShippingThreshold !== undefined) settings.freeShippingThreshold = freeShippingThreshold;
      if (shippingCost !== undefined) settings.shippingCost = shippingCost;
      
      settings.updatedAt = Date.now();
      await settings.save();
    }

    res.status(200).json({
      success: true,
      message: 'Business settings updated successfully',
      data: { settings }
    });
  } catch (error) {
    console.error('Update business settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Toggle maintenance mode
// @route   PUT /api/settings/maintenance-mode
// @access  Private/Admin
export const toggleMaintenanceMode = async (req, res) => {
  try {
    const { enabled, message } = req.body;

    let settings = await Setting.findOne();

    if (!settings) {
      settings = await Setting.create({ maintenanceMode: { enabled, message } });
    } else {
      settings.maintenanceMode.enabled = enabled !== undefined ? enabled : !settings.maintenanceMode.enabled;
      if (message) settings.maintenanceMode.message = message;
      settings.updatedAt = Date.now();
      await settings.save();
    }

    res.status(200).json({
      success: true,
      message: `Maintenance mode ${settings.maintenanceMode.enabled ? 'enabled' : 'disabled'}`,
      data: { settings }
    });
  } catch (error) {
    console.error('Toggle maintenance mode error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
