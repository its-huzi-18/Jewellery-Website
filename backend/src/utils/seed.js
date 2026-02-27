import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

dotenv.config();

const sampleProducts = [
  // Rings
  {
    title: "Eternal Love Diamond Ring",
    description: "A stunning diamond ring featuring a brilliant cut center stone surrounded by delicate pavé diamonds. Crafted in 18k gold, this ring symbolizes eternal love and commitment. Perfect for engagements or as a timeless addition to your jewelry collection.",
    price: 365000,
    discount: 15,
    category: "rings",
    stock: 25,
    featured: true,
    specifications: [
      { name: "Material", value: "18k Gold" },
      { name: "Stone", value: "Diamond" },
      { name: "Carat", value: "0.75ct" }
    ]
  },
  {
    title: "Vintage Gold Band Ring",
    description: "An exquisite vintage-inspired gold band with intricate detailing. This timeless piece features ornate patterns that capture the elegance of a bygone era. Perfect for stacking or wearing alone as a statement piece.",
    price: 154000,
    discount: 0,
    category: "rings",
    stock: 40,
    featured: true,
    specifications: [
      { name: "Material", value: "14k Gold" },
      { name: "Style", value: "Vintage" },
      { name: "Width", value: "4mm" }
    ]
  },
  {
    title: "Sapphire Promise Ring",
    description: "A breathtaking sapphire ring with a deep blue center stone flanked by sparkling diamonds. Set in white gold, this ring represents faithfulness and sincerity. An ideal choice for promises and special commitments.",
    price: 899.99,
    discount: 10,
    category: "rings",
    stock: 18,
    featured: false,
    specifications: [
      { name: "Material", value: "White Gold" },
      { name: "Stone", value: "Sapphire" },
      { name: "Accent", value: "Diamonds" }
    ]
  },
  {
    title: "Infinity Twist Ring",
    description: "A modern twist on classic elegance, this infinity-inspired ring features intertwined bands of rose and white gold. The symbolic design represents endless love and connection.",
    price: 429.99,
    discount: 0,
    category: "rings",
    stock: 35,
    featured: false,
    specifications: [
      { name: "Material", value: "Rose & White Gold" },
      { name: "Style", value: "Modern" },
      { name: "Design", value: "Infinity Twist" }
    ]
  },
  
  // Bracelets
  {
    title: "Charm Bracelet Classic",
    description: "A timeless charm bracelet in sterling silver, perfect for collecting memories. Features a secure lobster clasp and comes with one complimentary heart charm. Add more charms to tell your unique story.",
    price: 299.99,
    discount: 0,
    category: "bracelets",
    stock: 50,
    featured: true,
    specifications: [
      { name: "Material", value: "Sterling Silver" },
      { name: "Length", value: "7.5 inches" },
      { name: "Clasp", value: "Lobster" }
    ]
  },
  {
    title: "Gold Tennis Bracelet",
    description: "An elegant tennis bracelet featuring a continuous line of brilliant-cut diamonds. Crafted in 18k yellow gold, this bracelet adds instant glamour to any occasion. Secured with a box clasp and safety latch.",
    price: 2499.99,
    discount: 20,
    category: "bracelets",
    stock: 12,
    featured: true,
    specifications: [
      { name: "Material", value: "18k Yellow Gold" },
      { name: "Stones", value: "Diamonds" },
      { name: "Total Carat", value: "2.5ct" }
    ]
  },
  {
    title: "Bangle Set Rose Gold",
    description: "A set of three delicate rose gold bangles that can be worn together or separately. Each bangle features a different texture - polished, brushed, and hammered - creating visual interest and versatility.",
    price: 379.99,
    discount: 0,
    category: "bracelets",
    stock: 30,
    featured: false,
    specifications: [
      { name: "Material", value: "Rose Gold Plated" },
      { name: "Set", value: "3 Pieces" },
      { name: "Diameter", value: "65mm" }
    ]
  },
  
  // Necklaces
  {
    title: "Pearl Pendant Necklace",
    description: "A classic pearl pendant suspended from a delicate gold chain. The lustrous freshwater pearl is set in a simple gold bezel, creating a timeless piece that transitions seamlessly from day to night.",
    price: 449.99,
    discount: 0,
    category: "necklaces",
    stock: 28,
    featured: true,
    specifications: [
      { name: "Material", value: "14k Gold" },
      { name: "Pearl", value: "Freshwater" },
      { name: "Chain Length", value: "18 inches" }
    ]
  },
  {
    title: "Layered Chain Necklace",
    description: "A trendy layered necklace featuring three chains of varying lengths and styles. Combines box, cable, and figaro chains in gold vermeil for a modern, effortless look.",
    price: 189.99,
    discount: 10,
    category: "necklaces",
    stock: 45,
    featured: false,
    specifications: [
      { name: "Material", value: "Gold Vermeil" },
      { name: "Layers", value: "3" },
      { name: "Lengths", value: "16, 18, 20 inches" }
    ]
  },
  {
    title: "Diamond Solitaire Necklace",
    description: "An elegant solitaire diamond necklace with a brilliant-cut diamond pendant. The minimalist design showcases the diamond's beauty, making it perfect for everyday wear or special occasions.",
    price: 799.99,
    discount: 0,
    category: "necklaces",
    stock: 20,
    featured: true,
    specifications: [
      { name: "Material", value: "White Gold" },
      { name: "Diamond", value: "0.25ct" },
      { name: "Chain", value: "18 inches" }
    ]
  },
  
  // Earrings
  {
    title: "Diamond Stud Earrings",
    description: "Classic diamond stud earrings that belong in every jewelry collection. Featuring brilliant-cut diamonds in four-prong settings, these earrings catch light beautifully from every angle.",
    price: 699.99,
    discount: 0,
    category: "earrings",
    stock: 35,
    featured: true,
    specifications: [
      { name: "Material", value: "14k Gold" },
      { name: "Diamond", value: "0.5ct TW" },
      { name: "Backing", value: "Push" }
    ]
  },
  {
    title: "Hoop Earrings Gold",
    description: "Timeless gold hoop earrings with a polished finish. These medium-sized hoops are perfect for everyday wear and complement any outfit. Features a secure hinged closure.",
    price: 249.99,
    discount: 0,
    category: "earrings",
    stock: 60,
    featured: false,
    specifications: [
      { name: "Material", value: "18k Gold" },
      { name: "Diameter", value: "25mm" },
      { name: "Closure", value: "Hinged" }
    ]
  },
  {
    title: "Drop Earrings Emerald",
    description: "Elegant drop earrings featuring emerald-cut gemstones suspended from delicate chains. The sophisticated design makes these earrings perfect for formal events and special occasions.",
    price: 549.99,
    discount: 15,
    category: "earrings",
    stock: 15,
    featured: false,
    specifications: [
      { name: "Material", value: "White Gold" },
      { name: "Stone", value: "Emerald" },
      { name: "Drop Length", value: "35mm" }
    ]
  },
  
  // Charms
  {
    title: "Heart Locket Charm",
    description: "A beautiful heart-shaped locket charm that opens to hold two small photos. Engraved with delicate patterns, this charm is perfect for keeping loved ones close to your heart.",
    price: 89.99,
    discount: 0,
    category: "charms",
    stock: 100,
    featured: true,
    specifications: [
      { name: "Material", value: "Sterling Silver" },
      { name: "Size", value: "15mm" },
      { name: "Photos", value: "2" }
    ]
  },
  {
    title: "Birthstone Flower Charm",
    description: "A delicate flower charm featuring a genuine birthstone at its center. Available for all twelve months, this charm makes a personalized gift or a meaningful addition to your bracelet.",
    price: 69.99,
    discount: 0,
    category: "charms",
    stock: 120,
    featured: false,
    specifications: [
      { name: "Material", value: "Sterling Silver" },
      { name: "Stone", value: "Genuine Birthstone" },
      { name: "Size", value: "12mm" }
    ]
  },
  
  // Bestsellers
  {
    title: "Complete Jewelry Set",
    description: "An exquisite jewelry set including a necklace, earrings, and bracelet. Each piece features matching designs with sparkling crystals, perfect for weddings and formal events.",
    price: 899.99,
    discount: 25,
    category: "bestsellers",
    stock: 15,
    featured: true,
    specifications: [
      { name: "Material", value: "Silver Plated" },
      { name: "Stones", value: "Crystals" },
      { name: "Pieces", value: "3" }
    ]
  },
  {
    title: "Minimalist Ring Set",
    description: "A set of five minimalist rings in varying styles that can be mixed and matched. Includes stackable bands, a midi ring, and a statement piece. Perfect for creating your own unique combinations.",
    price: 129.99,
    discount: 0,
    category: "bestsellers",
    stock: 80,
    featured: true,
    specifications: [
      { name: "Material", value: "Gold Plated" },
      { name: "Set", value: "5 Pieces" },
      { name: "Style", value: "Minimalist" }
    ]
  }
];

