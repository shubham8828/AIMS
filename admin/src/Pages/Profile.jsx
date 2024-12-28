import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import ImageCompressor from 'image-compressor.js'; // For image compression
import Spinner from '../component/Spinner'; // Import your spinner component

const Profile = () => {
  const [formData, setFormData] = useState({}); // Store form data
  const navigate = useNavigate();
  const imageRef = useRef();
  const [loading, setLoading] = useState(true); // Initial loading state set to true
  const [updating, setUpdating] = useState(false); // State for form submission
  const location = useLocation();

  useEffect(() => {
    const email = location.state?.email;
    const fetchUserData = async () => {
      try {
        const res = await axios.post('http://localhost:4000/api/user', { email });
        setFormData(res.data.user);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        // navigate('/login'); // Redirect to login if error occurs
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    fetchUserData();
  }, [navigate, location.state]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files[0]) {
      new ImageCompressor(files[0], {
        quality: 0.6,
        success: (compressedResult) => {
          const fileReader = new FileReader();
          fileReader.onloadend = () => {
            setFormData({ ...formData, image: fileReader.result }); // Update image with the compressed one
          };
          fileReader.readAsDataURL(compressedResult);
        },
        error(e) {
          console.error(e.message);
        },
      });
    } else {
      const keys = name.split('.'); // Handle nested keys
      if (keys.length > 1) {
        setFormData({
          ...formData,
          [keys[0]]: { ...formData[keys[0]], [keys[1]]: value },
        });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true); // Start the updating spinner
    try {
      const res = await axios.put('http://localhost:4000/api/update', formData);
      localStorage.setItem('email', res.data.user.email);
      localStorage.setItem('image', res.data.user.image);
      // toast.success('Profile updated successfully', { position: 'top-center' });
    } catch (error) {
      console.error('Failed to update profile:', error);
      // toast.error('Failed to update profile', { position: 'top-center' });
    } finally {
      setUpdating(false); // Stop the updating spinner
    }
  };

  const triggerImageUpload = () => {
    imageRef.current.click(); // Trigger image file input click
  };

  if (loading || updating ) {
    return <Spinner />; // Show spinner while loading data
  }

  return (
    <div className='profile-container'>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>User Profile</h2>
      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="image" className="image-label" style={{ textAlign: 'center', marginBottom: '20px' }}>Profile Image</label>
          <div onClick={triggerImageUpload} className="profile-image">
            <img src={formData.image} alt="Profile" className="profile-pic" />
          </div>
          <input
            type="file"
            name="image"
            id="image"
            accept="image/*"
            onChange={handleChange}
            ref={imageRef}
            style={{ display: 'none' }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name || ''}
            onChange={handleChange}
            required
            minLength={3}
            maxLength={50}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email || ''}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            name="phone"
            id="phone"
            value={formData.phone || ''}
            onChange={(e) => {
              const input = e.target.value;
              if (/^\d{0,10}$/.test(input)) {
                handleChange(e);
              }
            }}
            maxLength="10"
            required
            placeholder="Enter 10-digit phone number"
          />
        </div>

        <div className="form-group">
          <label htmlFor="address.localArea">Local Area</label>
          <input
            type="text"
            name="address.localArea"
            id="address.localArea"
            value={formData.address?.localArea || ''}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address.city">City</label>
          <input
            type="text"
            name="address.city"
            id="address.city"
            value={formData.address?.city || ''}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address.state">State</label>
          <input
            type="text"
            name="address.state"
            id="address.state"
            value={formData.address?.state || ''}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address.country">Country</label>
          <input
            type="text"
            name="address.country"
            id="address.country"
            value={formData.address?.country || ''}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address.pin">PIN Code</label>
          <input
            type="text"
            name="address.pin"
            id="address.pin"
            value={formData.address?.pin || ''}
            onChange={(e) => {
              const input = e.target.value;
              if (/^\d{0,6}$/.test(input)) {
                handleChange(e);
              }
            }}
            maxLength="6"
            required
          />
        </div>

        <button type="submit" className="submit-btn" disabled={updating}> Update User </button>
      </form>
    </div>
  );
};

export default Profile;
