import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const BarChart = () => {
    const svgRef = useRef();
    const [data, setData] = useState([]);

    useEffect(() => {
        d3.csv('/data.csv').then((loadedData) => {
            // Process data to calculate price-to-income ratios
            const processedData = loadedData.map(d => {
                // Extract year from date
                const date = d3.timeParse('%m/%d/%Y')(d.Years);
                if (!date) return null;
                const year = date.getFullYear();

                return {
                    year,
                    TrentonRatio: +d.TrentonPrices / +d.TrentonIncome,
                    AtlanticCityRatio: +d.AtlanticCityPrices / +d.AtlanticCityIncome,
                    VinelandRatio: +d.VinelandPrices / +d.VinelandIncome,
                    OceanCityRatio: +d.OceanCityPrices / +d.OceanCityIncome
                };
            }).filter(d => d !== null);

            // Aggregate by year (average of monthly values)
            const yearlyData = Array.from(d3.group(processedData, d => d.year), ([year, values]) => {
                return {
                    year: year,
                    TrentonRatio: d3.mean(values, d => d.TrentonRatio),
                    AtlanticCityRatio: d3.mean(values, d => d.AtlanticCityRatio),
                    VinelandRatio: d3.mean(values, d => d.VinelandRatio),
                    OceanCityRatio: d3.mean(values, d => d.OceanCityRatio)
                };
            });

            // Sort by year
            yearlyData.sort((a, b) => a.year - b.year);
            setData(yearlyData);
        }).catch(error => {
            console.error('Error loading data:', error);
        });
    }, []);

    useEffect(() => {
        if (data.length > 0) {
            const width = 800;  // Reduced width
            const height = 400; // Reduced height
            const margin = { top: 50, right: 120, bottom: 80, left: 80 };

            // Get all cities (ratio properties)
            const cities = ['TrentonRatio', 'AtlanticCityRatio', 'VinelandRatio', 'OceanCityRatio'];
            const cityLabels = {
                'TrentonRatio': 'Trenton',
                'AtlanticCityRatio': 'Atlantic City',
                'VinelandRatio': 'Vineland',
                'OceanCityRatio': 'Ocean City'
            };

            // For x-axis: years
            const years = data.map(d => d.year);

            // Create scales
            const x0 = d3.scaleBand()
                .domain(years)
                .range([margin.left, width - margin.right])
                .paddingInner(0.1);

            const x1 = d3.scaleBand()
                .domain(cities)
                .range([0, x0.bandwidth()])
                .padding(0.05);

            const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d3.max(cities, c => d[c])) * 1.1])
                .nice()
                .range([height - margin.bottom, margin.top]);

            const color = d3.scaleOrdinal()
                .domain(cities)
                .range(['steelblue', 'green', 'red', 'purple']);

            // Select SVG
            const svg = d3.select(svgRef.current)
                .attr('width', width)
                .attr('height', height)
                .style('background', '#f3f6fb')
                .style('border-radius', '10px')
                .style('display', 'block')
                .style('margin', '0 auto'); // Center the chart

            svg.selectAll('*').remove();

            // Add bars
            svg.append('g')
                .selectAll('g')
                .data(data)
                .join('g')
                .attr('transform', d => `translate(${x0(d.year)},0)`)
                .selectAll('rect')
                .data(d => cities.map(city => ({ city, value: d[city] })))
                .join('rect')
                .attr('x', d => x1(d.city))
                .attr('y', d => y(d.value))
                .attr('width', x1.bandwidth())
                .attr('height', d => y(0) - y(d.value))
                .attr('fill', d => color(d.city));

            // Add x-axis
            svg.append('g')
                .attr('transform', `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(x0).tickSizeOuter(0))
                .selectAll('text')
                .attr('dy', '10px')
                .attr('transform', 'rotate(-30)')
                .attr('text-anchor', 'end');

            // Add y-axis
            svg.append('g')
                .attr('transform', `translate(${margin.left},0)`)
                .call(d3.axisLeft(y).ticks(5).tickFormat(d => d.toFixed(1)))
                .call(g => g.select('.domain').remove());

            // Add axis labels
            svg.append('text')
                .attr('x', width / 2)
                .attr('y', height - 10)
                .attr('fill', 'black')
                .attr('text-anchor', 'middle')
                .attr('font-size', '14px')
                .text('Years');

            svg.append('text')
                .attr('transform', 'rotate(-90)')
                .attr('x', -height / 2)
                .attr('y', 25)
                .attr('fill', 'black')
                .attr('text-anchor', 'middle')
                .attr('font-size', '14px')
                .text('Price-to-Income Ratio');

            // Add legend
            const legend = svg.append('g')
                .attr('font-family', 'sans-serif')
                .attr('font-size', 10)
                .attr('transform', `translate(${width - 110},${margin.top})`)
                .selectAll('g')
                .data(cities.map(c => ({
                    city: c,
                    label: cityLabels[c]
                })))
                .join('g')
                .attr('transform', (d, i) => `translate(0,${i * 20})`);

            legend.append('rect')
                .attr('width', 15)
                .attr('height', 15)
                .attr('fill', d => color(d.city));

            legend.append('text')
                .attr('x', 20)
                .attr('y', 7.5)
                .attr('dy', '0.32em')
                .text(d => d.label);
        }
    }, [data]);

    return (
        <div style={{ textAlign: 'center', padding: '20px', background: '#eef2f7', borderRadius: '10px', marginTop: '30px', maxWidth: '850px', margin: '30px auto' }}>
            <h2 style={{ marginBottom: '10px' }}>Housing Affordability: Price-to-Income Ratios</h2>
            <p style={{ marginBottom: '20px', fontSize: '14px' }}>Higher ratios indicate less affordable housing markets</p>
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default BarChart;