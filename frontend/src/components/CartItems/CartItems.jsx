import React, { useContext } from 'react';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext';
import remove_icon from '../Assets/Frontend_Assets/cart_cross_icon.png';
import { useNavigate } from 'react-router-dom';

const CartItems = () => {
  const { getTotalCartAmount, all_product, cartItems, removeFromCart } = useContext(ShopContext);
  const navigate = useNavigate();

  // Function to handle "Proceed to Checkout"
  const handleProceedToCheckout = () => {
    // Check if there is at least one item in the cart (items should have quantity greater than 0)
    const isCartNotEmpty = Object.values(cartItems).some((qty) => qty > 0);

    // If cart is empty, show alert. If not, navigate to payment page
    if (!isCartNotEmpty) {
      alert("Your cart is empty. Add items to proceed.");
    } else {
      navigate('/payment');  // Navigate to the payment page
    }
  };

  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />

      {all_product.map((e) => {
        if (cartItems[e.id] > 0) {
          return (
            <div key={e.id}>
              <div className="cartitems-format cartitems-format-main">
                <img src={e.image} alt="" className="carticon-product-icon" />
                <p>{e.name}</p>
                <p>₹{e.new_price}</p>
                <button className="cartitems-quantity">{cartItems[e.id]}</button>
                <p>₹{e.new_price * cartItems[e.id]}</p>
                <img
                  className="cartitems-remove-icon"
                  src={remove_icon}
                  alt=""
                  onClick={() => { removeFromCart(e.id); }}
                />
              </div>
              <hr />
            </div>
          );
        }
        return null;
      })}

      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Total</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>₹{getTotalCartAmount()}</h3>
            </div>
          </div>
          {/* Proceed to Pay Button */}
          <button onClick={handleProceedToCheckout} disabled={Object.values(cartItems).every(qty => qty === 0)}>
            Proceed to Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
