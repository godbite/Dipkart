import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { getOrder } from '../services/api';
import './OrderConfirmationPage.css';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await getOrder(orderId);
        if (response.success) {
          setOrder(response.data);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="order-confirmation-page">
        <Header />
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="order-confirmation-page">
      <Header />
      
      <main className="confirmation-main">
        <div className="confirmation-container">
          <div className="success-icon">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="38" stroke="#26a541" strokeWidth="4"/>
              <path d="M24 40L36 52L56 28" stroke="#26a541" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <h1>Order Placed Successfully!</h1>
          <p className="order-id">Order ID: <strong>{orderId}</strong></p>

          {order && (
            <>
              <div className="order-details">
                <div className="detail-row">
                  <span>Order Date</span>
                  <span>{formatDate(order.orderedAt)}</span>
                </div>
                <div className="detail-row">
                  <span>Total Amount</span>
                  <span className="amount">{formatPrice(order.totalAmount)}</span>
                </div>
                <div className="detail-row">
                  <span>Payment Method</span>
                  <span>{order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod}</span>
                </div>
                <div className="detail-row">
                  <span>Expected Delivery</span>
                  <span>{formatDate(order.deliveryDate)}</span>
                </div>
              </div>

              <div className="shipping-address">
                <h3>Delivery Address</h3>
                <p>
                  <strong>{order.shippingAddress.fullName}</strong><br />
                  {order.shippingAddress.addressLine1}<br />
                  {order.shippingAddress.addressLine2 && <>{order.shippingAddress.addressLine2}<br /></>}
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
                  Phone: {order.shippingAddress.phone}
                </p>
              </div>

              <div className="order-items">
                <h3>Order Items</h3>
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <img src={item.thumbnail} alt={item.name} />
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      <p>Qty: {item.quantity} × {formatPrice(item.price)}</p>
                    </div>
                    <span className="item-total">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="action-buttons">
            <Link to="/orders" className="btn-orders">View Orders</Link>
            <Link to="/" className="btn-continue">Continue Shopping</Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderConfirmationPage;
