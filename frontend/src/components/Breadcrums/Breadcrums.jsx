import React from 'react'
import "./Breadcrums.css"
import arrow_icon from "../Assets/Frontend_Assets/breadcrum_arrow.png"

const Breadcrums = (props) => {
  const { product } = props;

  // Provide a fallback to avoid errors
  const category = product?.category || "Unknown Category";
  const name = product?.name || "Unknown Product";

  return (
      <div className='breadcrum'>
          HOME<img src={arrow_icon} alt=""/>SHOP<img src={arrow_icon} alt=""/>{category}<img src={arrow_icon} alt=""/>{name}
      </div>
  );
}


export default Breadcrums