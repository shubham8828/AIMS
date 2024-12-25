import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; // Import icons for Edit and Delete

const Users = () => {
  const [users, setUsers] = useState([]); // State to store users data

  // Fetch users from the API on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/users');
        setUsers(response.data.users); // Assuming the response has users in `data.users`
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []); // Empty dependency array means this runs only once when the component mounts

  // Handle edit action (you can implement your own logic here)
  const handleEdit = (userId) => {
    console.log('Edit user:', userId);
    // Your edit logic goes here (e.g., open a modal, redirect to edit page)
  };

  // Handle delete action
  const handleDelete = (userId) => {
    console.log('Delete user:', userId);
    // You can make an API request to delete the user from the server
    axios.delete(`http://localhost:4001/users/${userId}`).then(() => {
      setUsers(users.filter((user) => user._id !== userId)); // Remove the deleted user from state
    }).catch((error) => {
      console.error('Error deleting user:', error);
    });
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '20px' }}>Users</h2>
      <table>
        <thead>
          <tr>
            <th>Sr No.</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user,index) => (
            <tr key={user._id}>
              <td>{index+1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => handleEdit(user._id)}>
                  <FaEdit /> Edit
                </button>
                <button onClick={() => handleDelete(user._id)}>
                  <FaTrashAlt /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
