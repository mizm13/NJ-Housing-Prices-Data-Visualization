import React from 'react';

const Navbar = () => {
    return (
        <nav style={{
            background: '#2c3e50',
            color: 'white',
            padding: '16px 0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 20px'
            }}>
                <h1 style={{
                    margin: 0,
                    fontSize: '1.4rem',
                    fontWeight: '500',
                    textAlign: 'center'
                }}>
                    New Jersey Housing Trends: A 10-20 Year Look at Price Evolution and National Market Factors
                </h1>
            </div>
        </nav>
    );
};

export default Navbar;