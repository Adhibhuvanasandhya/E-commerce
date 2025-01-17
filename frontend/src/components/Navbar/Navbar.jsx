import React, { useContext, useRef, useState } from 'react';
import './Navbar.css';
import logo from '../Assets/Frontend_Assets/shoplogo.png';
import cart_icon from '../Assets/Frontend_Assets/cart_icon.png';
import { Link } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';
import nav_dropdown from '../Assets/Frontend_Assets/nav_dropdown.png';

const Navbar = () => {
  const [menu, setMenu] = useState('');
  const { getTotalcartItems } = useContext(ShopContext);
  const menuRef = useRef();

  const dropdown_toggle = () => {
    menuRef.current.classList.toggle('nav-menu-visible');
  };

  const handleMenuClick = (menuName) => {
    setMenu(menuName);
    menuRef.current.classList.remove('nav-menu-visible'); // Close the menu after clicking a link
  };

  return (
    <div className="navbar">
      <div className="nav_logo">
        <img src={logo} alt="Logo" />
        <p>LetShopsy</p>
      </div>
      <img
        className="nav-dropdown"
        onClick={dropdown_toggle}
        src={nav_dropdown}
        alt="Dropdown"
      />
      <ul ref={menuRef} className="nav-menu">
        <li>
          <Link
            to="/"
            style={{ textDecoration: 'none' }}
            onClick={() => handleMenuClick('shop')}
          >
            Shop
          </Link>
          {menu === 'shop' && <hr />}
        </li>
        <li>
          <Link
            to="/mens"
            style={{ textDecoration: 'none' }}
            onClick={() => handleMenuClick('mens')}
          >
            Men
          </Link>
          {menu === 'mens' && <hr />}
        </li>
        <li>
          <Link
            to="/womens"
            style={{ textDecoration: 'none' }}
            onClick={() => handleMenuClick('womens')}
          >
            Women
          </Link>
          {menu === 'womens' && <hr />}
        </li>
        <li>
          <Link
            to="/kids"
            style={{ textDecoration: 'none' }}
            onClick={() => handleMenuClick('kids')}
          >
            Kids
          </Link>
          {menu === 'kids' && <hr />}
        </li>
      </ul>
      <div className="nav-login-cart">
        {localStorage.getItem('auth-token') ? (
          <button
            onClick={() => {
              localStorage.removeItem('auth-token');
              window.location.replace('/');
            }}
          >
            Logout
          </button>
        ) : (
          <Link to="/login">
            <button>Login</button>
          </Link>
        )}

        <Link to="/cart">
          <img src={cart_icon} alt="Cart" />
        </Link>

        <div className="nav-cart-count">{getTotalcartItems()}</div>
      </div>
    </div>
  );
};

export default Navbar;
