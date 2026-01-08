import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../../services/api';
import './DealsSection.css';

const DealsSection = ({ title, category, sortBy = 'discount', layout = 'scroll' }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const limit = layout === 'grid' ? 4 : 8;
        const params = { limit, sort: sortBy };
        if (category) {
          params.category = category;
        }
        const response = await getProducts(params);
        if (response.success) {
          setProducts(response.data.products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, sortBy, layout]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <section className={`deals-section ${layout === 'grid' ? 'grid-layout' : ''}`}>
        <div className="deals-header">
          <h2>{title}</h2>
        </div>
        <div className="deals-loading">
          <div className="spinner"></div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  // Grid layout for Electronics and Fashion
  if (layout === 'grid') {
    return (
      <section className="deals-section grid-layout">
        <div className="deals-header">
          <h2>{title}</h2>
          <Link to={category ? `/products?category=${category}` : '/products'} className="view-all-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        <div className="deals-grid">
          {products.slice(0, 4).map((product) => (
            <Link key={product._id} to={`/product/${product._id}`} className="deal-card-grid">
              <div className="deal-image-grid">
                <img src={product.thumbnail} alt={product.name} loading="lazy" />
              </div>
              <div className="deal-info-grid">
                <h3 className="deal-name-grid">{product.name}</h3>
                <p className="deal-discount-grid">
                  {product.discount > 0 ? `Min. ${product.discount}% Off` : 'Best Price'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  // Scroll layout for Top Deals
  return (
    <section className="deals-section">
      <div className="deals-header">
        <h2>{title}</h2>
        <Link to={category ? `/products?category=${category}` : '/products'} className="view-all-arrow">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>

      <div className="deals-wrapper">
        <button className="scroll-btn left" onClick={() => scroll('left')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        <div className="deals-scroll" ref={scrollRef}>
          {products.map((product) => (
            <Link key={product._id} to={`/product/${product._id}`} className="deal-card">
              <div className="deal-image">
                <img src={product.thumbnail} alt={product.name} loading="lazy" />
              </div>
              <div className="deal-info">
                <h3 className="deal-name">{product.name}</h3>
                <p className="deal-price">
                  From {formatPrice(product.sellingPrice)}
                </p>
                {product.discount > 0 && (
                  <span className="deal-discount">{product.discount}% off</span>
                )}
              </div>
            </Link>
          ))}
        </div>

        <button className="scroll-btn right" onClick={() => scroll('right')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </section>
  );
};

export default DealsSection;
