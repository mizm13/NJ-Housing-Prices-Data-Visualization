import React from 'react';
import LineChart from './LineChart';
import BarChart from './BarChart';

const Dashboard = () => {
    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            <header style={{ textAlign: 'center', padding: '20px 0' }}>
                <h1>New Jersey Housing Market Analysis (2012-2024)</h1>
                <p>Examining housing prices and affordability across cities</p>
            </header>

            <section>
                <LineChart />
            </section>

            <section>
                <BarChart />
            </section>

            <section style={{
                margin: '30px auto',
                padding: '20px',
                background: '#f3f6fb',
                borderRadius: '10px',
                maxWidth: '850px'
            }}>
                <h2 style={{ marginBottom: '15px' }}>Key Findings</h2>
                <ul style={{ textAlign: 'left', lineHeight: '1.6' }}>
                    <li>Ocean City consistently has the highest home prices among the cities analyzed</li>
                    <li>When comparing price-to-income ratios, we can see differences in affordability across regions</li>
                    <li>Housing prices have outpaced income growth in most cities since 2012</li>
                </ul>
            </section>

            <footer style={{ textAlign: 'center', padding: '20px', fontSize: '14px', color: '#666' }}>
                <p>Data source: New Jersey housing and income statistics (2012-2024)</p>
            </footer>
        </div>
    );
};

export default Dashboard;