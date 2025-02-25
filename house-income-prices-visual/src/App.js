import logo from './logo.svg';
//import './App.css';
import LineChart from './LineChart';
import Legend from './Legend';

function App() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: '20px', padding: '20px' }}>
      <LineChart />
      <Legend /> {/* Legend is now separate from the chart */}
    </div>
  );
}

export default App;
