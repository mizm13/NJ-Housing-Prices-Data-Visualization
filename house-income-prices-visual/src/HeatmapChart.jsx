import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const HeatmapChart = () => {
    const svgRef = useRef();
    const [data, setData] = useState([]);

    useEffect(() => {
        d3.csv('/data.csv').then((loadedData) => {
            // Process to get yearly data
            const yearlyData = [];
            const cityFields = ['TrentonIncome', 'AtlanticCityIncome', 'VinelandIncome', 'OceanCityIncome'];
            const cityNames = ['Trenton', 'Atlantic City', 'Vineland', 'Ocean City'];

            // Group by year and calculate average prices
            const dataByYear = d3.group(loadedData, d => {
                const date = d3.timeParse('%m/%d/%Y')(d.Years);
                return date ? date.getFullYear() : null;
            });

            // Get baseline values (first year)
            const firstYear = Math.min(...dataByYear.keys());
            const firstYearData = dataByYear.get(firstYear);

            const baseValues = {};
            cityFields.forEach((field, i) => {
                baseValues[field] = d3.mean(firstYearData, d => +d[field]);
            });

            // Calculate growth for each year
            dataByYear.forEach((values, year) => {
                const yearAvgs = {};
                cityFields.forEach((field, i) => {
                    const avgPrice = d3.mean(values, d => +d[field]);
                    const basePrice = baseValues[field];
                    const growthPct = ((avgPrice - basePrice) / basePrice) * 100;
                    yearAvgs[cityNames[i]] = growthPct;
                });

                yearlyData.push({
                    year,
                    ...yearAvgs
                });
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
            const width = 800;
            const height = 400;
            const margin = { top: 70, right: 100, bottom: 60, left: 120 };

            // Get cities and years
            const cities = ['Trenton', 'Atlantic City', 'Vineland', 'Ocean City'];
            const years = data.map(d => d.year);

            // Create scales
            const x = d3.scaleBand()
                .domain(years)
                .range([margin.left, width - margin.right])
                .padding(0.1);

            const y = d3.scaleBand()
                .domain(cities)
                .range([margin.top, height - margin.bottom])
                .padding(0.1);

            // Create color scale - blue for positive growth, red for negative
            const color = d3.scaleSequential()
                .domain([-10, 50])  // Adjust domain based on your data range
                .interpolator(d3.interpolateRdYlBu);

            // Set up SVG
            const svg = d3.select(svgRef.current)
                .attr('width', width)
                .attr('height', height)
                .style('background', '#f9f9f9')
                .style('border-radius', '10px')
                .style('display', 'block')
                .style('margin', '0 auto');

            svg.selectAll('*').remove();

            // Add heatmap cells
            svg.selectAll('rect')
                .data(data.flatMap(d => cities.map(city => ({
                    year: d.year,
                    city,
                    value: d[city]
                }))))
                .join('rect')
                .attr('x', d => x(d.year))
                .attr('y', d => y(d.city))
                .attr('width', x.bandwidth())
                .attr('height', y.bandwidth())
                .attr('fill', d => color(d.value))
                .attr('stroke', '#fff')
                .attr('stroke-width', 1);

            // Add text to cells
            svg.selectAll('text.cell')
                .data(data.flatMap(d => cities.map(city => ({
                    year: d.year,
                    city,
                    value: d[city]
                }))))
                .join('text')
                .attr('class', 'cell')
                .attr('x', d => x(d.year) + x.bandwidth() / 2)
                .attr('y', d => y(d.city) + y.bandwidth() / 2)
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'middle')
                .attr('font-size', '10px')
                .attr('fill', d => d.value > 20 ? 'white' : 'black')
                .text(d => `${Math.round(d.value)}%`);

            // Add x-axis
            svg.append('g')
                .attr('transform', `translate(0,${height - margin.bottom + 10})`)
                .call(d3.axisBottom(x).tickSizeOuter(0))
                .selectAll('text')
                .style('text-anchor', 'middle');

            // Add y-axis  
            svg.append('g')
                .attr('transform', `translate(${margin.left - 10},0)`)
                .call(d3.axisLeft(y).tickSizeOuter(0));

            // Add title
            svg.append('text')
                .attr('x', width / 2)
                .attr('y', 30)
                .attr('text-anchor', 'middle')
                .attr('font-size', '16px')
                .attr('font-weight', 'bold')
                .text('Median Income Growth Since 2012 (%)');

            // Add legend
            const legendWidth = 200;
            const legendHeight = 15;

            // Create a linear gradient for the legend
            const defs = svg.append('defs');
            const linearGradient = defs.append('linearGradient')
                .attr('id', 'legend-gradient')
                .attr('x1', '0%')
                .attr('x2', '100%')
                .attr('y1', '0%')
                .attr('y2', '0%');

            // Set the color stops
            const stops = [
                { offset: 0, color: color(-10) },
                { offset: 0.2, color: color(0) },
                { offset: 0.5, color: color(20) },
                { offset: 1, color: color(50) }
            ];

            stops.forEach(stop => {
                linearGradient.append('stop')
                    .attr('offset', stop.offset)
                    .attr('stop-color', stop.color);
            });

            // Add the gradient rectangle
            const legend = svg.append('g')
                .attr('transform', `translate(${width - margin.right - legendWidth}, ${margin.top - 40})`);

            legend.append('rect')
                .attr('width', legendWidth)
                .attr('height', legendHeight)
                .style('fill', 'url(#legend-gradient)');

            // Add legend ticks and labels
            const legendScale = d3.scaleLinear()
                .domain([-10, 50])
                .range([0, legendWidth]);

            const legendAxis = d3.axisBottom(legendScale)
                .tickValues([-10, 0, 10, 20, 30, 40, 50])
                .tickFormat(d => `${d}%`);

            legend.append('g')
                .attr('transform', `translate(0, ${legendHeight})`)
                .call(legendAxis)
                .selectAll('text')
                .style('font-size', '8px');
        }
    }, [data]);

    return (
        <div style={{ textAlign: 'center', padding: '20px', background: '#eef2f7', borderRadius: '10px', marginTop: '30px', maxWidth: '850px', margin: '30px auto' }}>
            <h2 style={{ marginBottom: '10px' }}>Median Income Growth Comparison</h2>
            <p style={{ marginBottom: '20px', fontSize: '14px' }}>Percentage change in median income compared to 2012 baseline</p>
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default HeatmapChart;