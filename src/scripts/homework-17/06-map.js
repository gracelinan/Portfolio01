import * as d3 from 'd3'
import * as topojson from 'topojson'

const margin = { top: 0, left: 0, right: 0, bottom: 0 }

const height = 300 - margin.top - margin.bottom
const width = 280 - margin.left - margin.right

const container = d3.select('#chart-6')

const projection = d3.geoAlbersUsa().scale(700)
const path = d3.geoPath().projection(projection)

const colorScale = d3.scaleOrdinal(d3.schemeSet1)

const radiusScale = d3.scaleSqrt().range([0, 15])

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

  const nested = d3
    .nest()
    .key(function(d) {
      return d.PrimSource
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
        .attr('opacity', 0.3)

      svg
        .append('text')
        .text(name.charAt(0).toUpperCase() + name.slice(1))
        .attr('x', width / 2) // in the center
        .attr('y', height / 2)
        .attr('text-anchor', 'middle') // center aligned
        .attr('font-size', 15)
    })
}
