import React from 'react';
import LineChart from './LineChart';
import BarChart from './BarChart';
import PieChart from './PieChart';
import Navbar from './Navbar';
import HeatmapChart from './HeatmapChart';

const Dashboard = () => {
    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            <header style={{ textAlign: 'center', padding: '20px 0' }}>
                <Navbar />
                <h3>New Jersey Housing Market Analysis (2012-2024)</h3>
                <p>Examining housing prices across major NJ cities</p>
            </header>
            <section>
                <LineChart />
            </section>
            <section>
                <HeatmapChart />
            </section>
            <section>
                <PieChart />
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
                    <li>Economic factors like mortgage rates (28%) and interest rates (20%) have had the greatest influence on U.S. housing prices, underscoring the impact of borrowing costs on market trends</li>
                </ul>
            </section>
            <footer style={{ textAlign: 'center', padding: '20px', fontSize: '14px', color: '#666' }}>
                <p>Data sources: New Jersey housing and income statistics (2012-2024)</p>
                <p>
                    Sources:
                    <a href="https://www.zillow.com/research/data/" target="_blank" rel="noopener noreferrer"> Zillow Research</a> |
                    <a href="https://www.kaggle.com/datasets/madhurpant/factors-affecting-usa-national-home-prices?resource=download" target="_blank" rel="noopener noreferrer"> Kaggle Dataset</a>
                </p>
            </footer>

        </div>
    );
};

export default Dashboard;