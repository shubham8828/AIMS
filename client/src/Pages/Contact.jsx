import React, { useState } from 'react';
import Team from '../Component/Team';
import axios from 'axios';
import toast from 'react-hot-toast';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if all fields have more than just whitespace
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      toast.error('Fields cannot be empty or contain only spaces.', { position: "top-center" });
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/message', formData);
      console.log(response);
      toast.success(response.data.message, { position: "top-center" });
      
      // Clear the form after successful submission
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error('There was an error submitting the form.', { position: "top-center" });
      console.error('Error:', error);
    }
  };

  return (
    <>
      <div className="contact-form">
        <h2>Contact Us</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              minLength={2}
              maxLength={50}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              minLength={10}
              maxLength={50}
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              minLength={10}
              maxLength={500}
            ></textarea>
          </div>
          <button type="submit" className="button">Send</button>
        </form>
      </div>
      <Team />
    </>
  );
}

export default Contact;
