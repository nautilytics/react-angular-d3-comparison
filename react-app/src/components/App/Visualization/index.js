import React from 'react';
import Axes from "./Axes";
import {calculateLayout, useDimensions} from "../../../utils";
import Marker from "./Marker";
import {scaleLinear} from "d3-scale";
import {extent, range} from "d3-array";

const Visualization = ({selectedDistribution}) => {

    // Retrieve the width and height of the parent element and set up some constant variables
    const [chartRef, {width, height}] = useDimensions({width: 900, height: 600});
    const margin = {
        left: 40,
        right: 40,
        bottom: 40,
        top: 40
    };
    const markerRadius = 7.5;

    // Assign helpers for retrieving x data point
    const xAccessor = d => d.x;

    // Retrieve the inner height and width for which we will be drawing on
    const innerHeight = height - margin.top - margin.bottom;
    const innerWidth = width - margin.left - margin.right;

    // Create a random sampling of data points
    const data = range(250).map(d => {
        return {
            x: selectedDistribution.fn(),
            y: innerHeight / 2,
            r: markerRadius,
            id: `marker-${d}`
        }
    }, .1);

    // Use the data points to calculate the scales
    const xScale = scaleLinear()
        .range([0, innerWidth])
        .domain(extent(data, xAccessor));

    // Use a force simulation to place the markers throughout the visualization
    const items = calculateLayout(data.map(d => {
        return {
            ...d,
            x: xScale(xAccessor(d)),
            fx: xScale(xAccessor(d)), // fix the x-position for the markers
        }
    }));

    return (
        <svg width={width} height={height} ref={chartRef}>
            <g transform={`translate(${margin.left},${margin.top})`}>
                {
                    items.map(d => {
                        return (<Marker key={`marker-for-${d.id}`} item={d}/>)
                    })
                }
                <Axes height={innerHeight} xScale={xScale}/>
            </g>
        </svg>
    )
};
export default Visualization;
