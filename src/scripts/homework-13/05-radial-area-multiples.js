import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }

const height = 450 - margin.top - margin.bottom

const width = 850 - margin.left - margin.right

const svg = d3
  .select('#chart-5')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec'
]

const angleScale = d3
  .scaleBand()
  .domain(months)
  .range([0, Math.PI * 2])

const radius = 65

const radiusScale = d3
  .scaleLinear()
  .domain([0, 100])
  .range([25, radius])

const line = d3
  .radialArea()
  .angle(d => angleScale(d.month_name))
  .innerRadius(d => radiusScale(d.low_temp))
  .outerRadius(d => radiusScale(d.high_temp))

const xPositionScale = d3
  .scalePoint()
  .range([0, width])
  .padding(0.3)

d3.csv(require('/data/homework-13/all-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  const nested = d3
    .nest()
    .key(function(d) {
      return d.city
    })
    .entries(datapoints)

  const names = datapoints.map(d => d.city)
  xPositionScale.domain(names)

  svg
    .selectAll('.pie')
    .data(nested)
    .enter()
    .append('g')
    .attr('transform', function(d) {
      const x = xPositionScale(d.key)
      return 'translate (' + x + ',' + height / 2 + ')'
    })
    .each(function(d) {
      const name = d.key
      const datapoints = d.values
      console.log(datapoints)
      const container = d3.select(this)

      datapoints.push(datapoints[0])

      container
        .append('path')
        .datum(datapoints)
        .attr('d', line)
        .attr('fill', '#CD5C5C')
        .attr('stroke', 'none')
        .attr('opacity', 0.5)

      container
        .append('text')
        .text(name)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('font-weight', '600')
        .style('font-size', 12)

      const bands = [20, 40, 60, 80, 100]
      // Draw a circle for each item in bands
      container
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

      const bandLabels = [20, 60, 100]

      container
        .selectAll('.label')
        .data(bandLabels)
        .enter()
        .append('text')
        .text(d => d + '°')
        .attr('y', d => -radiusScale(d))
        .attr('dy', -2)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .style('font-size', 8)
    })

  svg
    .append('text')
    .text('Average Monthly Temperatures')
    .attr('font-weight', '700')
    .attr('text-anchor', 'middle')
    .attr('x', width / 2)
    .attr('y', 20)
    .style('font-size', 26)

  svg
    .append('text')
    .text('in cities around the world')
    .attr('text-anchor', 'middle')
    .attr('x', width / 2)
    .attr('y', 50)
    .style('font-size', 16)
}
