import axios from 'axios';
import { useEffect, useState } from 'react';
import LineChart from '../component/LineChart';
import PieChart from '../component/PieChart';
import Spinner from '../component/Spinner';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [cities, setCities] = useState(new Set()); // Set to store unique cities
  const [states, setStates] = useState(new Set()); // Set to store unique states
  const [monthData, setMonthData] = useState({ labels: [], datasets: [] });
  const [cityData, setCityData] = useState({ labels: [], datasets: [] });
  const [stateData, setStateData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true); // Track loading state

  // Month names array
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    // Fetch data from API
    axios.get("http://localhost:4000/api/users") // Replace with your actual API endpoint
      .then((response) => {
        const userData = response.data.users; // Access the 'users' data from the response
        setUsers(userData);

        // Collect unique cities and states
        const citySet = new Set();
        const stateSet = new Set();
        const cityCount = {};
        const stateCount = {};

        userData.forEach((user) => {
          const city = user.address.city;
          const state = user.address.state;

          citySet.add(city);
          stateSet.add(state);

          // Count users per city
          cityCount[city] = (cityCount[city] || 0) + 1;

          // Count users per state
          stateCount[state] = (stateCount[state] || 0) + 1;
        });

        setCities(citySet); // Update the cities set
        setStates(stateSet); // Update the states set

        // Prepare the city data for Pie chart
        const cityLabels = Object.keys(cityCount);
        const cityUserCounts = cityLabels.map((city) => cityCount[city]);

        // Prepare the state data for Pie chart
        const stateLabels = Object.keys(stateCount);
        const stateUserCounts = stateLabels.map((state) => stateCount[state]);

        // Set the cityData and stateData for Pie chart
        setCityData({
          labels: cityLabels,
          datasets: [
            {
              data: cityUserCounts,
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF5733'], // Use dynamic or static colors as needed
            },
          ],
        });

        setStateData({
          labels: stateLabels,
          datasets: [
            {
              data: stateUserCounts,
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF5733'], // Use dynamic or static colors as needed
            },
          ],
        });

        // Initialize an array to hold the user count for each month
        const monthCount = new Array(12).fill(0); // Initialize all months with 0

        // Calculate user registration count per month
        userData.forEach((user) => {
          const date = new Date(user.createdAt);
          const monthIndex = date.getMonth(); // Get the 0-based month index (0 = January, 1 = February, etc.)
          monthCount[monthIndex] += 1; // Increment the count for the corresponding month
        });

        // Set the data for the Line Chart
        setMonthData({
          labels: monthNames, // Month names as x-axis labels
          datasets: [
            {
              label: 'Users Registered',
              data: monthCount, // Array of user counts per month
              fill: false,
              borderColor: '#42A5F5',
              tension: 0.1,
            },
          ],
        });

        // Set loading to false after data is fetched
         setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        setLoading(false); // Stop loading even if there is an error
      });
  }, []);

  if (loading) {
    // Show Spinner while data is loading
    return <Spinner />;
  }

  // Render the dashboard once data is loaded
  return (
    <div className="dashboard-container">
      <div
        className="card-container"
        style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '40px' }}
      >
        <div className="card">
          <h2>Total Users</h2>
          <p>{users.length}</p>
        </div>
        <div className="card">
          <h2>Total Cities</h2>
          <p>{cities.size}</p> {/* Display unique cities count */}
        </div>
        <div className="card">
          <h2>Total States</h2>
          <p>{states.size}</p> {/* Display unique states count */}
        </div>
      </div>

      <div className="chart">
        {/* Pass the dynamically generated monthData to LineChart */}
        <LineChart monthData={monthData} />

        {/* Pass the dynamically generated cityData and stateData to PieChart */}
        <PieChart cityData={cityData} stateData={stateData} />
      </div>
    </div>
  );
};

export default Dashboard;
