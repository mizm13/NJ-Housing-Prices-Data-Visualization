import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const PieChart = () => {
    const svgRef = useRef();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const dataFiles = [
            {
                name: "Interest Rates",
                file: "/FactorsAffectingUSHousePrices/FedFunds.csv",
                field: "FEDFUNDS",
                color: "#4e79a7",
                weight: 20
            },
            {
                name: "Mortgage Rates",
                file: "/FactorsAffectingUSHousePrices/Mortgage.csv",
                field: "MORTGAGE30US",
                color: "#f28e2c",
                weight: 28
            },
            {
                name: "GDP Growth",
                file: "/FactorsAffectingUSHousePrices/GDP.csv",
                field: "GDP",
                color: "#e15759",
                weight: 17
            },
            {
                name: "Population Growth",
                file: "/FactorsAffectingUSHousePrices/Population-Growth.csv",
                field: "SPPOPGROWUSA",
                color: "#76b7b2",
                weight: 14
            },
            {
                name: "Inflation (CPI)",
                file: "/FactorsAffectingUSHousePrices/Consumer-Price-Index.csv",
                field: "CPIAUCSL",
                color: "#59a14f",
                weight: 11
            },
            {
                name: "Unemployment",
                file: "/FactorsAffectingUSHousePrices/Unemployment-Rate.csv",
                field: "UNRATE",
                color: "#edc949",
                weight: 10
            }
        ];

        // Convert the factor weights into percentages for the pie chart
        const pieData = dataFiles.map(factor => ({
            name: factor.name,
            value: factor.weight,
            color: factor.color
        }));

        setData(pieData);
        setLoading(false);
    }, []);

    useEffect(() => {
        if (data.length > 0) {
            const width = 600; // Increased width to accommodate legend better
            const height = 400;
            const margin = 40;

            // Reduce pie chart size to make more room for legend
            const radius = Math.min(width - 200, height) / 2 - margin;

            // Select SVG
            const svg = d3.select(svgRef.current)
                .attr('width', width)
                .attr('height', height)
                .style('background', '#f3f6fb')
                .style('border-radius', '10px')
                .style('display', 'block')
                .style('margin', '0 auto'); // Center the chart

            svg.selectAll('*').remove();

            // Append g element for the pie chart - shift it left to make room for legend
            const g = svg.append('g')
                .attr('transform', `translate(${(width - 200) / 2}, ${height / 2})`);

            // Generate the pie
            const pie = d3.pie()
                .value(d => d.value)
                .sort(null); // Don't sort so the data order is preserved

            // Generate the arcs
            const arc = d3.arc()
                .innerRadius(0)
                .outerRadius(radius);

            // Generate the pie chart
            const arcs = g.selectAll('.arc')
                .data(pie(data))
                .enter()
                .append('g')
                .attr('class', 'arc');

            // Append path (slice)
            arcs.append('path')
                .attr('d', arc)
                .attr('fill', d => d.data.color)
                .attr('stroke', 'white')
                .style('stroke-width', '2px')
                .on('mouseover', function (event, d) {
                    d3.select(this)
                        .attr('opacity', 0.8);

                    // Create tooltip
                    svg.append('text')
                        .attr('class', 'tooltip')
                        .attr('text-anchor', 'middle')
                        .attr('x', (width - 200) / 2)
                        .attr('y', height - 10)
                        .attr('font-size', '14px')
                        .attr('font-weight', 'bold')
                        .text(`${d.data.name}: ${d.data.value}%`);
                })
                .on('mouseout', function () {
                    d3.select(this)
                        .attr('opacity', 1);

                    // Remove tooltip
                    svg.selectAll('.tooltip').remove();
                });

            // Add legend with more space from the chart
            const legendG = svg.append('g')
                .attr('transform', `translate(${width - 180}, ${height / 2 - 80})`)
                .selectAll('.legend')
                .data(data)
                .enter()
                .append('g')
                .attr('class', 'legend')
                .attr('transform', (d, i) => `translate(0, ${i * 25})`); // Increased vertical spacing

            legendG.append('rect')
                .attr('width', 15)
                .attr('height', 15)
                .attr('fill', d => d.color);

            legendG.append('text')
                .text(d => `${d.name} (${d.value}%)`)
                .style('font-size', '13px') // Slightly larger font
                .attr('y', 12)
                .attr('x', 25); // Increased distance from color box

            // Add title
            svg.append('text')
                .attr('x', width / 2)
                .attr('y', 20)
                .attr('text-anchor', 'middle')
                .attr('font-size', '16px')
                .attr('font-weight', 'bold')
                .text('Factors Affecting U.S. Home Prices');

            // Add a subtle dividing line between chart and legend
            svg.append('line')
                .attr('x1', width - 200)
                .attr('y1', height / 2 - 100)
                .attr('x2', width - 200)
                .attr('y2', height / 2 + 100)
                .attr('stroke', '#e0e0e0')
                .attr('stroke-width', 1);
        }
    }, [data]);

    if (loading) {
        return <div>Loading housing price factors data...</div>;
    }

    if (error) {
        return <div>Error loading data: {error}</div>;
    }

    return (
        <div style={{ textAlign: 'center', padding: '20px', background: '#eef2f7', borderRadius: '10px', marginTop: '30px', maxWidth: '850px', margin: '30px auto' }}>
            <h2 style={{ marginBottom: '10px' }}>Factors Influencing National Housing Prices (Years: 2000 - 2024)</h2>
            <p style={{ marginBottom: '20px', fontSize: '14px' }}>Relative impact of economic indicators on U.S. housing market</p>
            <svg ref={svgRef}></svg>
            <div style={{ marginTop: '20px', textAlign: 'left', padding: '0 40px' }}>
                <p style={{ fontSize: '14px', fontStyle: 'italic' }}>
                    Note: This chart represents estimated influence of various factors on home prices based on available economic data.
                    Hover over each segment to see exact percentage values. Data is for Years: 2000 - 2024
                </p>
            </div>
        </div>
    );
};

export default PieChart;