import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { useCart } from '../context/CartContext';
import './CartPage.css';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, loading, updateQuantity, removeFromCart } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateQuantity(productId, newQuantity);
  };

  const handleRemove = async (productId) => {
    await removeFromCart(productId);
  };

  if (loading) {
    return (
      <div className="cart-page">
        <Header />
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
        <Footer />
      </div>
    );
  }

  const isEmpty = !cart.items || cart.items.length === 0;

  return (
    <div className="cart-page">
      <Header />
      
      <main className="cart-main">
        <div className="cart-container">
          {isEmpty ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
                  <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="#878787" strokeWidth="1.5"/>
                  <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="#878787" strokeWidth="1.5"/>
                  <path d="M1 1H5L7.68 14.39C7.77 14.83 8.02 15.22 8.38 15.49C8.74 15.76 9.19 15.9 9.64 15.88H19.36C19.81 15.9 20.26 15.76 20.62 15.49C20.98 15.22 21.23 14.83 21.32 14.39L23 6H6" stroke="#878787" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2>Your cart is empty!</h2>
              <p>Add items to it now.</p>
              <Link to="/products" className="btn btn-primary">Shop Now</Link>
            </div>
          ) : (
            <>
              <div className="cart-items-section">
                <div className="cart-header">
                  <button className="back-btn-inline" onClick={() => navigate(-1)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <h1>My Cart ({cart.items.length})</h1>
                </div>
                
                <div className="cart-items">
                  {cart.items.map((item) => (
                    <div key={item.product._id} className="cart-item">
                      <Link to={`/product/${item.product._id}`} className="item-image">
                        <img src={item.product.thumbnail} alt={item.product.name} />
                      </Link>
                      
                      <div className="item-details">
                        <Link to={`/product/${item.product._id}`} className="item-name">
                          {item.product.name}
                        </Link>
                        <p className="item-brand">{item.product.brand}</p>
                        
                        <div className="item-pricing">
                          <span className="selling-price">{formatPrice(item.product.sellingPrice)}</span>
                          {item.product.discount > 0 && (
                            <>
                              <span className="original-price">{formatPrice(item.product.price)}</span>
                              <span className="discount">{item.product.discount}% off</span>
                            </>
                          )}
                        </div>
                        
                        <div className="item-actions">
                          <div className="quantity-controls">
                            <button 
                              onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              −
                            </button>
                            <span className="quantity">{item.quantity}</span>
                            <button 
                              onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                            >
                              +
                            </button>
                          </div>
                          <button className="remove-btn" onClick={() => handleRemove(item.product._id)}>
                            REMOVE
                          </button>
                        </div>
                      </div>
                      
                      <div className="item-total">
                        {formatPrice(item.product.sellingPrice * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-footer">
                  <button className="place-order-btn" onClick={() => navigate('/checkout')}>
                    PLACE ORDER
                  </button>
                </div>
              </div>

              <div className="cart-summary-section">
                <h2>PRICE DETAILS</h2>
                
                <div className="summary-row">
                  <span>Price ({cart.summary.totalItems} items)</span>
                  <span>{formatPrice(cart.summary.subtotal + cart.summary.discount)}</span>
                </div>
                
                <div className="summary-row discount">
                  <span>Discount</span>
                  <span>− {formatPrice(cart.summary.discount)}</span>
                </div>
                
                <div className="summary-row">
                  <span>Delivery Charges</span>
                  <span className={cart.summary.shippingCharges === 0 ? 'free' : ''}>
                    {cart.summary.shippingCharges === 0 ? 'FREE' : formatPrice(cart.summary.shippingCharges)}
                  </span>
                </div>
                
                <div className="summary-total">
                  <span>Total Amount</span>
                  <span>{formatPrice(cart.summary.total)}</span>
                </div>
                
                {cart.summary.discount > 0 && (
                  <p className="savings-message">
                    You will save {formatPrice(cart.summary.discount)} on this order
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CartPage;
