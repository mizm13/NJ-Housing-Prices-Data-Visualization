import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const LineChart = () => {
    const svgRef = useRef();
    const [data, setData] = useState([]);

    // Load data from CSV
    useEffect(() => {
        d3.csv('/NJhousepricesdata.csv').then((loadedData) => {
            console.log('Loaded Data:', loadedData);

            // Parse the data to convert date and price
            const parsedData = loadedData.map((d) => ({
                date: d3.timeParse('%m/%d/%Y')(d.Years),
                price: +d.Prices,
            }));

            console.log('Parsed Data:', parsedData);

            // Filter out invalid entries
            const filteredData = parsedData.filter(
                (d) => d.date instanceof Date && !isNaN(d.price)
            );

            console.log('Filtered Data:', filteredData);
            setData(filteredData);
        }).catch((error) => {
            console.error('Error loading CSV:', error);
        });
    }, []);

    // Draw the line chart once the data is available
    useEffect(() => {
        if (data.length > 0) {
            const width = 950;
            const height = 500;
            const margin = { top: 60, right: 50, bottom: 60, left: 80 };

            // X-Axis (Time scale)
            const x = d3.scaleTime()
                .domain(d3.extent(data, (d) => d.date))
                .range([margin.left, width - margin.right]);

            // Y-Axis (Linear scale)
            const y = d3.scaleLinear()
                .domain([0, d3.max(data, (d) => d.price)])
                .nice()
                .range([height - margin.bottom, margin.top]);

            // Line generator for the data
            const line = d3.line()
                .x((d) => x(d.date))
                .y((d) => y(d.price));

            // Select the SVG element and set its size and style
            const svg = d3.select(svgRef.current)
                .attr('width', width)
                .attr('height', height)
                .style('background', '#f3f6fb') // Soothing background color
                .style('border-radius', '10px')
                .style('display', 'block')
                .style('margin', 'auto');

            svg.selectAll('*').remove(); // Clear previous chart before re-rendering

            // Append the line path to the SVG
            svg.append('path')
                .datum(data)
                .attr('fill', 'none')
                .attr('stroke', 'steelblue')
                .attr('stroke-width', 2)
                .attr('d', line);

            // X-Axis with updated ticks for more frequent intervals
            svg.append('g')
                .attr('transform', `translate(0,${height - margin.bottom})`)
                .call(
                    d3.axisBottom(x)
                        .ticks(d3.timeYear.every(2))  // Every 2 years
                        .tickFormat(d3.timeFormat('%Y'))  // Format as year (e.g., 2000, 2002, etc.)
                        .tickSizeOuter(0)
                )
                .selectAll('text')
                .attr('dy', '10px'); // Move the labels slightly downward to prevent overlap

            // Y-Axis
            svg.append('g')
                .attr('transform', `translate(${margin.left},0)`)
                .call(d3.axisLeft(y));

            // X-Axis Label (Years)
            svg.append('text')
                .attr('x', width / 2)
                .attr('y', height - 10) // Adjusted spacing for better readability
                .attr('fill', 'black')
                .attr('text-anchor', 'middle')
                .attr('font-size', '14px')
                .text('Years');

            // Y-Axis Label (House Prices)
            svg.append('text')
                .attr('transform', 'rotate(-90)')
                .attr('x', -height / 2)
                .attr('y', 25) // Adjusted Y-axis label spacing
                .attr('fill', 'black')
                .attr('text-anchor', 'middle')
                .attr('font-size', '14px')
                .text('House Prices ($)');
        }
    }, [data]);

    return (
        <div style={{ textAlign: 'center', padding: '20px', background: '#eef2f7', borderRadius: '10px' }}>
            <h1 style={{ marginBottom: '10px' }}>House Prices in Trenton, NJ (2000-2024)</h1>
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default LineChart;
