import { forceCollide, forceSimulation, forceX, forceY } from "d3-force";

export function calculateLayout(items: any[], spacing = 0.01) {
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
