import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const LineChart = () => {
    const svgRef = useRef();
    const [data, setData] = useState([]);

    useEffect(() => {
        d3.csv('/NJhousepricesdata.csv').then((loadedData) => {
            console.log('Loaded Data:', loadedData);

            const parsedData = loadedData.map((d) => ({
                date: d3.timeParse('%m/%d/%Y')(d.Years),
                price: +d.Prices,
            }));

            console.log('Parsed Data:', parsedData);

            const filteredData = parsedData.filter(
                (d) => d.date instanceof Date && !isNaN(d.price)
            );

            console.log('Filtered Data:', filteredData);

            setData(filteredData);
        }).catch((error) => {
            console.error('Error loading CSV:', error);
        });
    }, []);

    useEffect(() => {
        if (data.length > 0) {
            const width = 928;
            const height = 500;
            const marginTop = 50;
            const marginRight = 30;
            const marginBottom = 50;
            const marginLeft = 60;

            const x = d3.scaleTime()
                .domain(d3.extent(data, (d) => d.date))
                .range([marginLeft, width - marginRight]);

            const y = d3.scaleLinear()
                .domain([0, d3.max(data, (d) => d.price)])
                .range([height - marginBottom, marginTop]);

            const line = d3.line()
                .x((d) => x(d.date))
                .y((d) => y(d.price));

            const svg = d3.select(svgRef.current)
                .attr('width', width)
                .attr('height', height)
                .attr('viewBox', `0 0 ${width} ${height}`)
                .style('max-width', '100%')
                .style('height', 'auto');

            svg.selectAll('*').remove();

            // Background color
            svg.append('rect')
                .attr('width', width)
                .attr('height', height)
                .attr('fill', '#f0f8ff'); // Light pastel blue background

            // Chart title
            svg.append('text')
                .attr('x', width / 2)
                .attr('y', marginTop / 2)
                .attr('text-anchor', 'middle')
                .style('font-size', '18px')
                .style('font-weight', 'bold')
                .text('House Prices in Trenton, NJ (2000-2024)');

            // X-axis
            svg.append('g')
                .attr('transform', `translate(0,${height - marginBottom})`)
                .call(d3.axisBottom(x).ticks(5));

            // X-axis label
            svg.append('text')
                .attr('x', width / 2)
                .attr('y', height - 10)
                .attr('text-anchor', 'middle')
                .style('font-size', '14px')
                .text('Years');

            // Y-axis
            svg.append('g')
                .attr('transform', `translate(${marginLeft},0)`)
                .call(d3.axisLeft(y))
                .call((g) => g.select('.domain').remove())
                .call((g) => g.selectAll('.tick line').clone()
                    .attr('x2', width - marginLeft - marginRight)
                    .attr('stroke-opacity', 0.1));

            // Y-axis label
            svg.append('text')
                .attr('x', -height / 2)
                .attr('y', 15)
                .attr('transform', 'rotate(-90)')
                .attr('text-anchor', 'middle')
                .style('font-size', '14px')
                .text('House Prices');

            // Line path
            svg.append('path')
                .datum(data)
                .attr('fill', 'none')
                .attr('stroke', 'steelblue')
                .attr('stroke-width', 2)
                .attr('d', line);
        }
    }, [data]);

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "#eef3f3", padding: "20px", borderRadius: "10px" }}>
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default LineChart;
