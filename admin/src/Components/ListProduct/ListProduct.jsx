import React, { useEffect, useState } from 'react'
import "./ListProduct.css"
import cross_icon from '../../assets/Admin_Assets/cross_icon.png'

const ListProduct = () => {

  const [allproducts,setAllproducts] = useState([])

  const fetchInfo = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/allproducts`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAllproducts(data.products); // Use the 'products' key from the API response
        } else {
          setAllproducts([]); // Set an empty array if the response is unsuccessful
        }
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setAllproducts([]); // Handle fetch errors
      });
  };
  
  useEffect(()=>{
    fetchInfo();
  },[])

  const remove_product = async(id)=>{
    await fetch(`${import.meta.env.VITE_API_URL}/removeproduct`,{
      method:"POST",
      headers:{
        Accept:'application/json',
        'Content-Type':'application/json',
      },
      body:JSON.stringify({id:id})
    })
   await fetchInfo();// Refresh product list
  }

  return (
    <div className='list-product'>
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Tittle</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((product,ind)=>{
          return<> <div key={ind} className='listproduct-format-main listproduct-format'>
            <img src={product.image} alt=""  className='listproduct-product-icon'/>
            <p>{product.name}</p>
            <p>₹{product.old_price}</p>
            <p>₹{product.new_price}</p>
            <p>{product.category}</p>
            <img onClick={()=>{remove_product(product.id)}} src={cross_icon} alt=""  className='listproduct-remove-icon'/>    
          </div>
          <hr />
          </>

        })}

      </div>
        
    </div>
  )
}

export default ListProduct