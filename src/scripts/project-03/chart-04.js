import * as d3 from 'd3'

// Create your margins and height/width
const margin = { top: 50, left: 45, right: 20, bottom: 20 }
const height = 250 - margin.top - margin.bottom
const width = 175 - margin.left - margin.right

// I'll give you this part!
const container = d3.select('#chart-04')

// Create your scales
const xPositionScale = d3
  .scaleLinear()
  .domain([2015, 2019])
  .range([0, width])

const yPositionScale = d3.scaleLinear().range([height, 0])

// Create your line generator
const line = d3
  .line()
  .x(d => {
    return xPositionScale(d.year)
  })
  .y(d => {
    return yPositionScale(d.percentage)
  })

// Read in your data
d3.csv(require('/data/project-03/populous-country.csv')).then(ready)

// Create your ready function
function ready(datapoints) {
  const percentages = datapoints.map(function(d) {
    return +d.percentage
  })
  const percentageMax = d3.max(percentages)
  console.log(percentageMax)
  yPositionScale.domain([0, 7])

  const nested = d3
    .nest()
    .key(function(d) {
      return d.country
    })
    .entries(datapoints)

  container
    .selectAll('svg')
    .data(nested)
    .enter()
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .each(function(d) {
      const name = d.key
      const datapoints = d.values
      // console.log(datapoints)
      // What SVG are we in? Let's grab it.
      const svg = d3.select(this)

      svg
        .append('path')
        .datum(datapoints)
        .attr('stroke', '#CD5C5C')
        .attr('fill', 'none')
        .attr('d', line)
        .attr('stroke-width', 2)

      svg
        .append('text')
        .text(name)
        .attr('x', width / 2) // in the center
        .attr('text-anchor', 'middle') // center aligned
        .attr('dy', -10)
        .attr('font-size', 12)
        .attr('fill', '#CD5C5C')
        .style('font-weight', 'bold')

      const xAxis = d3
        .axisBottom(xPositionScale)
        .ticks(5)
        // .tickValues([2015, 2017, 2019])
        .tickFormat(d3.format('d'))
        .tickSize(-height)
      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)
        .selectAll('.tick line')
        .attr('stroke-dasharray', '2 2')

      const yAxis = d3
        .axisLeft(yPositionScale)
        .tickValues([1.5, 3, 4.5, 6])
        // .tickFormat(d3.format('d, %'))
        .tickSize(-width)
      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis)
        .selectAll('.tick line')
        .attr('stroke-dasharray', '2 2')

      svg.selectAll('.domain').remove()
    })
}
