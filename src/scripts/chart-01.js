import * as d3 from 'd3'
import d3Tip from 'd3-tip'
import d3Annotation from 'd3-svg-annotation'

d3.tip = d3Tip

const margin = { top: 30, left: 70, right: 60, bottom: 50 }
const height = 420 - margin.top - margin.bottom
const width = 750 - margin.left - margin.right

console.log('Building chart 1')

const svg = d3
  .select('#chart-01')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')


// Create your scales
const xPositionScale = d3.scaleLinear().domain([1981, 2019]).range([0, width])

const yPositionScale = d3.scaleLinear().range([height, 0])

const line = d3
  .line()
  .x(function(d) {
    return xPositionScale(+d.year)
  })
  .y(function(d) {
    return yPositionScale(d.counts)
  })

const tip = d3
  .tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return `${d.year} <span style='color:red'>${d.counts}</span>`
  })

svg.call(tip)

// Create a d3.line function that uses your scales

d3.csv(require('../data/uk-resign.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  const counts = datapoints.map(function(d) {
    return +d.counts
  })
  const countsMax = d3.max(counts)
  // const countsMin = d3.min(counts)
  yPositionScale.domain([0, countsMax])

  // Draw your dots

  svg
    .selectAll('circle')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('r', 3)
    .attr('cx', d => xPositionScale(+d.year))
    .attr('cy', d => yPositionScale(d.counts))
    .attr('fill', 'lightblue')
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)

  // Draw your single

  svg
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('stroke', 'lightblue')
    .attr('stroke-width', 2)
    .attr('fill', 'none')

  // Add your annotations

  const annotations = [
    {
      note: {
        label: '',
        title: 'Brexit referendum'
      },
      // copying what our data looks like
      // this is the point I want to annotate
      data: { year: '2016', counts: 2 },
      dx: 10,
      dy: -10,
      color: 'red'
    }
  ]

  const makeAnnotations = d3Annotation
    .annotation()
    .accessors({
      x: d => xPositionScale((d.year)),
      y: d => yPositionScale(d.counts)
    })
    .annotations(annotations)

  svg.call(makeAnnotations)

  // Add your axes

  const xAxis = d3
    .axisBottom(xPositionScale)
    .tickFormat(d3.format('d'))
    .tickValues([1981, 1991, 1997, 2007, 2010, 2016])    
    // .ticks(12)

  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  const yAxis = d3.axisLeft(yPositionScale).tickValues([4, 8, 12, 16])    

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
}
