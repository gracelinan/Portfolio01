// import * as d3 from 'd3'

// const margin = { top: 20, left: 0, right: 0, bottom: 0 }

// const height = 330 - margin.top - margin.bottom
// const width = 275 - margin.left - margin.right

// const container = d3.select('#chart-9')

// const angleScale = d3.scaleBand().range([0, Math.PI * 2])

// const radius = 100

// const radiusScale = d3
//   .scaleLinear()
//   .domain([0, 10])
//   .range([0, radius])

// const line = d3
//   .radialArea()
//   .angle(d => angleScale(d.name))
//   .innerRadius(0)
//   .outerRadius(d => radiusScale(d.value))

// d3.csv(require('/data/homework-13/nba.csv'))
//   .then(ready)
//   .catch(err => console.log('Failed with', err))

// function ready(datapoints) {

//   const maxMinutes = 60
//   const maxPoints = 30
//   const max3Point = 5
//   const maxRebounds = 15
//   const maxSteals = 5
//   const maxBlocks = 5

//   const customDatapoints = [
//     { name: 'Minutes', value: (datapoints.MP / maxMinutes) * 10 },
//     { name: 'Points', value: (datapoints.PTS / maxPoints) * 10 },
//     { name: 'Field Goals', value: datapoints.FG },
//     { name: '3-Point Field Goals', value: (datapoints['3P'] / max3Point) * 10 },
//     { name: 'Free Throws', value: datapoints.FT },
//     { name: 'Rebounds', value: (datapoints.TRB / maxRebounds) * 10 },
//     { name: 'Assists', value: datapoints.AST },
//     { name: 'Steals', value: (datapoints.STL / maxSteals) * 10 },
//     { name: 'Blocks', value: (datapoints.BLK / maxBlocks) * 10 }
//   ]

//   const categories = customDatapoints.map(d => d.name)
//   angleScale.domain(categories)

//   container
//      .selectAll('svg')
//     .data(datapoints)
//     .enter()
//    .append('svg')
//      .attr('height', height + margin.top + margin.bottom)
//      .attr('width', width + margin.left + margin.right)
//   .append('g')
//    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
//      .append('g')
//    .attr('transform', `translate(${width / 2},${height / 2})`)
//    .each(function(d) {
//       console.log(datapoints)
//        const svg = d3.select(this)
      
//   const bands = [2, 4, 6, 8, 10]
//   // Draw a circle for each item in bands
//   svg
//     .selectAll('.band')
//     .data(bands)
//     .enter()
//     .append('circle')
//     .attr('fill', 'none')
//     .attr('stroke', 'lightgrey')
//     .attr('r', function(d) {
//       return radiusScale(d)
//     })
//     .attr('fill', function(d, i) {
//       console.log('Looking at circle number', i % 2)
//       if (i % 2 === 0) {
//         return '#c94435'
//       } else {
//         return '#FFB81C'
//       }
//     })
//     //.attr('mask', 'url(#playerMask)')
//     .lower()
    
//     // svg
//     // .selectAll('.band')
//     // .data(bands)
//     // .enter()
//     // .append('circle')
//     // .attr('fill', 'none')
//     // .attr('stroke', 'lightgrey')
//     // .attr('r', function(d) {
//     //   return radiusScale(d)
//     // })
//     // .attr('fill', function(d, i) {
//     //   console.log('Looking at circle number', i % 2)
//     //   if (i % 2 === 0) {
//     //     return '#e8e7e5'
//     //   } else {
//     //     return '#f6f6f6'
//     //   }
//     // })
//     // .lower()

//     svg.
//     append('text').text('0')
//     .attr('text-anchor', 'middle')
//     .attr('alignment-baseline', 'middle')

//     svg
//     .selectAll('.outside-label')
//     .data(angleScale.domain())
//     .enter()
//     .append('text')
//     .attr('font-weight', '700')
//     .text(d => d)
//     .attr('y', -radius) // set it up at the top of the chart
//     .attr('dy', -15) // give a little offset to push it higher
//     .attr('transform', function(d) {
//       return `rotate(${(angleScale(d) * 180) / Math.PI})`
//     })
//     .attr('text-anchor', 'middle')
//     .attr('alignment-baseline', 'middle')
//     .style('font-size', 10)

//     svg
//     .append('mask')
//     .datum(customDatapoints, function (d, i) {
//       console.log(customDatapoints[i])
//       return customDatapoints[i]})
//     .attr('id', d.Name.replace(' ', '-'))
//     .append('path')
//     .attr('d', line)
//     .attr('fill', 'white')
//     .attr('stroke', 'white')

//       })
// }
