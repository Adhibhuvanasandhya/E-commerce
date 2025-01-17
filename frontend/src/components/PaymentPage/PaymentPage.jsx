import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentPage.css';
import googlePlayQr from '../Assets/Frontend_Assets/gpay upi.jpeg';
import upiQr from '../Assets/Frontend_Assets/upi.jpeg';

const PaymentPage = () => {
  const navigate = useNavigate();
  const [shipmentDetails, setShipmentDetails] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      alert('You must be logged in to access the payment page.');
      navigate('/login'); // Redirect to the login page if not logged in
    }
  }, [navigate]);

  // Handle shipment details form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShipmentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Submit payment (for demo purposes, we just log the shipment details)
  const handlePayment = () => {
    console.log('Shipment Details:', shipmentDetails);
    alert('Payment successfully initiated! Thank you for your order.');
  };

  return (
    <div className="payment-page">
      <h1>Payment Page</h1>
      <p>Please complete your payment using one of the available methods (Google Pay or UPI).</p>

      <div className="shipment-details">
        <h2>Shipment Details</h2>
        <form className="shipment-form">
          <input
            type="text"
            name="fullName"
            value={shipmentDetails.fullName}
            onChange={handleInputChange}
            placeholder="Full Name"
            required
          />
          <input
            type="text"
            name="address"
            value={shipmentDetails.address}
            onChange={handleInputChange}
            placeholder="Address"
            required
          />
          <input
            type="text"
            name="city"
            value={shipmentDetails.city}
            onChange={handleInputChange}
            placeholder="City"
            required
          />
          <input
            type="text"
            name="state"
            value={shipmentDetails.state}
            onChange={handleInputChange}
            placeholder="State"
            required
          />
          <input
            type="text"
            name="zipCode"
            value={shipmentDetails.zipCode}
            onChange={handleInputChange}
            placeholder="Zip Code"
            required
          />
          <input
            type="text"
            name="country"
            value={shipmentDetails.country}
            onChange={handleInputChange}
            placeholder="Country"
            required
          />
        </form>
      </div>

      <div className="payment-option">
        <h3>Pay via Google Pay</h3>
        <p>Scan the QR code below to pay via Google Pay:</p>
        <img src={googlePlayQr} alt="Google Pay QR" className="payment-qr" />
      </div>

      <div className="payment-option">
        <h3>Pay via UPI</h3>
        <p>Scan the QR code below to pay via any UPI app:</p>
        <img src={upiQr} alt="UPI QR" className="payment-qr" />
        <p>UPI ID: sandhya2000</p>
      </div>

      <button onClick={handlePayment} className="payment-button">
        Complete Payment
      </button>
    </div>
  );
};

export default PaymentPage;
