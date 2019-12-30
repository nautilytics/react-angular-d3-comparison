import React, {useEffect, useRef} from 'react';
import {select} from 'd3-selection';
import {axisBottom} from "d3-axis";

const Axes = ({xScale, height}) => {
    const xAxisRef = useRef();

    useEffect(() => {
        renderAxes();
    });

    const renderAxes = () => {
        renderXAxis();
    };

    const renderXAxis = () => {
        const xAxis = select(xAxisRef.current);
        xAxis.call(axisBottom(xScale));
    };

    return (
        <g className="axes">
            <g className="x axis" ref={xAxisRef} transform={`translate(0,${height})`}/>
        </g>
    );
};
export default Axes;
