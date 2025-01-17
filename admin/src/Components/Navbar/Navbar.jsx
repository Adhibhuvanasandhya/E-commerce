import React from 'react'
import './Navbar.css'
import logo from "../../assets/Admin_Assets/shoplogo.png"
import profile from "../../assets/Admin_Assets/profile.png"


const Navbar = () => {
  return (
    <div className='navbar'>
       <div className='nav_logo'>
            <img src={logo} alt=''></img>
            <p>LetShopsy</p>
        </div>
        <div className='nav_admin'>
        <img src={profile} alt="" />
          <p>Admin panel</p>
          

        </div>
    </div>
  )
}

export default Navbar