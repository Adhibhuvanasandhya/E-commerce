import React from 'react'
import './Admin.css'
import Sidebar from '../../Components/Sidebar/Sidebar'
import { Route, Routes } from 'react-router-dom'
import AddProduct from '../../Components/AddProduct/AddProduct'
import ProductList from '../../Components/ProductList/ProductList'


const Admin = () => {
  return (
    <div className='admin'>
      <Sidebar/>
      <Routes>
        <Route path='/addproduct' element={<AddProduct/>}></Route>
        <Route path='/listproduct' element={<ProductList/>}></Route>
      </Routes>
      
        
    </div>
  )
}

export default Admin