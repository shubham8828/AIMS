import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, ArcElement, Legend } from 'chart.js';

ChartJS.register(Title, Tooltip, ArcElement, Legend);

const PieChart = ({cityData,stateData}) => {

  return (<>
    <h2 style={{textAlign:'center'}}>Users by City and State</h2>
    <div className='pie'>

      <Pie data={cityData}  height={750}/>
      <Pie data={stateData}  height={750}/>
    </div>
    </>
  );
};

export default PieChart;
