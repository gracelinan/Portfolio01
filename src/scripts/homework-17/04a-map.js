import * as d3 from 'd3'
import * as topojson from 'topojson'

const margin = { top: 0, left: 0, right: 0, bottom: 0 }

const height = 500 - margin.top - margin.bottom

const width = 900 - margin.left - margin.right

const svg = d3
  .select('#chart-4a')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const colorScale = d3
  .scaleLinear()
  .domain([0, 1])
  .range(['#32CD32', '#FF69B4'])

const opacityScale = d3.scaleLinear().range([0, 1])

const projection = d3.geoAlbersUsa() // .scale(600)
const path = d3.geoPath().projection(projection)

d3.json(require('/data/homework-17/counties_with_election_data.topojson'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(json) {
  const counties = topojson.feature(json, json.objects.us_counties)

  opacityScale.domain([0, 200000])

  svg
    .selectAll('path')
    .data(counties.features)
    .enter()
    .append('path')
    .attr('class', 'county')
    .attr('d', path)
    .attr('fill', 'lightgrey')
    .attr('fill', function(d) {
      const total = +d.properties.clinton + +d.properties.trump

      return colorScale(d.properties.clinton / total)
    })
    .attr('opacity', function(d) {
      const pops = counties.features.map(
        d => +d.properties.clinton + +d.properties.trump
      )
      // console.log(d3.max(pops))
      return opacityScale(+d.properties.clinton + +d.properties.trump)
    })
}
