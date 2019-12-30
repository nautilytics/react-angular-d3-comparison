import {useState, useLayoutEffect, useCallback} from 'react';
import debounce from 'lodash.debounce';
import {forceCollide, forceSimulation, forceX, forceY} from "d3-force";

function getDimensionObject(node) {
    const rect = node.getBoundingClientRect();

    return {
        width: rect.width,
        height: rect.height,
        top: 'x' in rect ? rect.x : rect.top,
        left: 'y' in rect ? rect.y : rect.left,
        x: 'x' in rect ? rect.x : rect.left,
        y: 'y' in rect ? rect.y : rect.top,
        right: rect.right,
        bottom: rect.bottom,
    };
}

export const useDimensions = initialDimensions => {
    const [dimensions, setDimensions] = useState(initialDimensions);
    const [node, setNode] = useState(null);

    const ref = useCallback(node => {
        setNode(node);
    }, []);

    useLayoutEffect(() => {
        if (node) {
            const measure = debounce(() => window.requestAnimationFrame(() => setDimensions(getDimensionObject(node))), 250);
            measure();

            window.addEventListener('resize', measure);

            return () => {
                window.removeEventListener('resize', measure);
            };
        }
    }, [node]);

    return [ref, dimensions, node];
};

export const calculateLayout = (items, spacing = 0.01) => {
    // Calculate a force directed placement for each point
    const MAX_STEPS = 300,
        STRENGTH = 1,
        ALPHA = 0.3;

    if (!items.length) return [];

    const getY = d => d.y;
    const getX = d => d.x;
    const getCollision = d => d.r + spacing;
    const sim = forceSimulation(items)
        .force('collide', forceCollide(getCollision))
        .force('x', forceX(getX).strength(STRENGTH))
        .force('y', forceY(getY).strength(STRENGTH))
        .alpha(ALPHA)
        .stop();

    const upperBound = Math.ceil(Math.log(sim.alphaMin()) / Math.log(1 - sim.alphaDecay()));

    for (let i = 0; i < Math.min(MAX_STEPS, upperBound); ++i) sim.tick();

    return items;
};
