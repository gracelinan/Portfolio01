import * as d3 from 'd3'

const margin = { top: 0, left: 0, right: 0, bottom: 0 }
const height = 600 - margin.top - margin.bottom
const width = 600 - margin.left - margin.right

const svg = d3
  .select('#chart-7')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  .append('g')
  .attr('transform', `translate(${width / 2},${height / 2})`)

// Create a time parser
const parseTime = d3.timeParse('%H-%M')

const angleScale = d3.scaleBand().range([0, Math.PI * 2])

const radius = 150

const radiusScale = d3
  .scaleLinear()
  .domain([0, 5])
  .range([0, radius])

const colorScale = d3.scaleOrdinal().range(['blue', 'brown'])

const line = d3
  .radialArea()
  .angle(d => angleScale(d.timeParse))
  .innerRadius(0)
  .outerRadius(d => radiusScale(d.total))
// .innerRadius(d => radiusScale(d.total))
// .outerRadius(200)

d3.csv(require('/data/homework-13/time-binned.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  datapoints.forEach(function(d) {
    d.timeParse = parseTime(d.time)
  })
  // Update your scales
  const times = datapoints.map(d => d.timeParse)
  angleScale.domain(times)

  datapoints.push(datapoints[0])

  svg
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('fill', 'none')
    .attr('stroke', 'black')

  svg
    .append('circle')
    .datum(datapoints)
    .attr('r', 3)
    .attr('fill', 'grey')
    .attr('cx', angleScale(parseTime(d.time)))
    .attr('cy', function(d) {
      console.log(d)
      return radiusScale(d.total)
    })

  let bands = [
    '00:00',
    '01:00',
    '02:00',
    '03:00',
    '04:00',
    '05:00',
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00',
    '00:00'
  ]

  svg
    .selectAll('.band')
    .data(bands)
    .enter()
    .append('circle')
    .attr('fill', 'none')
    .attr('stroke', 'lightgrey')
    .attr('r', radius)
    .lower()
}
