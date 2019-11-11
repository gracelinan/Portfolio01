import * as d3 from 'd3'
import * as topojson from 'topojson'

const margin = { top: 0, left: 150, right: 0, bottom: 0 }

const height = 600 - margin.top - margin.bottom

const width = 900 - margin.left - margin.right

const svg = d3
  .select('#chart-5')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const projection = d3.geoAlbersUsa().scale(700)
const path = d3.geoPath().projection(projection)

const colorScale = d3.scaleOrdinal(d3.schemeSet1)

const radiusScale = d3.scaleSqrt().range([0, 15])

const bandScale = d3.scaleBand().range([100, height - 100])

Promise.all([
  d3.json(require('/data/homework-17/us_states.topojson')),
  d3.csv(require('/data/homework-17/powerplants.csv'))
])
  .then(ready)
  .catch(err => console.log('Failed on', err))
function ready([json, datapoints]) {
  const outputs = datapoints.map(d => +d.Total_MW)
  console.log(d3.extent(outputs))
  radiusScale.domain(d3.extent(outputs))

  const states = topojson.feature(json, json.objects.us_states)
  projection.fitSize([width, height], states)

  svg
    .selectAll('path')
    .data(states.features)
    .enter()
    .append('path')
    .attr('class', 'state')
    .attr('d', path)
    .attr('fill', 'lightgrey')

  svg
    .selectAll('circle')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('transform', function(d) {
      const coords = [d.Longitude, d.Latitude]
      // coords is our long/lat pair
      // console.log(coords)
      return `translate(${projection(coords)})`
    })
    .attr('fill', function(d) {
      return colorScale(d.PrimSource)
    })
    .attr('r', function(d) {
      return radiusScale(+d.Total_MW)
    })
    .attr('opacity', 0.5)

  // console.log(states.features)

  svg
    .selectAll('text')
    .data(states.features)
    .enter()
    .append('text')
    .text(function(d) {
      return d.properties.abbrev
    })
    .attr('transform', function(d) {
      // console.log(path.centroid(d))
      return `translate(${path.centroid(d)})`
    })
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('font-size', 12)
  // .style(
  //   'text-shadow',
  //   '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff'
  // )

  bandScale.domain(colorScale.domain())

  svg
    .selectAll('g')
    .data(colorScale.domain())
    .enter()
    .append('g')
    .each(function(d) {
      // console.log(d)
      const g = d3.select(this)

      g.append('circle')
        .attr('r', 10)
        .attr('cx', -120)
        // .attr('cy', 100)
        .attr('cy', function(d) {
          return bandScale(d)
        })
        .attr('fill', function(d) {
          return colorScale(d)
        })

      g.append('text')
        .text(d.charAt(0).toUpperCase() + d.slice(1))
        .attr('x', -100)
        // .attr('text-anchor', 'middle') // center aligned
        .attr('y', function(d) {
          return bandScale(d)
        })
        .attr('font-size', 12)
    })
}
