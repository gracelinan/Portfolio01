import * as d3 from 'd3'

const margin = { top: 20, left: 0, right: 0, bottom: 0 }
const height = 400 - margin.top - margin.bottom
const width = 400 - margin.left - margin.right

const svg = d3
  .select('#chart-6')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  .append('g')
  .attr('transform', `translate(${width / 2},${height / 2})`)

const angleScale = d3.scaleBand().range([0, Math.PI * 2])

const radius = 150

const radiusScale = d3
  .scaleLinear()
  .domain([0, 5])
  .range([0, radius])

const line = d3
  .radialArea()
  .angle(d => angleScale(d.category))
  .innerRadius(0)
  .outerRadius(d => radiusScale(d.score))

d3.csv(require('/data/homework-13/ratings.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  const categories = datapoints.map(d => d.category)
  angleScale.domain(categories)

  datapoints.push(datapoints[0])

  svg
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('fill', 'pink')
    .attr('stroke', 'black')
    .attr('opacity', 0.5)

  svg
    .append('circle')
    .attr('r', 3)
    .attr('fill', 'grey')

  const bands = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]
  // Draw a circle for each item in bands
  svg
    .selectAll('.band')
    .data(bands)
    .enter()
    .append('circle')
    .attr('fill', 'none')
    .attr('stroke', 'lightgrey')
    .attr('r', function(d) {
      return radiusScale(d)
    })
    .lower()

  svg
    .selectAll('.radius-line')
    .data(angleScale.domain())
    .enter()
    .append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', 0)
    .attr('y2', -radius)
    .attr('stroke', 'lightgrey')
    // .style/css knows about radians
    // .style('transform', function(d) {
    //   console.log(d, angleScale(d))
    //   return `rotate(${angleScale(d)}rad)`
    // })
    // for .attr you need to convert to degrees
    .attr('transform', function(d) {
      return `rotate(${(angleScale(d) * 180) / Math.PI})`
    })
  // Add one text element for every category
  // that our angleScale knows about

  svg
    .selectAll('.outside-label')
    .data(angleScale.domain())
    .enter()
    .append('text')
    .attr('font-weight', '600')
    .text(d => d)
    .attr('y', -radius) // set it up at the top of the chart
    .attr('dy', -10) // give a little offset to push it higher
    .attr('transform', function(d) {
      return `rotate(${(angleScale(d) * 180) / Math.PI})`
    })
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
  // .attr('x', function(d) {
  //   const a = angleScale(d)
  //   const r = radius + 30
  //   return r * Math.sin(a)
  // })
  // .attr('y', function(d) {
  //   const a = angleScale(d)
  //   const r = radius + 30
  //   return r * Math.cos(a) * -1
  // })
}
