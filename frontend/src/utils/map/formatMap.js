
const getRegionColor = (total, maxTotal, h=240) => {
  const intensity = maxTotal > 0 ? total / maxTotal : 0;

  console.log('color', total, maxTotal)

  return `hsl(${h}, 100%, ${90 - intensity * 50}%)`;
};

export { getRegionColor };