import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { cartItemCount } = useCart();
  const debounceTimerRef = useRef(null);
  const isInitialMount = useRef(true);

  // Initialize search query from URL params
  const [searchQuery, setSearchQuery] = useState(() => {
    return searchParams.get('search') || '';
  });

  const isHomePage = location.pathname === '/';

  // Sync search query with URL when navigating
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    if (urlSearch !== searchQuery && !isInitialMount.current) {
      setSearchQuery(urlSearch);
    }
    isInitialMount.current = false;
  }, [searchParams]);

  // Debounced search function
  const performSearch = useCallback((query) => {
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    } else if (location.pathname === '/products') {
      // If search is cleared and we're on products page, show all products
      navigate('/products');
    }
  }, [navigate, location.pathname]);

  // Handle input change with debouncing
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer for debounced search (300ms delay)
    debounceTimerRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Handle form submit (for Enter key)
  const handleSearch = (e) => {
    e.preventDefault();
    // Clear any pending debounce and search immediately
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    performSearch(searchQuery);
  };

  return (
    <header className={`header ${isHomePage ? 'header-light' : 'header-blue'}`}>
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="header-logo">
          <div className="logo-text">Flipkart</div>
          <div className="logo-tagline">
            <span>Explore</span>
            <span className="plus">Plus</span>
            <img src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/plusFreeBadge-edd498.svg" alt="plus" className="plus-badge" />
          </div>
        </Link>

        {/* Search Bar */}
        <form className="search-bar" onSubmit={handleSearch}>
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
            <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search for Products, Brands and More"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </form>

        {/* Right Section */}
        <div className="header-right">
          {/* User */}
          <div className="header-item user-menu">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
              <path d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>Devansh</span>
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="dropdown-arrow">
              <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Cart */}
          <Link to="/cart" className="header-item cart-link">
            <div className="cart-icon-wrapper">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" fill="currentColor"/>
                <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" fill="currentColor"/>
                <path d="M1 1H5L7.68 14.39C7.77 14.83 8.02 15.22 8.38 15.49C8.74 15.76 9.19 15.9 9.64 15.88H19.36C19.81 15.9 20.26 15.76 20.62 15.49C20.98 15.22 21.23 14.83 21.32 14.39L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
            </div>
            <span>Cart</span>
          </Link>

          {/* Order History */}
          <Link to="/orders" className="header-item orders-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M7 9H17M7 13H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>Orders</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
