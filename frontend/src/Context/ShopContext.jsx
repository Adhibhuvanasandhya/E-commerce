import React, { createContext, useEffect, useState } from "react";



export const ShopContext = createContext(null)
const getDefaultCart = ()=>{
    let cart ={};
    for (let index = 0; index < 300+1; index++) {
        cart[index]=0;  
    }
    return cart;
}


const ShopContextProvider = (props)=>{

    const [all_product, setAll_Product]= useState([]);


    const [cartItems, setCartItems] = useState(getDefaultCart())

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/allproducts`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (data.success) {
                    setAll_Product(data.products); // Set products array
                } else {
                    console.error('Failed to fetch products:', data.message);
                }
            })
            .catch((error) => console.error('Error fetching products:', error));

            if (localStorage.getItem('auth-token')) {
                fetch(`${process.env.REACT_APP_API_URL}/getcart`, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'auth-token': `${localStorage.getItem('auth-token')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({}) // Pass an empty JSON body
                })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => setCartItems(data))
                .catch((error) => console.error('Error fetching cart data:', error.message));
            }
            
            
    }, []);
    
    

    const addToCart =(itemid)=>{
        setCartItems((prev)=>({...prev,[itemid]:prev[itemid]+1}))
        if(localStorage.getItem('auth-token')){
            fetch(`${process.env.REACT_APP_API_URL}/addtocart`,{
                method:'POST',
                headers:{
                    Accept:'application/form_data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({"itemid":itemid})
            })
            .then((response)=>response.json())
            .then((data)=>console.log(data));
        }
    }

    const removeFromCart =(itemid)=>{
        setCartItems((prev)=>({...prev,[itemid]:prev[itemid]-1}))
        if(localStorage.getItem('auth-token')){
            fetch(`${process.env.REACT_APP_API_URL}/removefromcart`,{
                method:'POST',
                headers:{
                    Accept:'application/form_data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({"itemid":itemid})
            })
            .then((response)=>response.json())
            .then((data)=>console.log(data));

        }
    }

    const getTotalCartAmount =() =>{
        let totalAmount = 0;
        for(const item in cartItems){
            if(cartItems[item]>0)
            {
                let itemInfo = all_product.find((product)=>product.id===Number (item))
                totalAmount += itemInfo.new_price * cartItems[item];
            }
            
        }
        return totalAmount;
    }

    const getTotalcartItems = ()=>{
        let totalItem = 0;
        for(const item in cartItems)
        {
            if(cartItems[item]>0)
            {
                totalItem+=cartItems[item];
            }
        }
        return totalItem
    }

    const contextValue ={getTotalcartItems,getTotalCartAmount,all_product,cartItems,addToCart,removeFromCart};
    
    return(
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )

}
export default ShopContextProvider;