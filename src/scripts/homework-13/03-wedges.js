import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }
const height = 400 - margin.top - margin.bottom
const width = 780 - margin.left - margin.right

const svg = d3
  .select('#chart-3')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  .attr('transform', `translate(${width / 2},${height / 2})`)

const pie = d3.pie().value(1 / 12)

const radius = 120

const radiusScale = d3
  .scaleLinear()
  .domain([0, 85])
  .range([0, radius])

const colorScale = d3
  .scaleLinear()
  .domain([0, 85])
  .range(['#87CEFA', 'pink'])

d3.csv(require('/data/homework-13/ny-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  const arc = d3
    .arc()
    .innerRadius(0)
    .outerRadius(d => radiusScale(d.data.high_temp))

  svg
    .selectAll('path')
    .data(pie(datapoints))
    .enter()
    .append('path')
    .attr('fill', d => colorScale(d.data.high_temp))
    .attr('d', d => arc(d))

  svg
    .append('circle')
    .attr('r', 2)
    .attr('fill', 'grey')

  svg
    .append('text')
    .text('NYC high temperatures, by month')
    .attr('font-weight', '600')
    .attr('text-anchor', 'middle')
    .attr('y', -100)
    .style('font-size', 22)
}
