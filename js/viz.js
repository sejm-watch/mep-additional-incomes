//dicts
var party_colors = {
  'EPP': {'fill': '#3399FF', 'text': "#FFFFFF"},
  'S&D': {'fill': '#FF0000', 'text': "#FFFFFF"},
  'Renew': {'fill': 'gold', 'text': "#000000"},
  'ID': {'fill': '#2B3856', 'text': "#FFFFFF"},
  'Greens–EFA': {'fill': '#009900', 'text': "#FFFFFF"},
  'Non-inscrits': {'fill': '#999999', 'text': "#000000"},
  'ECR': {'fill': '#0054A5', 'text': "#FFFFFF"},
  'GUE-NGL': {'fill': '#990000', 'text': "#FFFFFF"}
}


function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.2, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y-5).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
};


const median = arr => {
  const mid = Math.floor(arr.length / 2),
    nums = [...arr].sort((a, b) => a - b);
  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};


function draw_column_chart(chart_container_id, tooltip_container, data, x_source, y_source, tooltip_sources, width, height){
  var chart_container = d3.select(chart_container_id)

  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, d3.max(data.map(function(d) {return d[x_source]}))*1.05])
    .range([ 0, width]);

  // Y axis
  var y = d3.scaleBand()
    .range([ 0, height ])
    .domain(data.map(function(d) { return d[y_source]; }))
    .padding(0.25);

  chart_container.select(".y_axis")
    .call(d3.axisLeft(y))

  var bars = chart_container.selectAll("rect")
  bars.transition().duration(300).attr("width", 0)
  bars
    .exit()
    .data(data)
    .enter()
    .append("rect")
    .merge(bars)
    .attr("x", x(0) )
    .attr("y", function(d) {return y(d[y_source]); })
    .attr("width", 0)
    .attr("height", y.bandwidth() )
    .attr("fill", function(d){return Object.keys(party_colors).includes(d[y_source]) ? party_colors[d[y_source]]['fill'] : "#003399"})
    .on("mouseover", function(event, d) {
      tooltip_container.transition()
        .duration(200)
        .style("opacity", .9);
      tooltip_container.html("<b>" + d[tooltip_sources[0]] + "</b> out of <b>" + d[tooltip_sources[1]] + "</b> declared<br/>additional monthly income")
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 28) + "px");
      })
    .on("mouseout", function(d) {
      tooltip_container.transition()
        .duration(300)
        .style("opacity", 0);
    })
    .transition().delay(300).duration(750)
    .attr("width", function(d) { return x(d[x_source]); })
    //.delay(function(d,i){return(i*50)})


  //bar labels
  var bar_labels = chart_container.selectAll(".bar_labels")
  bar_labels.transition().duration(300).style("opacity", 0)
  bar_labels
    .exit()
    .data(data)
    .enter()
    .append("text")
    .merge(bar_labels)
    .attr("class", "bar_labels")
    .attr("x", function(d) { return x(d[x_source]) - 25; } )
    .attr("y", function(d) { return y(d[y_source]) + y.bandwidth()/2 + 8/2; })
    .style("font-size", "11px")
    .style('opacity',0).transition().delay(800).duration(500).style('opacity',1)//.delay(function(d,i){return(400+i*50)})
    .attr("fill", function(d){return Object.keys(party_colors).includes(d[y_source]) ? party_colors[d[y_source]]['text'] : "#FFFFFF"})
    .text(function(d) { return (d[x_source] != 0) ? d3.format(".0%")(d[x_source]) : '';});
}


