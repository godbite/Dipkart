import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { useToast } from '../components/common/Toast';
import { getProduct } from '../services/api';
import { useCart } from '../context/CartContext';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProduct(id);
        if (response.success) {
          setProduct(response.data);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    const result = await addToCart(product._id, 1);
    setAddingToCart(false);
    if (result.success) {
      showToast(`${product.name} added to cart!`, 'success');
    } else {
      showToast('Failed to add to cart', 'error');
    }
  };

  const handleBuyNow = async () => {
    setAddingToCart(true);
    const result = await addToCart(product._id, 1);
    setAddingToCart(false);
    if (result.success) {
      navigate('/cart');
    }
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <Header />
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <Header />
        <div className="not-found">
          <h2>Product not found</h2>
          <button onClick={() => navigate('/products')} className="btn btn-primary">
            Browse Products
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : [product.thumbnail];

  return (
    <div className="product-detail-page">
      <Header />
      
      <main className="product-detail-main">
        <div className="product-detail-container">
          {/* Back Button */}
          <button className="back-btn" onClick={() => navigate(-1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>

          <div className="product-detail-content">
            {/* Left - Images */}
            <div className="product-images-section">
              <div className="image-thumbnails">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onMouseEnter={() => setSelectedImage(index)}
                  >
                    <img src={img} alt={`${product.name} ${index + 1}`} />
                  </div>
                ))}
              </div>
              
              <div className="main-image">
                <img src={images[selectedImage]} alt={product.name} />
              </div>

              <div className="action-buttons">
                <button 
                  className="btn-add-cart" 
                  onClick={handleAddToCart}
                  disabled={addingToCart || !product.isAvailable}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M1 1H5L7.68 14.39C7.77 14.83 8.02 15.22 8.38 15.49C8.74 15.76 9.19 15.9 9.64 15.88H19.36C19.81 15.9 20.26 15.76 20.62 15.49C20.98 15.22 21.23 14.83 21.32 14.39L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {addingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
                <button 
                  className="btn-buy-now" 
                  onClick={handleBuyNow}
                  disabled={addingToCart || !product.isAvailable}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Buy Now
                </button>
              </div>
            </div>

            {/* Right - Details */}
            <div className="product-info-section">
              <nav className="breadcrumb">
                <a href="/">Home</a>
                <span>/</span>
                {product.category && (
                  <>
                    <a href={`/products?category=${product.category.slug}`}>{product.category.name}</a>
                    <span>/</span>
                  </>
                )}
                <span>{product.name}</span>
              </nav>

              <h1 className="product-title">{product.name}</h1>

              {product.rating && product.rating.average > 0 && (
                <div className="product-rating">
                  <span className={`rating-badge ${product.rating.average < 3 ? 'very-low' : product.rating.average < 4 ? 'low' : ''}`}>
                    {product.rating.average.toFixed(1)}
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                      <path d="M6 0L7.34708 4.1459H11.7063L8.17963 6.7082L9.52671 10.8541L6 8.2918L2.47329 10.8541L3.82037 6.7082L0.293661 4.1459H4.65292L6 0Z"/>
                    </svg>
                  </span>
                  <span className="rating-count">{product.rating.count.toLocaleString()} Ratings</span>
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

              <div className="stock-status">
                {product.isAvailable && product.stock > 0 ? (
                  <span className="in-stock">In Stock ({product.stock} available)</span>
                ) : (
                  <span className="out-of-stock">Out of Stock</span>
                )}
              </div>

              {/* Highlights */}
              {product.highlights && product.highlights.length > 0 && (
                <div className="product-highlights">
                  <h3>Highlights</h3>
                  <ul>
                    {product.highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Description */}
              <div className="product-description">
                <h3>Description</h3>
                <p>{product.description}</p>
              </div>

              {/* Specifications */}
              {product.specifications && product.specifications.length > 0 && (
                <div className="product-specifications">
                  <h3>Specifications</h3>
                  <table>
                    <tbody>
                      {product.specifications.map((spec, index) => (
                        <tr key={index}>
                          <td className="spec-key">{spec.key}</td>
                          <td className="spec-value">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
