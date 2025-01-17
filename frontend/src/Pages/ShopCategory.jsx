import React, { useContext,useState } from 'react'
import "./CSS/ShopCategory.css"
import { ShopContext } from '../Context/ShopContext'
import dropdown_icon from "../components/Assets/Frontend_Assets/dropdown_icon.png"
import Item from '../components/Items/Item'

const ShopCategory = (props) => {

  const {all_product} = useContext(ShopContext)
  // State for storing selected price range
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');

  // Function to handle price range selection
  const handlePriceRangeChange = (range) => {
    setSelectedPriceRange(range);
  };

    // Filter products based on selected price range
    const filteredProducts = all_product.filter((item) => {
      if (props.category !== item.category) return false;
  
      switch (selectedPriceRange) {
        case 'Under ₹50':
          return item.new_price < 50;
        case '₹50 - ₹100':
          return item.new_price >= 50 && item.new_price <= 100;
        case '₹100 - ₹200':
          return item.new_price > 100 && item.new_price <= 200;
        case 'Above ₹200':
          return item.new_price > 200;
        default:
          return true;
      }
    });
    return (
      <div className='shop-category'>
        <img className='shopcategory-banner' src={props.banner} alt="" />
        <div className="shopcategory-indexsort">
          <p>
            <span>Showing {filteredProducts.length}</span> out of {all_product.length} products
          </p>
          <div className="shopcategory-sort">
            Sort by 
            <img src={dropdown_icon} alt="" />
            <div className="price-range-dropdown">
              <ul>
                <li onClick={() => handlePriceRangeChange('All')}>All</li>
                <li onClick={() => handlePriceRangeChange('Under ₹50')}>Under ₹50</li>
                <li onClick={() => handlePriceRangeChange('₹50 - ₹100')}>₹50 - ₹100</li>
                <li onClick={() => handlePriceRangeChange('₹100 - ₹200')}>₹100 - ₹200</li>
                <li onClick={() => handlePriceRangeChange('Above ₹200')}>Above ₹200</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="shopcategory-products">
          {filteredProducts.map((item, i) => (
            <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
          ))}
        </div>
        <div className="shopcategory-loadmore">
          Explore More
        </div>
      </div>
    );
}

export default ShopCategory