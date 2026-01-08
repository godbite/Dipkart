import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-container">
          <div className="footer-column">
            <h4>ABOUT</h4>
            <ul>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Flipkart Stories</a></li>
              <li><a href="#">Press</a></li>
              <li><a href="#">Corporate Information</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>GROUP COMPANIES</h4>
            <ul>
              <li><a href="#">Myntra</a></li>
              <li><a href="#">Cleartrip</a></li>
              <li><a href="#">Shopsy</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>HELP</h4>
            <ul>
              <li><a href="#">Payments</a></li>
              <li><a href="#">Shipping</a></li>
              <li><a href="#">Cancellation & Returns</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Report Infringement</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>CONSUMER POLICY</h4>
            <ul>
              <li><a href="#">Cancellation & Returns</a></li>
              <li><a href="#">Terms Of Use</a></li>
              <li><a href="#">Security</a></li>
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Sitemap</a></li>
              <li><a href="#">Grievance Redressal</a></li>
              <li><a href="#">EPR Compliance</a></li>
            </ul>
          </div>
          
          <div className="footer-column footer-right">
            <div className="footer-section">
              <h4>Mail Us:</h4>
              <p>Flipkart Internet Private Limited,<br/>
              Buildings Alyssa, Begonia &<br/>
              Clove Embassy Tech Village,<br/>
              Outer Ring Road, Devarabeesanahalli Village,<br/>
              Bengaluru, 560103,<br/>
              Karnataka, India</p>
            </div>
          </div>
          
          <div className="footer-column footer-right">
            <div className="footer-section">
              <h4>Registered Office Address:</h4>
              <p>Flipkart Internet Private Limited,<br/>
              Buildings Alyssa, Begonia &<br/>
              Clove Embassy Tech Village,<br/>
              Outer Ring Road, Devarabeesanahalli Village,<br/>
              Bengaluru, 560103,<br/>
              Karnataka, India<br/>
              CIN: U51109KA2012PTC066107<br/>
              Telephone: <a href="tel:044-45614700">044-45614700</a></p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-container footer-bottom-content">
          <div className="footer-links">
            <Link to="/">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="#878787" strokeWidth="1.5"/>
              </svg>
              <span>Become a Seller</span>
            </Link>
            <a href="#">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M17 6L10 12L3 6" stroke="#878787" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>Advertise</span>
            </a>
            <a href="#">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="3" y="4" width="14" height="12" rx="2" stroke="#878787" strokeWidth="1.5"/>
              </svg>
              <span>Gift Cards</span>
            </a>
            <a href="#">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="7" stroke="#878787" strokeWidth="1.5"/>
                <path d="M10 6V10L13 13" stroke="#878787" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>Help Center</span>
            </a>
          </div>
          <div className="footer-copyright">
            <span>© 2007-2026 Flipkart.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
