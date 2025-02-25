import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const LineChart = () => {
    const svgRef = useRef();
    const [data, setData] = useState([]);

    useEffect(() => {
        d3.csv('/data.csv').then((loadedData) => {
            console.log('Loaded Data:', loadedData);

            const parsedData = loadedData.map((d) => ({
                date: d3.timeParse('%m/%d/%Y')(d.Years),
                TrentonPrices: +d.TrentonPrices,
                AtlanticCityPrices: +d.AtlanticCityPrices,
                VinelandPrices: +d.VinelandPrices,
                OceanCityPrices: +d.OceanCityPrices,
            }));

            const filteredData = parsedData.filter((d) => d.date instanceof Date && !isNaN(d.TrentonPrices));
            setData(filteredData);
        }).catch((error) => {
            console.error('Error loading CSV:', error);
        });
    }, []);

    useEffect(() => {
        if (data.length > 0) {
            const width = 950;
            const height = 500;
            const margin = { top: 50, right: 50, bottom: 60, left: 80 };

            const x = d3.scaleTime()
                .domain(d3.extent(data, (d) => d.date))
                .range([margin.left, width - margin.right]);

            const yMax = d3.max(data, (d) => Math.max(d.TrentonPrices, d.AtlanticCityPrices, d.VinelandPrices, d.OceanCityPrices));
            const y = d3.scaleLinear()
                .domain([0, yMax])
                .nice()
                .range([height - margin.bottom, margin.top]);

            const colors = {
                TrentonPrices: 'steelblue',
                AtlanticCityPrices: 'green',
                VinelandPrices: 'red',
                OceanCityPrices: 'purple'
            };

            const svg = d3.select(svgRef.current)
                .attr('width', width)
                .attr('height', height)
                .style('background', '#f3f6fb')
                .style('border-radius', '10px')
                .style('display', 'block')
                .style('margin', 'auto');

            svg.selectAll('*').remove();

            Object.keys(colors).forEach((key) => {
                const line = d3.line()
                    .x((d) => x(d.date))
                    .y((d) => y(d[key]));

                svg.append('path')
                    .datum(data)
                    .attr('fill', 'none')
                    .attr('stroke', colors[key])
                    .attr('stroke-width', 2)
                    .attr('d', line);
            });

            svg.append('g')
                .attr('transform', `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(x).ticks(15).tickFormat(d3.timeFormat('%Y')).tickSizeOuter(0))
                .selectAll('text')
                .attr('dy', '10px');

            svg.append('g')
                .attr('transform', `translate(${margin.left},0)`)
                .call(d3.axisLeft(y)
                    .tickValues(d3.range(0, yMax + 50000, 50000)) // Y-axis increments by $50,000
                    .tickFormat(d3.format("$.2s")) // Formats as currency
                );

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
                .text('House Prices ($)');
        }
    }, [data]);

    return (
        <div style={{ textAlign: 'center', padding: '20px', background: '#eef2f7', borderRadius: '10px' }}>
            <h1 style={{ marginBottom: '10px' }}>House Prices in NJ (2012-2024)</h1>
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default LineChart;
