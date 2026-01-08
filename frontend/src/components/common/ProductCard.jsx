import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from './Toast';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [adding, setAdding] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getRatingClass = (rating) => {
    if (rating >= 4) return '';
    if (rating >= 3) return 'low';
    return 'very-low';
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    const result = await addToCart(product._id, 1);
    setAdding(false);
    
    if (result.success) {
      showToast(`${product.name} added to cart!`, 'success');
    } else {
      showToast('Failed to add to cart', 'error');
    }
  };

  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <div className="product-image">
        <img src={product.thumbnail} alt={product.name} loading="lazy" />
        {product.discount > 0 && (
          <span className="discount-badge">{product.discount}% off</span>
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        
        {product.rating && product.rating.average > 0 && (
          <div className="product-rating">
            <span className={`rating-badge ${getRatingClass(product.rating.average)}`}>
              {product.rating.average.toFixed(1)}
              <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 0L7.34708 4.1459H11.7063L8.17963 6.7082L9.52671 10.8541L6 8.2918L2.47329 10.8541L3.82037 6.7082L0.293661 4.1459H4.65292L6 0Z"/>
              </svg>
            </span>
            <span className="rating-count">({product.rating.count.toLocaleString()})</span>
          </div>
        )}
        
        <div className="product-pricing">
          <span className="selling-price">{formatPrice(product.sellingPrice)}</span>
          {product.discount > 0 && (
            <>
              <span className="original-price">{formatPrice(product.price)}</span>
              <span className="discount">{product.discount}% off</span>
            </>
          )}
        </div>

        {product.brand && (
          <span className="product-brand">{product.brand}</span>
        )}

        <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={adding}>
          {adding ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
