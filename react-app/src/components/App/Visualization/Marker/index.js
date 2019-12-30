import React, {useEffect, useRef} from 'react';
import 'd3-transition';
import {select} from 'd3-selection';

const Marker = ({item}) => {
    const markerRef = useRef();

    useEffect(() => {
        select(markerRef.current)
            .transition()
            .duration(1000)
            .attr('cx', item.x)
            .attr('cy', item.y);
    }, [item]);

    return (
        <circle ref={markerRef} r={item.r} className='marker'/>
    );
};
export default Marker;
