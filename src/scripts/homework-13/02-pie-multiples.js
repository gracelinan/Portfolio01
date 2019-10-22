import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }
const height = 400 - margin.top - margin.bottom
const width = 780 - margin.left - margin.right

const svg = d3
  .select('#chart-2 ')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
// .attr('transform', `translate(${width / 2},${height / 2})`)

const radius = 80

const xScale = d3
  .scalePoint()
  .domain(['Project 1', 'Project 2', 'Project 3', 'Project 4'])
  .range([radius, width - radius])

const colorScale = d3.scaleOrdinal().range(['#7fc97f', '#beaed4', '#fdc086'])

const pie = d3.pie().value(function(d) {
  return d.minutes
})

const arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(radius)

d3.csv(require('/data/homework-13/time-breakdown-all.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  const nested = d3
    .nest()
    .key(function(d) {
      return d.project
    })
    .entries(datapoints)
  console.log(nested)

  svg
    .selectAll('.pie')
    .data(nested)
    .enter()
    .append('g')
    .attr('transform', function(d) {
      const x = xScale(d.key)
      return 'translate (' + x + ',' + height / 2 + ')'
    })
    .each(function(d) {
      const name = d.key
      const datapoints = d.values
      console.log(datapoints)
      const container = d3.select(this)

      container
        .selectAll('path')
        .data(pie(datapoints))
        .enter()
        .append('path')
        .attr('d', d => arc(d))
        .attr('fill', d => colorScale(d.data.task))

      container
        .append('text')
        .text(name)
        .attr('text-anchor', 'middle') // center aligned
        .attr('y', 100)
      // .attr('font-size', 12)
    })
}
