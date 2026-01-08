import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '../components/common/Header';
import CategoryNav from '../components/common/CategoryNav';
import Footer from '../components/common/Footer';
import ProductCard from '../components/common/ProductCard';
import { getProducts, getCategories } from '../services/api';
import './ProductListPage.css';

const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page')) || 1;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        if (response.success) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: 20,
          sort
        };
        if (category) params.category = category;
        if (search) params.search = search;
        if (priceRange.min) params.minPrice = priceRange.min;
        if (priceRange.max) params.maxPrice = priceRange.max;

        const response = await getProducts(params);
        if (response.success) {
          setProducts(response.data.products);
          setPagination(response.data.pagination);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, search, sort, page, priceRange]);

  const handleSortChange = (e) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', e.target.value);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleCategoryChange = (slug) => {
    const newParams = new URLSearchParams(searchParams);
    if (slug) {
      newParams.set('category', slug);
    } else {
      newParams.delete('category');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePriceFilter = () => {
    const newParams = new URLSearchParams(searchParams);
    if (priceRange.min) newParams.set('minPrice', priceRange.min);
    else newParams.delete('minPrice');
    if (priceRange.max) newParams.set('maxPrice', priceRange.max);
    else newParams.delete('maxPrice');
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo(0, 0);
  };

  const getCategoryName = () => {
    if (search) return `Search results for "${search}"`;
    if (category) {
      const cat = categories.find(c => c.slug === category);
      return cat ? cat.name : 'Products';
    }
    return 'All Products';
  };

  return (
    <div className="product-list-page">
      <Header />
      <CategoryNav />
      
      <main className="product-list-main">
        <div className="product-list-container">
          {/* Sidebar Filters */}
          <aside className="filters-sidebar">
            <div className="filter-section">
              <h3>Filters</h3>
            </div>

            <div className="filter-section">
              <h4>CATEGORIES</h4>
              <ul className="category-list">
                <li>
                  <button 
                    className={!category ? 'active' : ''}
                    onClick={() => handleCategoryChange('')}
                  >
                    All Categories
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat._id}>
                    <button 
                      className={category === cat.slug ? 'active' : ''}
                      onClick={() => handleCategoryChange(cat.slug)}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="filter-section">
              <h4>PRICE</h4>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                />
                <span>to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                />
              </div>
              <button className="apply-price-btn" onClick={handlePriceFilter}>
                Apply
              </button>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="products-content">
            <div className="products-header">
              <div className="results-info">
                <h1>{getCategoryName()}</h1>
                {pagination.totalProducts !== undefined && (
                  <span className="results-count">
                    (Showing {products.length} of {pagination.totalProducts} products)
                  </span>
                )}
              </div>
              
              <div className="sort-dropdown">
                <label>Sort By:</label>
                <select value={sort} onChange={handleSortChange}>
                  <option value="newest">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="discount">Discount</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="no-products">
                <h2>No products found</h2>
                <p>Try adjusting your search or filter criteria</p>
                <Link to="/products" className="btn btn-primary">View All Products</Link>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="pagination">
                    <button 
                      disabled={!pagination.hasPrev}
                      onClick={() => handlePageChange(page - 1)}
                    >
                      Previous
                    </button>
                    
                    <span className="page-info">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    
                    <button 
                      disabled={!pagination.hasNext}
                      onClick={() => handlePageChange(page + 1)}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductListPage;
