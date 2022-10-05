fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
.then(res => res.json())
.then(data => {
    
    document.getElementById('title').innerText = 'Doping in Professional Bicycle Racing'

    let dataArr = []

    for (let dat of data) {
      dataArr.push({ Year: dat.Year})
    }

    console.log(dataArr)

    const w = 1200
    const h = 500
    const padding = 50

    function toTime(time) {
      return new Date(`2000-01-01 10:${time}`)
    }


    const minX = d3.min(data, d => new Date(d.Year - 1))
    const maxX = d3.max(data, d => new Date(d.Year + 1))

    const minY = d3.min(data, d => toTime(d.Time))
    const maxY = d3.max(data, d => toTime(d.Time))

    const xScale = d3.scaleLinear()
                    .domain([minX, maxX])
                    .range([padding, w - padding])

    const yScale = d3.scaleLinear()
                    .domain([minY, maxY])
                    .range([h - padding, padding])


    const svg = d3.select('div')
                .append('svg')
                .attr('width', w)
                .attr('height', h)

    svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(new Date(d.Year)))
        .attr('cy', d => yScale(toTime(d.Time)))
        .attr('r', 7)
        .attr('class', 'dot')
        .style('fill', d => {
          if (d.Doping === "") {
            return '#ff9c00'
          } return '#1778f2'
        })
        .append('title')
        .text(d => `${d.Name}, ${d.Nationality}\nYear: ${d.Year}, Time: ${d.Time}\n${d.Doping}`)

    const text = d3.select('div')
                  .append('ul')
                  .selectAll('li')
                  .data(['No doping allegations', 'Riders with doping allegations'])
                  .enter()
                  .append('li')
                  .style('position', 'absolute')
                  .style('top', (d, i) => `${400 + (i * 20)}px`)
                  .style('left', '900px')
                  .style('list-style', 'none')
                  .style('text-align', 'rigth')
                  .style('color', (d, i) => {
                    if (i === 0) {
                      return '#ff9c00'
                    } return '#1778f2'
                  })
                  .text(d => d)

    let minAndSec = d3.timeFormat("%M:%S")
    let year = d3.timeFormat('%Y')

    let xAxis = d3.axisBottom(xScale).tickFormat(year)
    let yAxis = d3.axisLeft(yScale).tickFormat(minAndSec)
 
    svg.append('g')
        .attr('transform', `translate(0, ${h - padding})`)
        .call(xAxis)
 
    svg.append('g')
        .attr('transform', `translate(${padding}, 0)`)
        .call(yAxis)

})