import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

// Placeholder images from Unsplash for jewelry
const placeholderImages = {
  rings: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop',
  bracelets: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop',
  necklaces: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=800&h=800&fit=crop',
  earrings: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop',
  charms: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop',
  pendants: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=800&h=800&fit=crop',
  gifts: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop',
  bestsellers: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop'
};

const fixProductImages = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    const products = await Product.find({});
    console.log(`Found ${products.length} products`);

    let updated = 0;
    let failed = 0;

    for (const product of products) {
      const hasBrokenImages = 
        !product.mainImage || 
        product.mainImage.includes('/uploads/') ||
        product.mainImage.includes('localhost') ||
        product.images?.some(img => img.url?.includes('/uploads/') || img.url?.includes('localhost'));

      if (hasBrokenImages) {
        // Get category-specific placeholder or use rings as default
        const placeholderUrl = placeholderImages[product.category] || placeholderImages.rings;
        
        // Update product with placeholder image
        product.mainImage = placeholderUrl;
        product.images = [{ url: placeholderUrl, publicId: '' }];
        
        try {
          await product.save();
          console.log(`✅ Updated: ${product.title}`);
          updated++;
        } catch (error) {
          console.error(`❌ Failed to update ${product.title}:`, error.message);
          failed++;
        }
      } else {
        console.log(`⏭️  Skipped: ${product.title} (images OK)`);
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Failed: ${failed}`);
    console.log(`   Skipped: ${products.length - updated - failed}`);

    await mongoose.disconnect();
    console.log('\n✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

fixProductImages();