function draw_cleveland_chart(chart_container_id, tooltip_container, data, x1_source, x2_source, y_source, tooltip_sources, width, height){
  var chart_container = d3.select(chart_container_id)

  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, d3.max(data.map(function(d) {return d[x2_source]}))*1.05])
    .range([ 0, width]);
  chart_container.select(".x_axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x)
      .tickFormat(d3.format(".2s"))
    )

  // Y axis
  var y = d3.scaleBand()
    .range([ 0,height ])
    .domain(data.map(function(d) { return d[y_source]; }))
    .padding(1);
  chart_container.select(".y_axis")
    .call(d3.axisLeft(y))


  //lines
  var lines = chart_container.selectAll(".cleveland_lines")
  lines.transition().duration(300).attr("stroke-width", "0px")
  lines
    .exit()
    .data(data)
    .enter()
    .append("line")
    .merge(lines)
      .attr("class", "cleveland_lines")
      .attr("x1", function(d) { return x(d[x1_source]); })
      .attr("x2", function(d) { return x(d[x1_source]); })
      .attr("y1", function(d) { return y(d[y_source]); })
      .attr("y2", function(d) { return y(d[y_source]); })
      .attr("stroke", "#FFFFFF")
      .transition().delay(100).duration(100)
      .attr("stroke", "#003399")
      .attr("stroke-width", "2px")
      .transition().delay(100).duration(750)
        .attr("x2", function(d) { return x(d[x2_source]); })//.delay(function(d,i){return(400+i*50)})


  var circles1 = chart_container.selectAll(".circles1")
  circles1.transition().duration(300).attr("r", 0)
  circles1
    .exit()
    .data(data)
    .enter()
    .append("circle")
    .merge(circles1)
      .on("mouseover", function(event, d) {
        tooltip_container.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip_container.html("from <b>" + (isNaN(d[tooltip_sources[0]]) ? '' : Math.round(d[tooltip_sources[0]]/100)/10) + "</b> up to <b>" + (isNaN(d[tooltip_sources[1]]) ? '' : Math.round(d[tooltip_sources[1]]/100)/10) + " kEUR</b><br/>additional monthly income")
          .style("left", (event.pageX) + "px")
          .style("top", (event.pageY - 28) + "px");
        })
      .on("mouseout", function(d) {
        tooltip_container.transition()
          .duration(300)
          .style("opacity", 0);
      })
      .attr("class", "circles1")
      .attr("cx", function(d) { return x(d[x1_source]); })
      .attr("cy", function(d) { return y(d[y_source]); })
      .attr("r", 0)
      .transition().delay(100).duration(300)
      .attr("r", "4")
      .style("fill", "#FFCC00")
      .style("stroke", "#003399")


  var circles2 = chart_container.selectAll(".circles2")
  circles2.transition().duration(300).attr("r", 0)
  circles2
    .exit()
    .data(data)
    .enter()
    .append("circle")
    .merge(circles2)
      .on("mouseover", function(event, d) {
        tooltip_container.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip_container.html("from <b>" + (isNaN(d[tooltip_sources[0]]) ? '' : Math.round(d[tooltip_sources[0]]/100)/10) + "</b> up to <b>" + (isNaN(d[tooltip_sources[1]]) ? '' : Math.round(d[tooltip_sources[1]]/100)/10) + " kEUR</b><br/>additional monthly income")
          .style("left", (event.pageX) + "px")
          .style("top", (event.pageY - 28) + "px");
        })
      .on("mouseout", function(d) {
        tooltip_container.transition()
          .duration(300)
          .style("opacity", 0);
      })
      .attr("class", "circles2")
      .attr("cx", function(d) { return x(d[x1_source]); })
      .attr("cy", function(d) { return y(d[y_source]); })
      .attr("r", 0)
      .transition().delay(100).duration(200)
      .attr("r", "8")
      .style("fill", "#6699ff")
      .style("stroke", "#003399")
      .transition().delay(0).duration(750)
        .attr("cx", function(d) { return x(d[x2_source]); })//.delay(function(d,i){return(400+i*50)})

  var cleveland_labels = chart_container.selectAll(".cleveland_labels")
  cleveland_labels.transition().duration(300).style("opacity", 0)
  cleveland_labels
    .exit()
    .data(data)
    .enter()
    .append("text")
    .merge(cleveland_labels)
      .attr("class", "cleveland_labels")
      .attr("x", function(d) { return isNaN(d[x2_source]) ? 0 : x(d[x2_source]) + 12; } )
      .attr("y", function(d) { return y(d[y_source]) + 4.5; })
      .style("font-size", "11px")
      .style('opacity',0).transition().delay(750).duration(500).style('opacity',1)//.delay(function(d,i){return(400+i*50)})
      .attr("fill", "#000000")
      .text(function(d) { return isNaN(d[x2_source]) ? '' : Math.round(d[x2_source]/100)/10 + " kEUR"});

}





