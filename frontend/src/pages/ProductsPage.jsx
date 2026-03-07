import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest'
  });

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'rings', label: 'Rings' },
    { value: 'bracelets', label: 'Bracelets' },
    { value: 'necklaces', label: 'Necklaces' },
    { value: 'earrings', label: 'Earrings' },
    { value: 'charms', label: 'Charms' },
    { value: 'bestsellers', label: 'Best Sellers' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'bestselling', label: 'Best Selling' }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          category: searchParams.get('category') || '',
          search: searchParams.get('search') || '',
          minPrice: searchParams.get('minPrice') || '',
          maxPrice: searchParams.get('maxPrice') || '',
          sort: searchParams.get('sort') || 'newest',
          page: searchParams.get('page') || 1,
          limit: 12
        };

        console.log('=== Fetch Products ===');
        console.log('Sort param from URL:', searchParams.get('sort'));
        console.log('Final params being sent:', params);

        // Remove empty params
        Object.keys(params).forEach(key => {
          if (params[key] === '') delete params[key];
        });

        const { data } = await productAPI.getProducts(params);
        console.log('Products received:', data.data.products.length);
        console.log('First product price:', data.data.products[0]?.price);
        setProducts(data.data.products);
        setPagination(data.data.pagination);

        // Update filters state to match URL
        setFilters({
          category: params.category || '',
          search: params.search || '',
          minPrice: params.minPrice || '',
          maxPrice: params.maxPrice || '',
          sort: params.sort || 'newest'
        });
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const params = new URLSearchParams();
    Object.keys(newFilters).forEach(key => {
      if (newFilters[key]) {
        params.set(key, newFilters[key]);
      }
    });
    params.set('page', '1'); // Reset to first page on filter change

    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    
    console.log('=== Page Change ===');
    console.log('Current URL params:', searchParams.toString());
    console.log('New params:', params.toString());
    console.log('Sort in params:', params.get('sort'));
    
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      search: '',
      minPrice: '',
      maxPrice: '',
      sort: 'newest'
    });
    setSearchParams({});
  };

  const hasActiveFilters = filters.category || filters.search || filters.minPrice || filters.maxPrice;

  return (
    <div className="pt-28 min-h-screen bg-black-50">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-gold-600 text-sm uppercase tracking-widest mb-4">
            Our Collection
          </p>
          <h1 className="section-title">All Products</h1>
          <p className="section-subtitle mx-auto">
            Explore our complete range of handcrafted jewelry
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b">
          {/* Results count */}
          <div className="flex items-center gap-4">
            <p className="text-black-600">
              {pagination?.total || 0} products
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-gold-600 hover:text-gold-700 flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear filters
              </button>
            )}
          </div>

          {/* Sort and filter buttons */}
          <div className="flex items-center gap-3">
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="input-field w-auto py-2 text-sm"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 border ${
                showFilters || hasActiveFilters
                  ? 'border-gold-600 text-gold-600'
                  : 'border-black-300 text-black-700'
              } hover:border-gold-600 transition-colors md:hidden`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              {/* Category Filter */}
              <div>
                <h3 className="font-medium text-black-900 mb-3">Category</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label key={cat.value} className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === cat.value}
                        onChange={() => handleFilterChange('category', cat.value)}
                        className="w-4 h-4 text-gold-600 focus:ring-gold-500"
                      />
                      <span className="ml-2 text-black-600 group-hover:text-gold-600 transition-colors">
                        {cat.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-medium text-black-900 mb-3">Price Range</h3>
                <div className="space-y-3">
                  <input
                    type="number"
                    placeholder="Min price"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="input-field text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max price"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="input-field text-sm"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 bg-black-900/50 z-50" onClick={() => setShowFilters(false)}>
              <div
                className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white p-6 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-serif text-xl font-semibold">Filters</h2>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Category */}
                <div className="mb-6">
                  <h3 className="font-medium text-black-900 mb-3">Category</h3>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <label key={cat.value} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="mobile-category"
                          checked={filters.category === cat.value}
                          onChange={() => {
                            handleFilterChange('category', cat.value);
                            setShowFilters(false);
                          }}
                          className="w-4 h-4 text-gold-600 focus:ring-gold-500"
                        />
                        <span className="ml-2 text-black-600">{cat.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="font-medium text-black-900 mb-3">Price Range</h3>
                  <div className="space-y-3">
                    <input
                      type="number"
                      placeholder="Min price"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="input-field"
                    />
                    <input
                      type="number"
                      placeholder="Max price"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setShowFilters(false)}
                  className="btn-primary w-full"
                >
                  Show Results
                </button>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <main className="lg:col-span-3">
            {loading ? (
              <LoadingSpinner />
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-black-500 text-lg mb-4">No products found</p>
                <button onClick={clearFilters} className="btn-outline">
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={!pagination.hasPrev}
                      className="px-4 py-2 border disabled:opacity-50 disabled:cursor-not-allowed hover:border-gold-600 transition-colors"
                    >
                      Previous
                    </button>

                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 flex items-center justify-center ${
                          page === pagination.page
                            ? 'bg-gold-600 text-white'
                            : 'border hover:border-gold-600'
                        } transition-colors`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={!pagination.hasNext}
                      className="px-4 py-2 border disabled:opacity-50 disabled:cursor-not-allowed hover:border-gold-600 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
