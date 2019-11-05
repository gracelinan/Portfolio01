import * as d3 from 'd3'

const margin = { top: 100, left: 50, right: 150, bottom: 30 }

const height = 700 - margin.top - margin.bottom

const width = 600 - margin.left - margin.right

const svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const parseTime = d3.timeParse('%B-%y')

const xPositionScale = d3.scaleLinear().range([0, width])
const yPositionScale = d3.scaleLinear().range([height, 0])

const colorScale = d3
  .scaleOrdinal()
  .range([
    '#8dd3c7',
    '#ffffb3',
    '#bebada',
    '#fb8072',
    '#80b1d3',
    '#fdb462',
    '#b3de69',
    '#fccde5',
    '#d9d9d9',
    '#bc80bd'
  ])

const line = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.datetime)
  })
  .y(function(d) {
    return yPositionScale(d.price)
  })

d3.csv(require('/data/homework-15/housing-prices.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  datapoints.forEach(d => {
    d.datetime = parseTime(d.month)
  })
  const dates = datapoints.map(d => d.datetime)
  const prices = datapoints.map(d => +d.price)

  xPositionScale.domain(d3.extent(dates))
  yPositionScale.domain(d3.extent(prices))

  const nested = d3
    .nest()
    .key(function(d) {
      return d.region
    })
    .entries(datapoints)

  d3.select('#opening').on('stepin', function() {
    svg.selectAll('.region-line').style('visibility', 'hidden')
    svg.selectAll('.region-circle').style('visibility', 'hidden')
    svg.selectAll('.path-text').style('visibility', 'hidden')
    svg.select('rect').style('visibility', 'hidden')
  })

  d3.select('#drawLines').on('stepin', function() {
    svg
      .selectAll('.region-line')
      .attr('stroke', function(d) {
        return colorScale(d.key)
      })
      .style('visibility', 'visible')
    svg
      .selectAll('.region-circle')
      .attr('fill', function(d) {
        return colorScale(d.key)
      })
      .style('visibility', 'visible')
    svg
      .selectAll('.path-text')
      .attr('fill', 'black')
      .attr('font-weight', '400')
      .style('visibility', 'visible')
    svg.select('rect').style('visibility', 'hidden')
  })

  d3.select('#highlightUS').on('stepin', function() {
    svg.selectAll('.region-line').attr('stroke', d => {
      if (d.key === 'U.S.') {
        return 'red'
      } else {
        return 'lightgrey'
      }
    })
    svg.selectAll('.region-circle').attr('fill', d => {
      if (d.key === 'U.S.') {
        return 'red'
      } else {
        return 'lightgrey'
      }
    })
    svg
      .selectAll('.path-text')
      .attr('fill', d => {
        if (d.key === 'U.S.') {
          return 'red'
        } else {
          return 'lightgrey'
        }
      })
      .attr('font-weight', d => {
        if (d.key === 'U.S.') {
          return '700'
        } else {
          return '400'
        }
      })
    svg.select('rect').style('visibility', 'hidden')
  })

  d3.select('#highlightOthers').on('stepin', function() {
    svg.selectAll('.region-line').attr('stroke', d => {
      if (d.key === 'U.S.') {
        return 'red'
      }
      if (d.key === 'Mountain') {
        return 'skyblue'
      }
      if (d.key === 'Pacific') {
        return 'skyblue'
      }
      if (d.key === 'West South Central') {
        return 'skyblue'
      }
      if (d.key === 'South Atlantic') {
        return 'skyblue'
      } else {
        return 'lightgrey'
      }
    })
    svg.selectAll('.region-circle').attr('fill', d => {
      if (d.key === 'U.S.') {
        return 'red'
      }
      if (d.key === 'Mountain') {
        return 'skyblue'
      }
      if (d.key === 'Pacific') {
        return 'skyblue'
      }
      if (d.key === 'West South Central') {
        return 'skyblue'
      }
      if (d.key === 'South Atlantic') {
        return 'skyblue'
      } else {
        return 'lightgrey'
      }
    })
    svg
      .selectAll('.path-text')
      .attr('fill', d => {
        if (d.key === 'U.S.') {
          return 'red'
        }
        if (d.key === 'Mountain') {
          return 'skyblue'
        }
        if (d.key === 'Pacific') {
          return 'skyblue'
        }
        if (d.key === 'West South Central') {
          return 'skyblue'
        }
        if (d.key === 'South Atlantic') {
          return 'skyblue'
        } else {
          return 'lightgrey'
        }
      })
      .attr('font-weight', d => {
        if (d.key === 'U.S.') {
          return '700'
        } else {
          return '400'
        }
      })
    svg.select('rect').style('visibility', 'hidden')
  })

  d3.select('#showWinter').on('stepin', function() {
    svg.select('rect').style('visibility', 'visible')
  })

  svg
    .selectAll('path')
    .data(nested)
    .enter()
    .append('path')
    .attr('class', 'region-line')
    // .attr('class', d => {
    //    return d.key.toLowerCase().replace(/[^a-z]*/g, '')
    // })
    .attr('d', function(d) {
      return line(d.values)
    })
    .attr('stroke', function(d) {
      return colorScale(d.key)
    })
    .attr('stroke-width', 2)
    .attr('fill', 'none')

  svg
    .selectAll('circle')
    .data(nested)
    .enter()
    .append('circle')
    .attr('class', 'region-circle')
    // .attr('class', d => {
    //   return d.key.toLowerCase().replace(/[^a-z]*/g, '')
    // })
    .attr('fill', function(d) {
      return colorScale(d.key)
    })
    .attr('r', 4)
    .attr('cy', function(d) {
      return yPositionScale(d.values[0].price)
    })
    .attr('cx', function(d) {
      return xPositionScale(d.values[0].datetime)
    })

  svg
    .selectAll('text')
    .data(nested)
    .enter()
    .append('text')
    .attr('class', 'path-text')
    // .attr('class', d => {
    //   return d.key.toLowerCase().replace(/[^a-z]*/g, '')
    // })
    .attr('y', function(d) {
      return yPositionScale(d.values[0].price)
    })
    .attr('x', function(d) {
      return xPositionScale(d.values[0].datetime)
    })
    .text(function(d) {
      return d.key
    })
    .attr('dx', 6)
    .attr('dy', 4)
    .attr('font-size', '12')

  svg
    .append('text')
    .attr('font-size', '24')
    .attr('text-anchor', 'middle')
    .text('U.S. housing prices fall in winter')
    .attr('class', 'title')
    .attr('x', width / 2)
    .attr('y', -40)
    .attr('dx', 40)

  const rectWidth =
    xPositionScale(parseTime('February-17')) -
    xPositionScale(parseTime('November-16'))

  svg
    .append('rect')
    .attr('x', xPositionScale(parseTime('December-16')))
    .attr('y', 0)
    .attr('width', rectWidth)
    .attr('height', height)
    .attr('fill', '#C2DFFF')
    .lower()

  const xAxis = d3
    .axisBottom(xPositionScale)
    .tickFormat(d3.timeFormat('%b %y'))
    .ticks(9)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  const yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)

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
      .selectAll('path')
      .data(nested)
      .attr('d', function(d) {
        return line(d.values)
      })

    svg
      .selectAll('circle')
      .data(nested)
      .attr('cy', function(d) {
        return yPositionScale(d.values[0].price)
      })
      .attr('cx', function(d) {
        return xPositionScale(d.values[0].datetime)
      })

    svg
      .selectAll('.path-text')
      .data(nested)
      .attr('y', function(d) {
        return yPositionScale(d.values[0].price)
      })
      .attr('x', function(d) {
        return xPositionScale(d.values[0].datetime)
      })

    svg.select('.title').attr('x', newWidth / 2)

    const rectNewWidth =
      xPositionScale(parseTime('February-17')) -
      xPositionScale(parseTime('November-16'))

    svg
      .select('rect')
      .attr('x', xPositionScale(parseTime('December-16')))
      .attr('y', 0)
      .attr('width', rectNewWidth)
      .attr('height', newHeight)

    // Update axes
    svg.select('.x-axis').call(xAxis)
    svg.select('.y-axis').call(yAxis)
  }

  // When the window resizes, run the function
  // that redraws everything
  window.addEventListener('resize', render)

  // And now that the page has loaded, let's just try
  // to do it once before the page has resized
  render()
}
