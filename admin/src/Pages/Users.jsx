import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; // Import icons for Edit and Delete
import { useNavigate } from 'react-router-dom';
import Spinner from '../component/Spinner';

const Users = () => {
  const [users, setUsers] = useState([]); // State to store users data
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [loading, setLoading] = useState(true); // State to track loading status
  const navigate = useNavigate();

  // Fetch users from the API on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true); // Start loading
        const response = await axios.get('http://localhost:4000/api/users');
        setUsers(response.data.users); // Assuming the response has users in `data.users`
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchUsers();
  }, []); // Empty dependency array means this runs only once when the component mounts

  // Handle edit action
  const handleEdit = (email) => {
    navigate('/profile', { state: { email } }); // Pass the email as state
  };

  // Handle delete action
  const handleDelete = async (userId) => {
    try {
      setLoading(true); // Start loading
      await axios.delete(`http://localhost:4000/api/deleteuser/${userId}`);
      setUsers(users.filter((user) => user._id !== userId)); // Remove the deleted user from state
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase().trim();
    return (
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.address?.city?.toLowerCase().includes(query) ||
      user.address?.state?.toLowerCase().includes(query) ||
      user.address?.country?.toLowerCase().includes(query) ||
      user.address?.localArea?.toLowerCase().includes(query) ||
      user.address?.pin?.toString().includes(query) ||
      (users.indexOf(user) + 1).toString().includes(query) // Match Sr No.
    );
  });

  // Show spinner if loading
  if (loading) {
    return <Spinner />;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '20px' }}>Users</h2>

      {/* Search Bar */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by Name, Email, City, State, etc."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '80%',
            padding: '10px',
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '5px',
          }}
        />
      </div>

      {/* Users Table */}
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            background: 'white',
            textAlign: 'left',
            marginBottom: '20px',
          }}
        >
          <thead>
            <tr style={{ background: '#f4f4f4' }}>
              <th style={styles.th}>Sr No.</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>City</th>
              <th style={styles.th}>State</th>
              <th style={styles.th}>Country</th>
              <th style={styles.th}>Local Area</th>
              <th style={styles.th}>Pin</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user._id}>
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}>{user.name}</td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>{user.address?.city || 'N/A'}</td>
                <td style={styles.td}>{user.address?.state || 'N/A'}</td>
                <td style={styles.td}>{user.address?.country || 'N/A'}</td>
                <td style={styles.td}>{user.address?.localArea || 'N/A'}</td>
                <td style={styles.td}>{user.address?.pin || 'N/A'}</td>
                <td style={styles.td}>
                  <button
                    onClick={() => handleEdit(user.email)}
                    style={{ ...styles.button, background: '#4CAF50' }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    style={{ ...styles.button, background: '#f44336', marginLeft: '10px' }}
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Inline styles for table and buttons
const styles = {
  th: {
    padding: '10px',
    border: '1px solid #ddd',
  },
  td: {
    padding: '10px',
    border: '1px solid #ddd',
  },
  button: {
    padding: '5px 10px',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
  },
};

export default Users;
