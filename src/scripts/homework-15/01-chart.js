import * as d3 from 'd3'
// import * as debounce from 'debounce'

const margin = {
  top: 30,
  right: 20,
  bottom: 30,
  left: 50
}

const width = 700 - margin.left - margin.right
const height = 400 - margin.top - margin.bottom

const svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const xPositionScale = d3.scaleBand().range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([0, 85])
  .range([height, 0])

const colorScale = d3
  .scaleOrdinal()
  .range([
    '#8dd3c7',
    '#ffffb3',
    '#bebada',
    '#fb8072',
    '#80b1d3',
    '#fdb462',
    '#b3de69'
  ])

d3.csv(require('/data/homework-15/countries.csv')).then(ready)

function ready(datapoints) {
  // Sort the countries from low to high
  datapoints = datapoints.sort((a, b) => {
    return a.life_expectancy - b.life_expectancy
  })

  // And set up the domain of the xPositionScale
  // using the read-in data
  const countries = datapoints.map(d => d.country)
  xPositionScale.domain(countries)

  /* Add your rectangles here */

  d3.select('#requirements').on('stepin', function() {
    svg.selectAll('rect').attr('fill', 'lightgrey')
  })

  d3.select('#asia-step').on('stepin', () => {
    svg.selectAll('rect').attr('fill', 'lightgrey')
    svg.selectAll('.asia').attr('fill', '#4cc1fc')
  })

  d3.select('#africa-step').on('stepin', () => {
    svg.selectAll('rect').attr('fill', 'lightgrey')
    svg.selectAll('.africa').attr('fill', '#4cc1fc')
  })

  d3.select('#na-step').on('stepin', () => {
    svg.selectAll('rect').attr('fill', 'lightgrey')
    svg.selectAll('.namerica').attr('fill', '#4cc1fc')
  })

  d3.select('#low-gdp-step').on('stepin', () => {
    svg.selectAll('rect').attr('fill', d => {
      if (d.gdp_per_capita < 3000) {
        return '#4cc1fc'
      } else {
        return 'lightgrey'
      }
    })
  })

  d3.select('#continent-step').on('stepin', () => {
    svg.selectAll('rect').attr('fill', d => {
      return colorScale(d.continent)
    })
  })

  d3.select('#reset-step').on('stepin', function() {
    svg.selectAll('rect').attr('fill', 'lightgrey')
  })

  svg
    .selectAll('rect')
    .data(datapoints)
    .enter()
    .append('rect')
    .attr('width', xPositionScale.bandwidth())
    .attr('height', d => {
      return height - yPositionScale(d.life_expectancy)
    })
    .attr('x', d => {
      return xPositionScale(d.country)
    })
    .attr('y', d => {
      return yPositionScale(d.life_expectancy)
    })
    .attr('fill', 'lightgrey')
    .attr('class', d => {
      return d.continent.toLowerCase().replace(/[^a-z]*/g, '')
    })

  svg
    .append('text')
    .text('higher GDP ⟶')
    .attr('class', 'gdp-note')
    .attr('text-anchor', 'middle')
    .attr('font-size', 12)
    .attr('x', width * 0.75)
    .attr('y', height + 15)

  svg
    .append('text')
    .text('⟵ lower GDP')
    .attr('class', 'gdp-note2')
    .attr('text-anchor', 'middle')
    .attr('font-size', 12)
    .attr('x', width * 0.25)
    .attr('y', height + 15)

  const yAxis = d3
    .axisLeft(yPositionScale)
    .tickSize(-width)
    .ticks(5)
    .tickFormat(d => (d === 80 ? '80 years' : d))

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
    .lower()

  d3.select('.y-axis .domain').remove()

  function render() {
    const svgContainer = svg.node().closest('div')
    const svgWidth = svgContainer.offsetWidth
    // Do you want it to be full height? Pick one of the two below
    const svgHeight = height + margin.top + margin.bottom
    // const svgHeight = window.innerHeight

    const actualSvg = d3.select(svg.node().closest('svg'))
    actualSvg.attr('width', svgWidth).attr('height', svgHeight)

    const newWidth = svgWidth - margin.left - margin.right
    const newHeight = svgHeight - margin.top - margin.bottom

    // Update our scale
    xPositionScale.range([0, newWidth])
    yPositionScale.range([newHeight, 0])

    // Update things you draw
    svg
      .selectAll('rect')
      .attr('width', xPositionScale.bandwidth())
      .attr('height', d => {
        return height - yPositionScale(d.life_expectancy)
      })
      .attr('x', d => {
        return xPositionScale(d.country)
      })
      .attr('y', d => {
        return yPositionScale(d.life_expectancy)
      })

    svg.select('.gdp-note').attr('x', newWidth * 0.75)

    svg.select('.gdp-note2').attr('x', newWidth * 0.25)

    // Update axes
    svg.select('.x-axis').call(xAxis)
    svg.select('.y-axis').call(yAxis)
    d3.select('.y-axis .domain').remove()
  }

  // When the window resizes, run the function
  // that redraws everything
  window.addEventListener('resize', render)

  // And now that the page has loaded, let's just try
  // to do it once before the page has resized
  render()
}
