import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { useToast } from '../components/common/Toast';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: ''
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const required = ['fullName', 'phone', 'addressLine1', 'city', 'state', 'pincode'];
    for (const field of required) {
      if (!address[field].trim()) {
        setError(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    if (!/^\d{10}$/.test(address.phone)) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }
    if (!/^\d{6}$/.test(address.pincode)) {
      setError('Please enter a valid 6-digit pincode');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await createOrder({
        shippingAddress: address,
        paymentMethod: 'COD'
      });
      
      if (response.success) {
        // Clear cart in frontend state (backend already clears it)
        await clearCart();
        // Show success toast
        showToast('🎉 Order placed successfully!', 'success');
        navigate(`/order-confirmation/${response.data.orderId}`);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order. Please try again.');
      showToast('Failed to place order', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-page">
      <Header />
      
      <main className="checkout-main">
        <div className="checkout-container">
          <div className="checkout-left">
            {/* Delivery Address */}
            <div className="checkout-section">
              <div className="section-header">
                <span className="step-number">1</span>
                <h2>DELIVERY ADDRESS</h2>
              </div>
              
              <div className="address-form">
                <div className="form-row">
                  <div className="form-group">
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name *"
                      value={address.fullName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number *"
                      value={address.phone}
                      onChange={handleInputChange}
                      maxLength={10}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <input
                    type="text"
                    name="addressLine1"
                    placeholder="Address Line 1 *"
                    value={address.addressLine1}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <input
                    type="text"
                    name="addressLine2"
                    placeholder="Address Line 2 (Optional)"
                    value={address.addressLine2}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <input
                      type="text"
                      name="city"
                      placeholder="City *"
                      value={address.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name="state"
                      placeholder="State *"
                      value={address.state}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name="pincode"
                      placeholder="Pincode *"
                      value={address.pincode}
                      onChange={handleInputChange}
                      maxLength={6}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="checkout-section">
              <div className="section-header">
                <span className="step-number">2</span>
                <h2>ORDER SUMMARY</h2>
              </div>
              
              <div className="order-items">
                {cart.items.map((item) => (
                  <div key={item.product._id} className="order-item">
                    <img src={item.product.thumbnail} alt={item.product.name} />
                    <div className="order-item-info">
                      <h3>{item.product.name}</h3>
                      <p className="item-qty">Qty: {item.quantity}</p>
                      <p className="item-price">{formatPrice(item.product.sellingPrice * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment */}
            <div className="checkout-section">
              <div className="section-header">
                <span className="step-number">3</span>
                <h2>PAYMENT METHOD</h2>
              </div>
              
              <div className="payment-options">
                <label className="payment-option selected">
                  <input type="radio" name="payment" value="COD" defaultChecked />
                  <span className="radio-custom"></span>
                  <span>Cash on Delivery</span>
                </label>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button 
              className="confirm-order-btn"
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? 'Placing Order...' : 'CONFIRM ORDER'}
            </button>
          </div>

          {/* Price Summary */}
          <div className="checkout-right">
            <div className="price-summary">
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
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CheckoutPage;
