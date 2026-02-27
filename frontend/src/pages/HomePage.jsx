import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Gift, Truck, Shield } from 'lucide-react';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [topSelling, setTopSelling] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, topSellingRes] = await Promise.all([
          productAPI.getFeatured(),
          productAPI.getTopSelling()
        ]);
        setFeaturedProducts(featuredRes.data.data.products);
        setTopSelling(topSellingRes.data.data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categories = [
    { name: 'Best Sellers', path: '/products?category=bestsellers', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop' },
    { name: 'Rings', path: '/products?category=rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop' },
    { name: 'Charms', path: '/products?category=charms', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop' },
    { name: 'Bracelets', path: '/products?category=bracelets', image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&h=600&fit=crop' },
    { name: 'Necklaces & Pendants', path: '/products?category=necklaces', image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=600&h=600&fit=crop' },
    { name: 'Earrings', path: '/products?category=earrings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop' }
  ];

  const features = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'Handcrafted Quality',
      description: 'Each piece is carefully crafted by skilled artisans'
    },
    {
      icon: <Gift className="w-8 h-8" />,
      title: 'Beautiful Packaging',
      description: 'Every order arrives in our signature gift box'
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: 'Free Shipping',
      description: 'Complimentary shipping on orders over $100'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Lifetime Warranty',
      description: 'We stand behind the quality of our jewelry'
    }
  ];

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="pt-28">
      {/* Hero Section - Based on design image */}
      <section className="relative bg-gradient-to-br from-black-900 via-black-800 to-gold-950 text-white overflow-hidden">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh] py-16 lg:py-24">
            {/* Left content */}
            <div className="order-2 lg:order-1 animate-slide-up">
              <p className="text-gold-400 text-sm uppercase tracking-widest mb-4">
                New Collection 2024
              </p>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Ring <span className="text-gold-500">Obsessed</span>
              </h1>
              <p className="text-black-300 text-lg md:text-xl mb-8 max-w-md">
                Feed your need to stack. Discover our exquisite collection of statement rings designed for the modern individual.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products?category=rings" className="btn-primary inline-flex items-center gap-2">
                  Shop Rings
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/products" className="btn-gold-outline">
                  View All Jewelry
                </Link>
              </div>
            </div>

            {/* Right content - Ring showcase */}
            <div className="order-1 lg:order-2 relative">
              <div className="grid grid-cols-3 gap-4">
                {[
                  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=500&fit=crop',
                  'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400&h=500&fit=crop',
                  'https://images.unsplash.com/photo-1598560916717-52f0e6d501f7?w=400&h=500&fit=crop',
                  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=500&fit=crop',
                  'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400&h=500&fit=crop',
                  'https://images.unsplash.com/photo-1598560916717-52f0e6d501f7?w=400&h=500&fit=crop'
                ].map((img, index) => (
                  <div
                    key={index}
                    className={`relative overflow-hidden rounded-lg ${
                      index === 0 || index === 5 ? 'row-span-2' : ''
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Ring ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Decorative element */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black-50 to-transparent"></div>
      </section>

      {/* Categories Section - Based on design image */}
      <section className="py-20 bg-black-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-12 items-center">
            {/* Left content */}
            <div className="lg:col-span-1">
              <p className="text-black-500 text-sm uppercase tracking-widest mb-4">
                Our Collections
              </p>
              <h2 className="section-title">
                Discover a world of jewellery
              </h2>
              <p className="section-subtitle">
                Hand-finished jewellery for every style. From timeless classics to contemporary statement pieces.
              </p>
              <Link to="/products" className="btn-secondary inline-flex items-center gap-2">
                Shop All Jewellery
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Category grid */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((category, index) => (
                  <Link
                    key={category.name}
                    to={category.path}
                    className="category-card aspect-square"
                  >
                    <img src={category.image} alt={category.name} />
                    <div className="category-overlay"></div>
                    <div className="absolute inset-0 flex items-end p-4">
                      <span className="text-white font-medium text-sm md:text-base">
                        {category.name}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-gold-600 text-sm uppercase tracking-widest mb-4">
              Curated Selection
            </p>
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle mx-auto">
              Explore our handpicked selection of exquisite pieces
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 stagger-animation">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/products" className="btn-outline inline-flex items-center gap-2">
              View All Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Top Selling */}
      <section className="py-20 bg-black-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-gold-600 text-sm uppercase tracking-widest mb-4">
              Customer Favorites
            </p>
            <h2 className="section-title">Top Selling</h2>
            <p className="section-subtitle mx-auto">
              The most loved pieces by our customers
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 stagger-animation">
            {topSelling.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black-900 text-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-600/20 text-gold-500 mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-serif text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-black-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gold-600 to-gold-700">
        <div className="container-custom text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
            Join the Black & Gold Family
          </h2>
          <p className="text-gold-100 mb-8 max-w-xl mx-auto">
            Subscribe to receive updates on new arrivals, special offers, and exclusive events.
          </p>
          <Link to="/register" className="bg-white text-black-900 px-8 py-3 font-medium hover:bg-black-900 hover:text-white transition-all duration-300">
            Create Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
