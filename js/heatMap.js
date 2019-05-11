document.addEventListener('DOMContentLoaded', function() {
  let minta = new XMLHttpRequest();
  minta.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json', true);
  minta.send();
  minta.onload = function() {
    let json = JSON.parse(minta.responseText);
    let data = json.monthlyVariance;
    let textC = ['-7', '7-8', '8-9', '9+'];
    let dataC = [6, 7, 8, 9];
    let bulan = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    // console.log(JSON.stringify(data[0]))
    
    let w = 800;
    let h = 500;
    let padding = 60;
    
    let month = d3.timeParse('%m');
    let year = d3.timeParse('%Y');
    let monthT = d3.timeFormat('%B');
    let floatN = d3.format('.3f')
    
    let startM = d3.min(data, (d) => d.month);
    let endM = d3.max(data, (d) => d.month);
    let startY = d3.min(data, (d) => d.year);
    let endY = d3.max(data, (d) => d.year);
    
    let yScale = d3.scaleLinear()
                   .domain([(startM-0.5), (endM+0.5)])
                   .range([padding, h-padding]);
    let xScale = d3.scaleTime()
                   .domain([year(startY), year(endY)])
                   .range([padding, w-padding]);
    
    let xAxis = d3.axisBottom(xScale);
    let yAxis = d3.axisLeft(yScale).tickFormat((d) => bulan[d-1]);
    
    let svg = d3.select('#chart')
                .append('svg')
                .attr('width', w)
                .attr('height', h);
             svg.append('text')
                .attr('id', 'title')
                .attr('x', w/2)
                .attr('y', 20)
                .text('Heat Map')
                .attr('transform', 'translate(-60, 0)')
                .style('font-size', '2em');
             svg.append('text')
                .attr('id', 'description')
                .attr('x', w/2)
                .attr('y', 40)
                .text('FCC Run Test Heat Map Project')
                .attr('transform', 'translate(-140, 10)')
                .style('font-size', '1.3em');
   
    // console.log(floatN(json.baseTemperature + (data[0].variance)))
    
    const colorFill = (d) => {
      let colorTemp = floatN(json.baseTemperature + (d.variance));      
      let warnaFill = colorTemp < floatN(7) ? 'red':colorTemp < floatN(8) ? 'green':colorTemp < floatN(9) ? 'yellow':colorTemp >= floatN(9) ? 'blue': 'white';
      return warnaFill;
    }
    
    let c = svg.selectAll('rect')
               .data(data)
               .enter()
               .append('rect')
               .attr('class', 'cell')
               .attr('width', (w- 2*padding) / (endY-startY))
               .attr('height', (h - 2*padding) / 12)
               .attr('x', (d) => xScale(year(d.year)))
               .attr('y', (d) => yScale(d.month-0.5))
               .attr('fill', colorFill)
               .attr('data-month', (d) => d.month-1)
               .attr('data-year', (d) => d.year)
               .attr('data-temp', (d) => floatN(json.baseTemperature + (d.variance)));
            svg.append('g')
               .attr('id', 'x-axis')
               .attr('transform', 'translate(0, '+(h-padding)+')').call(xAxis);
            svg.append('g')
               .attr('id', 'y-axis')
               .attr('transform', 'translate('+padding+', 0)').call(yAxis);
    
 //    d3.selectAll(".cell").each(function(d,i) {
 //   console.log("data-yvalue of dot " + i + " is " + d3.select(this).attr("data-temp"))
 // })
    
    const colorBar = (d) => {     
      let warnaB = floatN(d) < floatN(7) ? 'red':floatN(d) < floatN(8) ? 'green':floatN(d) < floatN(9) ? 'yellow':floatN(d) >= floatN(9) ? 'blue': 'white';
      return warnaB;
    }
    
    let legend = svg.append('g')
                    .attr('id', 'legend');
              legend.selectAll('rect')
                    .data(dataC)
                    .enter()
                    .append('rect')
                    .attr('x', w-25)
                    .attr('y', (d, i) => 50+(i*25))
                    .attr('fill', colorBar)
                    .attr('width', 20)
                    .attr('height', 20);
              legend.selectAll('text')
                    .data(textC)
                    .enter()
                    .append('text')
                    .attr('x', w-30)
                    .attr('y', (d, i) => 50+(i*26))
                    .text((d) => d)
                    .attr('transform', 'translate(-18, 14)');
    
    let tooltip = d3.select('#chart')
                    .append('text')
                    .attr('id', 'tooltip')
                    .style('position', 'absolute')
                    .style('visibility', 'hidden');
                   c.on('mouseover', (d) => {
                     tooltip.html('Year: '+d.year+'</br> Month: '+d.month+'</br> Temp: '+floatN(json.baseTemperature + (d.variance))+'deg')
                            .style('top', d3.event.pageY+15+'px')
                            .style('left', d3.event.pageX+15+'px')
                            .style('border-radius', '5px')
                            .style('font-weight', 'bold')
                            .style('color','hsla(360, 64%, 89%, 1)')                            
                            .style('padding', '5px')
                            .style('background-color', 'hsla(299, 88%, 44%, 0.61)')
                            .style('visibility', 'visible')
                     tooltip.attr('data-year', d.year);
                   });
                   c.on('mouseout', (d) => {
                     tooltip.style('visibility', 'hidden');
                   });
  }
})
