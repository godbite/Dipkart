import Header from '../components/common/Header';
import CategoryNav from '../components/common/CategoryNav';
import Footer from '../components/common/Footer';
import HeroCarousel from '../components/home/HeroCarousel';
import DealsSection from '../components/home/DealsSection';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <Header />
      <CategoryNav />
      
      <main className="home-main">
        <HeroCarousel />
        
        <div className="home-content">
          <DealsSection title="Top Deals" sortBy="discount" />
          
          {/* Grid layout sections - 3 columns */}
          <div className="deals-grid-row">
            <DealsSection title="Best of Electronics" category="electronics" layout="grid" />
            <DealsSection title="Fashion Trends" category="fashion" layout="grid" />
            <DealsSection title="Beauty & Personal Care" category="beauty" layout="grid" />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;
