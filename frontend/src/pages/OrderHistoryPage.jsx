import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { getOrders } from '../services/api';
import './OrderHistoryPage.css';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrders();
        if (response.success) {
          setOrders(response.data.orders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDeliveryDate = (orderDate, status) => {
    const ordered = new Date(orderDate);
    const deliveryDate = new Date(ordered);
    deliveryDate.setDate(deliveryDate.getDate() + (status === 'delivered' ? 5 : 7));
    
    return deliveryDate.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusInfo = (status, orderDate) => {
    const deliveryDate = formatDeliveryDate(orderDate, status);
    
    switch (status) {
      case 'delivered':
        return {
          icon: '●',
          color: '#26a541',
          text: `Delivered on ${deliveryDate}`,
          subtext: 'Your item has been delivered'
        };
      case 'shipped':
        return {
          icon: '●',
          color: '#ff9f00',
          text: `Expected by ${deliveryDate}`,
          subtext: 'Your item is on the way'
        };
      case 'confirmed':
        return {
          icon: '●',
          color: '#2874f0',
          text: `Expected by ${deliveryDate}`,
          subtext: 'Your order has been confirmed'
        };
      case 'cancelled':
        return {
          icon: '●',
          color: '#ff6161',
          text: 'Order Cancelled',
          subtext: 'Your order has been cancelled'
        };
      default:
        return {
          icon: '●',
          color: '#878787',
          text: `Expected by ${deliveryDate}`,
          subtext: 'Order is being processed'
        };
    }
  };

  // Filter orders based on search
  const filteredOrders = orders.filter(order => {
    return searchQuery === '' || 
      order.items.some(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return (
      <div className="order-history-page">
        <Header />
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="order-history-page">
      <Header />
      
      <main className="orders-main">
        <div className="orders-container">
          {/* Search Bar */}
          <div className="orders-search-bar">
            <input
              type="text"
              placeholder="Search your orders here"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
                <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Search Orders
            </button>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="no-orders">
              <svg width="100" height="100" viewBox="0 0 24 24" fill="none">
                <path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21" stroke="#878787" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h2>No orders found</h2>
              <p>{searchQuery ? 'Try different search terms' : 'Start shopping to see your orders here!'}</p>
              <Link to="/products" className="btn btn-primary">Shop Now</Link>
            </div>
          ) : (
            <div className="orders-list">
              {filteredOrders.map((order) => (
                order.items.map((item, index) => {
                  const statusInfo = getStatusInfo(order.status, order.orderedAt);
                  return (
                    <div key={`${order._id}-${index}`} className="order-item-row">
                      <Link to={`/product/${item.product || item._id}`} className="order-item-image">
                        <img src={item.thumbnail} alt={item.name} />
                      </Link>
                      
                      <div className="order-item-details">
                        <h3>{item.name}</h3>
                        <p className="item-variant">Qty: {item.quantity}</p>
                      </div>
                      
                      <div className="order-item-price">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                      
                      <div className="order-item-status">
                        <div className="status-header" style={{ color: statusInfo.color }}>
                          <span className="status-dot" style={{ color: statusInfo.color }}>{statusInfo.icon}</span>
                          {statusInfo.text}
                        </div>
                        <p className="status-subtext">{statusInfo.subtext}</p>
                        {order.status === 'delivered' && (
                          <Link to={`/product/${item.product || item._id}`} className="rate-review-link">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                            </svg>
                            Rate & Review Product
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderHistoryPage;
