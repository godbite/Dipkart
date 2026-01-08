import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../../services/api';
import './CategoryNav.css';

const CategoryNav = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        if (response.success) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <nav className="category-nav">
        <div className="category-nav-container">
          <div className="category-loading">Loading categories...</div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="category-nav">
      <div className="category-nav-container">
        {categories.map((category) => (
          <Link 
            key={category._id} 
            to={`/products?category=${category.slug}`}
            className="category-item"
          >
            <div className="category-image">
              <img src={category.image} alt={category.name} />
            </div>
            <span className="category-name">{category.name}</span>
            {category.name === 'Fashion' || category.name === 'Electronics' || category.name === 'Home & Furniture' ? (
              <svg className="dropdown-icon" width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path d="M1 1L5 5L9 1" stroke="#212121" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            ) : null}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default CategoryNav;
