import * as d3 from 'd3'
import d3Tip from 'd3-tip'
import d3Annotation from 'd3-svg-annotation'

d3.tip = d3Tip

const margin = {
  top: 30,
  right: 20,
  bottom: 30,
  left: 20
}

const width = 700 - margin.left - margin.right
const height = 400 - margin.top - margin.bottom

const svg = d3
  .select('#bar-chart')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const xPositionScale = d3.scaleBand().range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .range([height, 0])

const tip = d3
  .tip()
  .attr('class', 'd3-tip')
  .offset([0, 0])
  .html(function(d) {
    return `${d.Country_Name} <span style='color:red'>${d.Cost_1_GB_USD}</span>`
  })

svg.call(tip)

d3.csv(require('/data/project-03/Mobile-Pricing-2019Q2.csv')).then(ready)

function ready(datapoints) {
  // Sort the countries from low to high
  datapoints = datapoints.sort((a, b) => {
    return a.Cost_1_GB_USD - b.Cost_1_GB_USD
  })

  // And set up the domain of the xPositionScale
  // using the read-in data
  const countries = datapoints.map(d => d.Country_Name)
  xPositionScale.domain(countries)

  const costs = datapoints.map(d => +d.Cost_1_GB_USD)
  const costMax = d3.max(costs)
  console.log(costMax)
  yPositionScale.domain([0, 15])

  /* Add your rectangles here */
  svg
    .selectAll('rect')
    .data(datapoints)
    .enter()
    .append('rect')
    .attr('width', xPositionScale.bandwidth())
    .attr('height', d => height - yPositionScale(d.Cost_1_GB_USD))
    .attr('x', d => xPositionScale(d.Country_Name))
    .attr('y', d => yPositionScale(d.Cost_1_GB_USD))
    .attr('fill', 'lightgrey')
    .attr('class', d => d.Region.toLowerCase().replace(/[^a-z]*/g, ''))
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)

  d3.select('#asia').on('click', function() {
    console.log('clicked')
    svg.selectAll('rect').attr('fill', 'lightgrey')
    svg.selectAll('.asia').attr('fill', 'lightskyblue')
  })

  d3.select('#africa').on('click', function() {
    console.log('clicked')
    svg.selectAll('rect').attr('fill', 'lightgrey')
    svg.selectAll('.africa').attr('fill', 'lightskyblue')
  })

  d3.select('#high-cost').on('click', function() {
    console.log('clicked')
    svg
      .selectAll('rect')
      .data(datapoints)
      .attr('fill', function(d) {
        if (+d.Cost_1_GB_USD > 15) {
          return '#CD5C5C'
        } else {
          return 'lightgrey'
        }
      })
  })

  d3.select('#reset').on('click', function() {
    svg.selectAll('rect').attr('fill', 'lightgrey')
  })

  d3.select('#continent').on('click', function() {
    svg.selectAll('.americas').attr('fill', '#D8BFD8')
    svg.selectAll('.asia').attr('fill', '#F0E68C')
    svg.selectAll('.africa').attr('fill', '#8FBC8B')
    svg.selectAll('.europe').attr('fill', '#F4A460')
    svg.selectAll('.oceania').attr('fill', '#FA8072')
  })

  const yAxis = d3
    .axisLeft(yPositionScale)
    .tickSize(-width)
    .ticks(4)

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
    // .attr('stroke', 'red')
    .attr('stroke-dasharray', '3 2')
    .lower()

  d3.select('.y-axis .domain').remove()
}