// Generate placeholder image URLs (using reliable Pexels images)
const placeholderImages = {
  rings: [
    'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?w=800&h=800&fit=crop',
    'https://images.pexels.com/photos/1623452/pexels-photo-1623452.jpeg?w=800&h=800&fit=crop',
    'https://images.pexels.com/photos/6132098/pexels-photo-6132098.jpeg?w=800&h=800&fit=crop',
    'https://images.pexels.com/photos/8297519/pexels-photo-8297519.jpeg?w=800&h=800&fit=crop'
  ],
  bracelets: [
    'https://images.pexels.com/photos/316291/pexels-photo-316291.jpeg?w=800&h=800&fit=crop',
    'https://images.pexels.com/photos/404138/pexels-photo-404138.jpeg?w=800&h=800&fit=crop',
    'https://images.pexels.com/photos/91298/pexels-photo-91298.jpeg?w=800&h=800&fit=crop'
  ],
  necklaces: [
    'https://images.pexels.com/photos/1612914/pexels-photo-1612914.jpeg?w=800&h=800&fit=crop',
    'https://images.pexels.com/photos/5654615/pexels-photo-5654615.jpeg?w=800&h=800&fit=crop',
    'https://images.pexels.com/photos/316291/pexels-photo-316291.jpeg?w=800&h=800&fit=crop'
  ],
  earrings: [
    'https://images.pexels.com/photos/1315564/pexels-photo-1315564.jpeg?w=800&h=800&fit=crop',
    'https://images.pexels.com/photos/404138/pexels-photo-404138.jpeg?w=800&h=800&fit=crop',
    'https://images.pexels.com/photos/91298/pexels-photo-91298.jpeg?w=800&h=800&fit=crop'
  ],
  charms: [
    'https://images.pexels.com/photos/316291/pexels-photo-316291.jpeg?w=800&h=800&fit=crop',
    'https://images.pexels.com/photos/404138/pexels-photo-404138.jpeg?w=800&h=800&fit=crop'
  ],
  bestsellers: [
    'https://images.pexels.com/photos/1612914/pexels-photo-1612914.jpeg?w=800&h=800&fit=crop',
    'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?w=800&h=800&fit=crop'
  ]
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected for seeding');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@blackgold.com',
      password: 'admin123',
      role: 'admin',
      phone: '+92 300 1234567'
    });

    // Create sample user
    const user = await User.create({
      name: 'John Doe',
      email: 'user@blackgold.com',
      password: 'user123',
      role: 'user',
      phone: '+92 321 9876543',
      address: {
        street: 'House #123, Street 45',
        city: 'Karachi',
        state: 'Sindh',
        zipCode: '75500',
        country: 'Pakistan'
      }
    });

    console.log('👤 Created users');

    // Create products with images
    let imageIndex = 0;
    for (const productData of sampleProducts) {
      const categoryImages = placeholderImages[productData.category] || placeholderImages.rings;
      const mainImage = categoryImages[imageIndex % categoryImages.length];
      
      await Product.create({
        ...productData,
        images: [{ url: mainImage, publicId: `product-${imageIndex}` }],
        mainImage
      });
      imageIndex++;
    }

    console.log('💎 Created products');

    // Create carts for users
    await Cart.create({ user: admin._id, items: [] });
    await Cart.create({ user: user._id, items: [] });

    console.log('🛒 Created carts');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Sample Credentials:');
    console.log('   Admin: admin@blackgold.com / admin123');
    console.log('   User:  user@blackgold.com / user123');
    console.log('\n💰 All prices are in Pakistani Rupees (PKR)');
    console.log('📍 Shipping available within Pakistan only');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedDatabase();
