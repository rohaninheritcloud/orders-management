import React, { useState, useEffect } from 'react';
import logo from "../src/assets/logo.png";

const OrderForm = () => {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [trackingId, setTrackingId] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage,setSuccessMessage]=useState('')
  const [isTrackLoading,setisTrackLoading]=useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    const orderData = {
      product_id: productId,
      quantity: quantity,
      customer_name: customerName,
      contact_number: contactNumber
    };
    localStorage.setItem(contactNumber,contactNumber)

    try {
      const response = await fetch("https://azure-storage-icloud.us-e2.cloudhub.io/azure/uploadBlob", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        console.log(response)
        const data = await response.json();
        console.log('Order submitted successfully!', data);
        setOrderDetails(null);
        setContactNumber('')
        setCustomerName('')
        setProductId('')
        setQuantity(0)
        setSuccessMessage(`Order submitted successfully! Your tracking ID is: ${data.trackingId}`);
      } else {
        setErrorMessage(`Error submitting order`);
      }
    } catch (error) {
      setErrorMessage('Error submitting order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrackOrder = async (event) => {
    event.preventDefault();
    setisTrackLoading(true);
    setOrderDetails(null);
    console.log(contactNumber)
    const trackingData={
      fileName: trackingId,
      container: "icloudmulecontainer"
    }

    try {
      const response = await fetch("http://azure-storage-icloud.us-e2.cloudhub.io/azure/downloadBlob",{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trackingData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setOrderDetails(data);
        setisTrackLoading(false);
      } else {
        setErrorMessage(`Error retrieving order details`);
        setisTrackLoading(false);
        setTrackingId('');

      }
    } catch (error) {
      setErrorMessage('Error retrieving order details');
      setTrackingId('');

    } finally {
      setIsLoading(false);
      setTrackingId('');

    }
  };

  useEffect(() => {
    // Clear order details and tracking ID when the component unmounts
    return () => {
      setOrderDetails(null);
    };
  }, []);

  return (
    <div className="main-container">
      <img src={logo} alt="logo" height="14%" width="14%" />
      <div className="order-form-container">
        <div className='submit-form'>
        <h1>Submit Order</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="product-id">Product ID:</label>
          <input
            type="text"
            id="product-id"
            name="product_id"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
          />
          <br />
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            required
          />
          <br />
          <label htmlFor="customer-name">Customer Name:</label>
          <input
            type="text"
            id="customer-name"
            name="customer_name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
          <br />
          <label htmlFor="contact-number">Contact Number:</label>
          <input
            type="text"
            id="contact-number"
            name="contact_number"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            required
          />
          <br />

<button type="submit" disabled={isLoading}>
{isLoading ? 'Submitting...' : 'Submit Order'}
</button>
{successMessage && <p className="success-message">{successMessage}</p>}

</form>
</div>
<div className='track-container'>
<h2>Track Your Order Status</h2>
<form onSubmit={handleTrackOrder}>
<label htmlFor="tracking-id">Tracking ID:</label>
<input
type="text"
id="tracking-id"
name="tracking_id"
value={trackingId}
onChange={(e) => setTrackingId(e.target.value)}
required
/>
<br />
<button type="submit" disabled={isTrackLoading}>
{isTrackLoading ? 'Fetching Details...' : 'Track Order'}
</button>
{errorMessage && <p className="error-message">{errorMessage}</p>}

</form>
</div>


{orderDetails && (
<div className="order-details">
<h2>Order Details</h2>
<p><strong>Tracking ID:</strong> {orderDetails.trackingId}</p>
<p><strong>Product ID:</strong> {orderDetails.product_id}</p>
<p><strong>Quantity:</strong> {orderDetails.quantity}</p>
<p><strong>Customer Name:</strong> {orderDetails.customer_name}</p>
<p><strong>Status: </strong> Order Placed ✔</p>
{/* Add more order details properties as needed */}
</div>
)}
</div>
</div>
);
};

export default OrderForm;