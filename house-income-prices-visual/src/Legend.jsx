import React from 'react';

const Legend = () => {
    const colors = {
        TrentonPrices: 'steelblue',
        AtlanticCityPrices: 'green',
        VinelandPrices: 'red',
        OceanCityPrices: 'purple'
    };

    return (
        <div style={{ padding: '10px', background: '#fff', borderRadius: '10px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', width: '200px' }}>
            <h3 style={{ marginBottom: '10px', textAlign: 'center' }}>Legend</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {Object.entries(colors).map(([key, color]) => (
                    <li key={key} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                        <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: color, marginRight: '8px', borderRadius: '3px' }}></span>
                        {key.replace('Prices', '')}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Legend;
