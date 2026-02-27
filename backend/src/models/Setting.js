import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  // Website Settings
  siteName: {
    type: String,
    default: 'Black & Gold'
  },
  siteTagline: {
    type: String,
    default: 'Premium Jewelry & Accessories'
  },
  siteDescription: {
    type: String,
    default: 'Discover hand-crafted jewellery for every style. Timeless pieces that tell your unique story.'
  },
  siteLogo: {
    type: String,
    default: ''
  },
  siteFavicon: {
    type: String,
    default: ''
  },

  // Contact Information
  contactEmail: {
    type: String,
    default: 'hello@blackandgold.com'
  },
  contactPhone: {
    type: String,
    default: '+1 (555) 123-4567'
  },
  contactAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },

  // Social Media Links
  socialMedia: {
    facebook: {
      url: String,
      enabled: { type: Boolean, default: true }
    },
    instagram: {
      url: String,
      enabled: { type: Boolean, default: true }
    },
    twitter: {
      url: String,
      enabled: { type: Boolean, default: true }
    },
    pinterest: {
      url: String,
      enabled: { type: Boolean, default: false }
    },
    youtube: {
      url: String,
      enabled: { type: Boolean, default: false }
    },
    tiktok: {
      url: String,
      enabled: { type: Boolean, default: false }
    }
  },

  // Business Settings
  currency: {
    type: String,
    default: 'PKR',
    enum: ['PKR', 'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'AED', 'SAR']
  },
  currencySymbol: {
    type: String,
    default: 'Rs. '
  },
  taxRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  freeShippingThreshold: {
    type: Number,
    default: 15000
  },
  shippingCost: {
    type: Number,
    default: 200
  },

  // Email Settings
  emailSettings: {
    senderEmail: String,
    senderName: {
      type: String,
      default: 'Black & Gold Jewelry'
    },
    adminEmail: String
  },

  // SEO Settings
  seoSettings: {
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],
    googleAnalyticsId: String,
    facebookPixelId: String
  },

  // Store Policies
  policies: {
    returnPolicy: {
      type: String,
      default: '30-day return policy'
    },
    shippingPolicy: {
      type: String,
      default: 'Free shipping on orders over $100'
    },
    privacyPolicy: {
      type: String
    },
    termsOfService: {
      type: String
    }
  },

  // Maintenance Mode
  maintenanceMode: {
    enabled: { type: Boolean, default: false },
    message: {
      type: String,
      default: 'We\'ll be back soon!'
    }
  },

  // Timestamps
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Setting = mongoose.model('Setting', settingSchema);

export default Setting;
