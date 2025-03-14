import logo from './logo.svg';
//import './App.css';
import LineChart from './LineChart';
import Legend from './Legend';
import BarChart from './BarChart';
import Dashboard from './Dashboard';

function App() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: '20px', padding: '20px' }}>
      <Dashboard/>
    </div>
  );
}


export default App;