function draw_lollipop_chart(chart_container_id, tooltip_container, data, x_source, y_source, tooltip_sources, width, height){
  var chart_container = d3.select(chart_container_id)

  // X axis
  var x = d3.scaleBand()
    .range([ 0,width ])
    .domain(data.map(function(d) { return d[x_source]; }))
    .padding(1);
  chart_container.select(".x_axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))

  chart_container.selectAll('.tick text')
    .attr("font-size", "7px")
    .call(wrap, x.bandwidth());
    //text.split(" ").join("\n")

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, d3.max(data.map(function(d) {return d[y_source]}))*1.2])
    .range([height, 0]);
  chart_container.select(".y_axis")
    .call(d3.axisLeft(y)
      .tickFormat(d3.format(".2s"))
    )

  //lines
  var lines = chart_container.selectAll(".cleveland_lines")
  lines.transition().duration(300).attr("stroke-width", "0px")
  lines
    .exit()
    .data(data)
    .enter()
    .append("line")
    .merge(lines)
      .attr("class", "cleveland_lines")
      .attr("x1", function(d) { return x(d[x_source]); })
      .attr("x2", function(d) { return x(d[x_source]); })
      .attr("y1", function(d) { return y(0); })
      .attr("y2", function(d) { return y(0); })
      .attr("stroke", "#FFFFFF")
      .transition().delay(100).duration(100)
      .attr("stroke", function(d){return Object.keys(party_colors).includes(d['eu_party']) ? party_colors[d['eu_party']]['fill'] : "#003399"})
      .attr("stroke-width", "5px")
      .transition().delay(0).duration(750)
        .attr("y2", function(d) { return y(d[y_source]); })

  var r_photo = 40
  var defs = chart_container.append('svg:defs');
  data.forEach(function(d, i){
      defs.append("svg:pattern")
        .attr("id", "profile_photo" + i)
        .attr("width", r_photo)
        .attr("height", r_photo)
        .append("svg:image")
        .attr("xlink:href", d.dep_photo_url)
        .attr("width", r_photo)
        .attr("height", r_photo)
        .attr("x", 0)
        .attr("y", 0);
  })


  var circles = chart_container.selectAll(".circles")
  circles.transition().duration(300).attr("r", 0)
  circles
    .exit()
    .data(data)
    .enter()
    .append("circle")
    .merge(circles)
      .on("mouseover", function(event, d) {
        tooltip_container.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip_container.html("from <b>" + (isNaN(d[tooltip_sources[0]]) ? '' : Math.round(d[tooltip_sources[0]]/100)/10) + "</b> up to <b>" + (isNaN(d[tooltip_sources[1]]) ? '' : Math.round(d[tooltip_sources[1]]/100)/10) + " kEUR</b><br/>additional monthly income")
          .style("left", (event.pageX) + "px")
          .style("top", (event.pageY - 28) + "px");
        })
      .on("mouseout", function(d) {
        tooltip_container.transition()
          .duration(300)
          .style("opacity", 0);
      })
      .attr("class", "circles")
      .attr("cx", function(d) { return x(d[x_source]); })
      .attr("cy", function(d) { return y(d[y_source]); })
      .style("fill", function(d, i){return "url(#profile_photo" + i + ")"})
      .attr("r", 0)
      .transition().delay(750).duration(250)
      .attr("r", r_photo/2)
      .style("stroke", function(d){return Object.keys(party_colors).includes(d['eu_party']) ? party_colors[d['eu_party']]['fill'] : "#003399"});
}




var toggle_status = 'country'

function toggle_country_party_charts(){
  var toggle = document.getElementById("toggle-button");
  if (toggle.checked && toggle_status=='country'){
    toggle_status = 'party'
    d3.select("#label_by_party").transition().duration(300).style("fill", "#000000")
    d3.select("#label_by_country").transition().duration(300).style("fill", "#AAAAAA")

    draw_column_chart("#top_left_chart", div_tooltip, party_income, 'perc_deputies_additionally_paid', 'eu_party', ['deputies_additionally_paid','deputies_count'], top_left_width, top_left_height)
    draw_cleveland_chart("#top_middle_chart", div_tooltip, party_income, 'median_salary_min', 'median_salary_max', 'eu_party', ['median_salary_min', 'median_salary_max'], top_middle_width, top_middle_height)
  }
  else if (!toggle.checked && toggle_status=='party') {
    toggle_status = 'country'
    d3.select("#label_by_party").transition().duration(300).style("fill", "#AAAAAA")
    d3.select("#label_by_country").transition().duration(300).style("fill", "#000000")

    draw_column_chart("#top_left_chart", div_tooltip, country_income, 'perc_deputies_additionally_paid', 'country', ['deputies_additionally_paid','deputies_count'], top_left_width, top_left_height)
    draw_cleveland_chart("#top_middle_chart", div_tooltip, country_income, 'median_salary_min', 'median_salary_max', 'country', ['median_salary_min', 'median_salary_max'], top_middle_width, top_middle_height)
  }
}
