import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

// Working Unsplash images by category
const categoryImages = {
  rings: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop',
  bracelets: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop',
  necklaces: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=800&h=800&fit=crop',
  earrings: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop',
  charms: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop',
  pendants: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=800&h=800&fit=crop',
  gifts: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop',
  bestsellers: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop'
};

const fixAllImages = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    const products = await Product.find({});
    console.log(`Found ${products.length} products`);

    let updated = 0;

    for (const product of products) {
      const newImage = categoryImages[product.category] || categoryImages.rings;
      
      // Only update if different from current
      if (product.mainImage !== newImage) {
        product.mainImage = newImage;
        product.images = [{ url: newImage, publicId: '' }];
        
        await product.save();
        console.log(`✅ ${product.category}: ${product.title}`);
        updated++;
      } else {
        console.log(`⏭️  ${product.category}: ${product.title} (already updated)`);
      }
    }

    console.log(`\n📊 Updated: ${updated} products`);

    await mongoose.disconnect();
    console.log('\n✅ All products now have working images!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

fixAllImages();
