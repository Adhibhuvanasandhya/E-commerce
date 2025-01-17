import React from 'react'
import "./Footer.css"
import footer_logo from "../Assets/Frontend_Assets/shoplogo.png" 
import instagram_icon from "../Assets/Frontend_Assets/instagram_icon.png"
import pintester_icon from "../Assets/Frontend_Assets/pintester_icon.png"
import whatsapp_icon from "../Assets/Frontend_Assets/whatsapp_icon.png"

function Footer() {
  return (
    <div className='footer'>
        <div className="footer-logo">
            <img src={footer_logo} alt="" />
            <p>LetShopsy</p>
        </div>
        <ul className='footer-links'>
            <li>Company</li>
            <li>Products</li>
            <li>Offcies</li>
            <li>About</li>
            <li>Contact</li>
        </ul>
        <div className="footer-social-icon">
            <div className="footer-icons-container">
                <img src={instagram_icon} alt="" />
            </div>
            <div className="footer-icons-container">
                <img src={whatsapp_icon} alt="" />
            </div>
            <div className="footer-icons-container">
                <img src={pintester_icon} alt="" />
            </div>

        </div>
        <div className="footer-copyright">
            <hr/>
            <p>Copyright @ 2025 - All Right Reversed.</p>
        </div>

    </div>
  )
}

export default Footer