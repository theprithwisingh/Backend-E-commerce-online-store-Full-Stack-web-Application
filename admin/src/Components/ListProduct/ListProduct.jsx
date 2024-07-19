import React, { useState } from 'react'
import './ListProduct.css'
const ListProduct = () => {
    const [allproducts,setAllproducts]=useState([])
  return (
    <div className='list-product'>
       <h1>All Products List</h1>
       <div className="listproducts-format-main">
         <p>Products</p>
         <p>Titles</p>
         <p>Old Price</p>
         <p>New Price</p>
         <p>Category</p>
         <p>Remove</p>
       </div>
       <div className="listproduct-allproduct">
         
       </div>
    </div>
  )
}

export default ListProduct;
