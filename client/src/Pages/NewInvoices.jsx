import React, { useState } from "react";
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import Search from "../Component/Search.jsx";
import Spinner from "../Component/Spinner.jsx";

const NewInvoices = () => {
  const [to, setTo] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [productList, setProductList] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading,setLoading]=useState(false)
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const addProduct = () => {
    // Validate if all product details are correctly filled
    if (!name || !price || !quantity || price <= 0 || quantity <= 0) {
      toast.error("Please fill out the product details correctly.", { position: "top-center" });
      return;
    }

    const totalPrice = price * quantity;
    const newProduct = { id: productList.length + 1, name, price, quantity, totalPrice };
    const updatedProductList = [...productList, newProduct];

    setProductList(updatedProductList);

    // Update total
    const newTotal = updatedProductList.reduce((acc, item) => acc + item.totalPrice, 0);
    setTotal(newTotal);

    // Clear the input fields
    setName("");
    setPrice("");
    setQuantity(1);
  };

  const handleSaveData = async () => {
    // Validate required fields
    if (!to || !phone || !address) {
      toast.error("Please fill out all required fields", { position: "top-center" });
      return;
    }

    // Validate phone number (10 digits)
    if (!/^\d{10}$/.test(phone)) {
      toast.error("Please enter a valid phone number with exactly 10 digits.", { position: "top-center" });
      return;
    }

    // Check if at least one product is added
    if (productList.length === 0) {
      toast.error("Please add at least one product to the invoice.", { position: "top-center" });
      return;
    }

    const formData = {
      to,
      phone,
      address,
      products: productList,
      total,
      email // Add email to the form data
    };

    try {
      setLoading(true)
      const response = await axios.post('http://localhost:4000/api/create', formData);
      toast.success(response.data.msg, { position: 'top-center' });
      console.log(response.data);
      // Clear the form after successful submission
      setTo("");
      setPhone("");
      setAddress("");
      setProductList([]);
      setTotal(0);
      setName("");
      setPrice("");
      setQuantity(1);
      setLoading(false)
      navigate("/payments", { state: response.data.invoice  });
    } catch (error) {
      setLoading(false)
      toast.error("There was an error saving the invoice.", { position: "top-center" });
    }
  };

  // Handler to update customer details from search results
  const handleSelectCustomer = (customer) => {
    setTo(customer.to);
    setPhone(customer.phone);
    setAddress(customer.address);
  };
  if(loading){
    return <Spinner/>
  }

  return (
    <>
      <Search onSelectCustomer={handleSelectCustomer} />

      <div className="new-invoice-container">
        <div className="header-row">
          <p className="new-invoice-heading">New Invoice</p>
          <button type="button" onClick={handleSaveData} className="add-btn">
            Save Data
          </button>
        </div>
    
        <form className="new-invoice-form">
          <div className="first-row">
            <input
              placeholder="To"
              onChange={(e) => setTo(e.target.value)}
              value={to}
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              onChange={(e) => {
                const inputValue = e.target.value;
                if (/^\d{0,10}$/.test(inputValue)) {
                  setPhone(inputValue); // Update state with valid input
                }
              }}
              value={phone}
              required
              maxLength={10}
              pattern="\d{10}"
              title="Please enter a valid 10-digit phone number"
            />
            <input
              placeholder="Address"
              onChange={(e) => setAddress(e.target.value)}
              value={address}
              required
            />
          </div>
    
          <div className="first-row">
            <input
              placeholder="Product Name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
            <input
              placeholder="Price"
              type="number"
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              value={price}
              required
              min="0"
            />
            <input
              type="number"
              placeholder="Quantity"
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              value={quantity}
              required
              min="1"
            />
          </div>
    
          <button type="button" onClick={addProduct} className="add-btn">
            Add Product
          </button>
        </form>
    
        {productList.length > 0 && (
          <div className="product-wrapper">
            <div className="product-list">
              <p>Sr No.</p>
              <p>Product Name</p>
              <p>Price</p>
              <p>Quantity</p>
              <p>Total Price</p>
            </div>
    
            {productList.map((product, index) => (
              <div key={index} className="product-list">
                <p>{index + 1}</p>
                <p>{product.name}</p>
                <p>{product.price}</p>
                <p>{product.quantity}</p>
                <p>{product.totalPrice}</p>
              </div>
            ))}
    
            <div className="total-wrapper">
              <p>Total: Rs. {total}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default NewInvoices;
