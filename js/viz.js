//dicts
var party_colors = {
  'EPP': {'fill': '#3399FF', 'text': "#FFFFFF"},
  'S&D': {'fill': '#FF0000', 'text': "#FFFFFF"},
  'Renew': {'fill': '#FFD700', 'text': "#000000"},
  'ID': {'fill': '#2B3856', 'text': "#FFFFFF"},
  'Greens–EFA': {'fill': '#009900', 'text': "#FFFFFF"},
  'Non-inscrits': {'fill': '#999999', 'text': "#000000"},
  'ECR': {'fill': '#0054A5', 'text': "#FFFFFF"},
  'GUE-NGL': {'fill': '#990000', 'text': "#FFFFFF"}
}

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};


const pSBC=(p,c0,c1,l)=>{
	let r,g,b,P,f,t,h,i=parseInt,m=Math.round,a=typeof(c1)=="string";
	if(typeof(p)!="number"||p<-1||p>1||typeof(c0)!="string"||(c0[0]!='r'&&c0[0]!='#')||(c1&&!a))return null;
	if(!this.pSBCr)this.pSBCr=(d)=>{
		let n=d.length,x={};
		if(n>9){
			[r,g,b,a]=d=d.split(","),n=d.length;
			if(n<3||n>4)return null;
			x.r=i(r[3]=="a"?r.slice(5):r.slice(4)),x.g=i(g),x.b=i(b),x.a=a?parseFloat(a):-1
		}else{
			if(n==8||n==6||n<4)return null;
			if(n<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(n>4?d[4]+d[4]:"");
			d=i(d.slice(1),16);
			if(n==9||n==5)x.r=d>>24&255,x.g=d>>16&255,x.b=d>>8&255,x.a=m((d&255)/0.255)/1000;
			else x.r=d>>16,x.g=d>>8&255,x.b=d&255,x.a=-1
		}return x};
	h=c0.length>9,h=a?c1.length>9?true:c1=="c"?!h:false:h,f=pSBCr(c0),P=p<0,t=c1&&c1!="c"?pSBCr(c1):P?{r:0,g:0,b:0,a:-1}:{r:255,g:255,b:255,a:-1},p=P?p*-1:p,P=1-p;
	if(!f||!t)return null;
	if(l)r=m(P*f.r+p*t.r),g=m(P*f.g+p*t.g),b=m(P*f.b+p*t.b);
	else r=m((P*f.r**2+p*t.r**2)**0.5),g=m((P*f.g**2+p*t.g**2)**0.5),b=m((P*f.b**2+p*t.b**2)**0.5);
	a=f.a,t=t.a,f=a>=0||t>=0,a=f?a<0?t:t<0?a:a*P+t*p:0;
	if(h)return"rgb"+(f?"a(":"(")+r+","+g+","+b+(f?","+m(a*1000)/1000:"")+")";
	else return"#"+(4294967296+r*16777216+g*65536+b*256+(f?m(a*255):0)).toString(16).slice(1,f?undefined:-2)
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


function calculate_category_income(toggle_status, variant_status){
  var category_income = [];
  organization_categories.forEach(function(o){
    var org_deputies = deputies_income.filter(x => x[o + "_salary_max"] != 0 && x.remuneration_type != "previous_occupations");
    if(variant_status!='all'){org_deputies = org_deputies.filter(x => x[toggle_status] == variant_status);}

    var deputies_count = org_deputies.length;
    var deputies_additionally_paid = org_deputies.filter(x => parseInt(x[o + "_salary_max"]) > 0).length;
    var perc_deputies_additionally_paid = deputies_additionally_paid/deputies_count

    var occupations_count = org_deputies.map(x => parseInt(x.occupations_count)).reduce((a, b) => a + b, 0);
    var paid_occupations_count = org_deputies.map(x => parseInt(x.paid_occupations_count)).reduce((a, b) => a + b, 0);

    var total_salary_min = org_deputies.map(x => parseInt(x[o + "_salary_min"])).reduce((a, b) => a + b, 0)
    var total_salary_max = org_deputies.map(x => parseInt(x[o + "_salary_max"])).reduce((a, b) => a + b, 0)

    var avg_salary_min = org_deputies.map(x => parseInt(x[o + "_salary_min"])).reduce((a, b) => a + b, 0)/deputies_count;
    var avg_salary_max = org_deputies.map(x => parseInt(x[o + "_salary_max"])).reduce((a, b) => a + b, 0)/deputies_count;

    var median_salary_min = median(org_deputies.filter(x => parseInt(x[o + "_salary_min"]) > 0).map(x => parseInt(x[o + "_salary_min"])))
    var median_salary_max = median(org_deputies.filter(x => parseInt(x[o + "_salary_max"]) > 0).map(x => parseInt(x[o + "_salary_max"])))

    category_income.push({
      'organization_category': o,
      'deputies_count': deputies_count,
      'deputies_additionally_paid': deputies_additionally_paid,
      'perc_deputies_additionally_paid': perc_deputies_additionally_paid,
      'occupations_count': occupations_count,
      'paid_occupations_count': paid_occupations_count,
      'total_salary_min': total_salary_min,
      'total_salary_max': total_salary_max,
      'avg_salary_min': avg_salary_min,
      'avg_salary_max': avg_salary_max,
      'median_salary_min': median_salary_min,
      'median_salary_max': median_salary_max
    })
  });
  category_income = category_income.filter(x => parseInt(x["total_salary_max"]) > 0)
  category_income = category_income.sort((a,b) => (a.total_salary_max < b.total_salary_max) ? 1 : ((b.total_salary_max < a.total_salary_max) ? -1 : 0))
  return category_income
}


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
    .exit().remove()
    .data(data)
    .enter()
    .append("rect")
    .merge(bars)
    .on("click", function(){switch_variant(d3.select(this)['_groups'][0][0]['__data__'])})
    .attr("x", x(0) )
    .attr("y", function(d) {return y(d[y_source]); })
    .attr("width", 0)
    .attr("height", y.bandwidth() )
    .attr("fill", function(d){return Object.keys(party_colors).includes(d[y_source]) ? party_colors[d[y_source]]['fill'] : "#003399"})
    .on("mouseover", function(event, d) {
      tooltip_container.transition()
        .duration(200)
        .style("opacity", .9);
      tooltip_container.html("<b>" + d[y_source] + "</b><br/><b>" + d[tooltip_sources[0]] + "</b> out of <b>" + d[tooltip_sources[1]] + "</b> declared<br/>additional monthly income")
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
    .exit().remove()
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
    .exit().remove()
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
    .exit().remove()
    .data(data)
    .enter()
    .append("circle")
    .merge(circles1)
      .on("mouseover", function(event, d) {
        tooltip_container.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip_container.html("<b>" + d[y_source] + "</b><br/>from <b>" + (isNaN(d[tooltip_sources[0]]) ? '' : Math.round(d[tooltip_sources[0]]/100)/10) + "</b> up to <b>" + (isNaN(d[tooltip_sources[1]]) ? '' : Math.round(d[tooltip_sources[1]]/100)/10) + " kEUR</b><br/>additional monthly income")
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
    .exit().remove()
    .data(data)
    .enter()
    .append("circle")
    .merge(circles2)
      .on("mouseover", function(event, d) {
        tooltip_container.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip_container.html("<b>" + d[y_source] + "</b><br/>from <b>" + (isNaN(d[tooltip_sources[0]]) ? '' : Math.round(d[tooltip_sources[0]]/100)/10) + "</b> up to <b>" + (isNaN(d[tooltip_sources[1]]) ? '' : Math.round(d[tooltip_sources[1]]/100)/10) + " kEUR</b><br/>median monthly income")
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
    .exit().remove()
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
      .text(function(d) { return isNaN(d[x2_source]) ? '' : d3.format(".3s")(d[x2_source])});
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

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, d3.max(data.map(function(d) {return d[y_source]}))*1.2])
    .range([height, 0]);
  chart_container.select(".y_axis")
    .call(d3.axisLeft(y)
      .tickFormat(d3.format(".2s"))
    )

  var tick_labels = chart_container.selectAll('.x_axis .tick text')
    .attr("font-size", "10px")
  tick_labels.each(function(d, i){
    words = d.split(" ")
    words[0] = words[0].substring(0, 1) + "."
    d3.select(this).text(words.join(" ").toProperCase())
    if(i%2 !== 0){d3.select(this).attr("dy", 18)}
    else{d3.select(this).attr("dy", 7)}
  });

  //lines
  var lines = chart_container.selectAll(".cleveland_lines")
  lines.transition().duration(300).attr("stroke-width", "0px")
  lines
    .exit().remove()
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
  chart_container.selectAll('.profile_photos').exit().remove()
  var defs = chart_container.append('svg:defs');
  data.forEach(function(d, i){
    defs.append("svg:pattern")
      .attr("class", "profile_photos")
      .attr("id", "profile_photo" + d.dep_photo_url.split("/").slice(-1)[0].split(".")[0])
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
    .exit().remove()
    .data(data)
    .enter()
    .append("circle")
    .merge(circles)
      .on("mouseover", function(event, d) {
        tooltip_container.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip_container.html("<b>" + d['deputy_name'] + "</b><br/>" + d.country + ", " + d.eu_party + "<br/>from <b>" + (isNaN(d[tooltip_sources[0]]) ? '' : Math.round(d[tooltip_sources[0]]/100)/10) + "</b> up to <b>" + (isNaN(d[tooltip_sources[1]]) ? '' : Math.round(d[tooltip_sources[1]]/100)/10) + " kEUR</b>")
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
      .style("fill", function(d, i){return "url(#profile_photo" + d.dep_photo_url.split("/").slice(-1)[0].split(".")[0] + ")"})
      .attr("r", 0)
      .transition().delay(750).duration(250)
      .attr("r", r_photo/2)
      .style("stroke", function(d){return Object.keys(party_colors).includes(d['eu_party']) ? party_colors[d['eu_party']]['fill'] : "#003399"});
}


function draw_horizontal_column_chart(chart_container_id, tooltip_container, data, x_source, y_source, tooltip_sources, width, height){
  var chart_container = d3.select(chart_container_id)
  // X axis
  var x = d3.scaleBand()
    .range([ 0,width ])
    .domain(data.map(function(d) { return d[x_source]; }))
    .padding(0.25);
  chart_container.select(".x_axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))

  var tick_labels = chart_container.selectAll('.x_axis .tick text')
    .attr("font-size", "10px")
  tick_labels.each(function(d, i){
    if(i%2 !== 0){d3.select(this).attr("dy", 18)}
    else{d3.select(this).attr("dy", 7)}
  });

  //chart_container.selectAll('.x_axis .tick text').each(function(d, i){
  //  if(i%2 !== 0) d3.select(this).attr("dy", 18);
  //});

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, d3.max(data.map(function(d) {return d[y_source]}))*1.05])
    .range([height, 0]);
  chart_container.select(".y_axis")
    .call(d3.axisLeft(y)
      .tickFormat(d3.format(".2s"))
    )

  var bars = chart_container.selectAll("rect")
  bars.transition().duration(300).attr("height", 0).attr("y", y(0))
  bars
    .exit().remove()
    .data(data)
    .enter()
    .append("rect")
    .merge(bars)
    .on("mouseover", function(event, d) {
      tooltip_container.transition()
        .duration(200)
        .style("opacity", .9);
      tooltip_container.html("<b>" + d[x_source] + "</b><br/>from <b>" + (isNaN(d[tooltip_sources[0]]) ? '' : Math.round(d[tooltip_sources[0]]/100)/10) + "</b> up to <b>" + (isNaN(d[tooltip_sources[1]]) ? '' : Math.round(d[tooltip_sources[1]]/100)/10) + " kEUR</b><br/>" + d.deputies_additionally_paid + " deputies")
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 28) + "px");
      })
    .on("mouseout", function(d) {
      tooltip_container.transition()
        .duration(300)
        .style("opacity", 0);
    })
    .attr("height", 0)
    .attr("y", y(0))
    .attr("x", function(d) {return x(d[x_source]); })
    .attr("width", x.bandwidth())
    .attr("fill", "#003399")
    .transition().delay(300).duration(750)
      .attr("y", function(d) {return y(d[y_source]); })
      .attr("height", function(d) { return height - y(d[y_source]); })

  //bar labels
  var bar_labels = chart_container.selectAll(".bar_labels")
  bar_labels.transition().duration(300).style("opacity", 0)
  bar_labels
    .exit().remove()
    .data(data)
    .enter()
    .append("text")
    .merge(bar_labels)
    .attr("class", "bar_labels")
    .attr("x", function(d) { return x(d[x_source]) + x.bandwidth()/2 - 11; } )
    .attr("y", function(d) { return y(d[y_source]) + 18; } )
    .style("font-size", "11px")
    .style('opacity',0).transition().delay(800).duration(500).style('opacity',1)//.delay(function(d,i){return(400+i*50)})
    .attr("fill", function(d){return Object.keys(party_colors).includes(d[y_source]) ? party_colors[d[y_source]]['text'] : "#FFFFFF"})
    .text(function(d) { return (d[y_source] != 0) ? d3.format(".3s")(d[y_source]) : '';});
}



function switch_column_chart_colors(chart_container_id, y_source){
  var chart_container = d3.select(chart_container_id)

  var bars = chart_container.selectAll("rect")
  bars.each(function(d){
    if(variant_status=='all'){d3.select(this).transition().duration(1000).attr("fill", Object.keys(party_colors).includes(d[y_source]) ? party_colors[d[y_source]]['fill'] : "#003399")}
    else if(d[y_source]!=variant_status){d3.select(this).transition().duration(1000).attr("fill", pSBC(0.8,Object.keys(party_colors).includes(d[y_source]) ? party_colors[d[y_source]]['fill'] : "#003399",false,true))}
    else{d3.select(this).transition().duration(1000).attr("fill", Object.keys(party_colors).includes(d[y_source]) ? party_colors[d[y_source]]['fill'] : "#003399")}
  })

  var bar_labels = chart_container.selectAll(".bar_labels")
  bar_labels.each(function(d){
    if(variant_status=='all'){d3.select(this).transition().duration(1000).attr("fill", Object.keys(party_colors).includes(d[y_source]) ? party_colors[d[y_source]]['text'] : "#FFFFFF")}
    else if(d[y_source]!=variant_status){d3.select(this).transition().duration(1000).attr("fill", "#FFFFFF")}
    else{d3.select(this).transition().duration(1000).attr("fill", Object.keys(party_colors).includes(d[y_source]) ? party_colors[d[y_source]]['text'] : "#FFFFFF")}
  })
}



function switch_cleveland_chart_colors(chart_container_id, y_source){
  var chart_container = d3.select(chart_container_id)

  var cleveland_lines = chart_container.selectAll(".cleveland_lines")
  cleveland_lines.each(function(d){
    if(variant_status=='all'){d3.select(this).transition().duration(1000).attr("stroke", "#003399")}
    else if(d[y_source]!=variant_status){d3.select(this).transition().duration(1000).attr("stroke", pSBC(0.8,"#003399",false,true))}
    else{d3.select(this).transition().duration(1000).attr("stroke", "#003399")}
  })

  var circles1 = chart_container.selectAll(".circles1")
  circles1.each(function(d){
    if(variant_status=='all'){d3.select(this).transition().duration(1000).style("fill", "#FFCC00").style("stroke", "#003399")}
    else if(d[y_source]!=variant_status){d3.select(this).transition().duration(1000).style("fill", pSBC(0.8,"#FFCC00",false,true)).style("stroke", pSBC(0.8,"#003399",false,true))}
    else{d3.select(this).transition().duration(1000).style("fill", "#FFCC00").style("stroke", "#003399")}
  })

  var circles2 = chart_container.selectAll(".circles2")
  circles2.each(function(d){
    if(variant_status=='all'){d3.select(this).transition().duration(1000).style("fill", "#6699ff").style("stroke", "#003399")}
    else if(d[y_source]!=variant_status){d3.select(this).transition().duration(1000).style("fill", pSBC(0.8,"#6699ff",false,true)).style("stroke", pSBC(0.8,"#003399",false,true))}
    else{d3.select(this).transition().duration(1000).style("fill", "#6699ff").style("stroke", "#003399")}
  })
}



var toggle_status = 'country'
function toggle_country_party_charts(){
  if(variant_status!='all'){
    top_n_deputies = deputies_income.filter((d,idx) => idx < 10 && d['salary_max']!=0)

    category_income = calculate_category_income(toggle_status, 'all')
    top_n_categories = category_income.filter((d) => d.organization_category != 'Unknown')
    top_n_categories = top_n_categories.filter((d,idx) => idx < 10)
    top_n_categories.push(top_n_categories.splice(top_n_categories.findIndex(function(e){return e.organization_category=='Other'}), 1)[0]);

    d3.select("#top_right_section_heading").transition().duration(1000).text("TOP10 MEPs additional monthly income")
    d3.select("#bottom_right_section_heading").transition().duration(1000).text("TOP10 sources of income - business areas")

    draw_lollipop_chart("#top_right_chart", div_tooltip, top_n_deputies, 'deputy_name', 'salary_max', ['salary_min', 'salary_max'], top_right_width, top_right_height)
    draw_horizontal_column_chart("#bottom_right_chart", div_tooltip, top_n_categories, 'organization_category', 'total_salary_max', ['total_salary_min', 'total_salary_max'], top_right_width, top_right_height)
  }

  variant_status = 'all'

  var toggle = document.getElementById("toggle-button");
  if (toggle.checked && toggle_status=='country'){
    toggle_status = 'eu_party'
    d3.select("#label_by_party").transition().duration(300).style("fill", "#000000")
    d3.select("#label_by_country").transition().duration(300).style("fill", "#AAAAAA")

    draw_column_chart("#top_left_chart", div_tooltip, party_income, 'perc_deputies_additionally_paid', 'eu_party', ['deputies_additionally_paid','deputies_count'], top_left_width, top_left_height)
    draw_cleveland_chart("#top_middle_chart", div_tooltip, party_income, 'median_salary_min', 'median_salary_max', 'eu_party', ['median_salary_min', 'median_salary_max'], top_middle_width, top_middle_height)
  }
  else if (!toggle.checked && toggle_status=='eu_party') {
    toggle_status = 'country'
    d3.select("#label_by_party").transition().duration(300).style("fill", "#AAAAAA")
    d3.select("#label_by_country").transition().duration(300).style("fill", "#000000")

    draw_column_chart("#top_left_chart", div_tooltip, country_income, 'perc_deputies_additionally_paid', 'country', ['deputies_additionally_paid','deputies_count'], top_left_width, top_left_height)
    draw_cleveland_chart("#top_middle_chart", div_tooltip, country_income, 'median_salary_min', 'median_salary_max', 'country', ['median_salary_min', 'median_salary_max'], top_middle_width, top_middle_height)
  }
}



var variant_status = 'all'
function switch_variant(d){
  if(variant_status==d[toggle_status]){
    variant_status = 'all';
    top_n_deputies = deputies_income.filter((d,idx) => idx < 10 && d['salary_max']!=0)
  }
  else{
    variant_status = d[toggle_status];
    top_n_deputies = deputies_income.filter((d,idx) => d[toggle_status]==variant_status && d['salary_max']!=0);
    top_n_deputies = top_n_deputies.filter((d,idx) => idx < 10);
  }

  category_income = calculate_category_income(toggle_status, variant_status)
  top_n_categories = category_income.filter((d) => d.organization_category != 'Unknown')
  top_n_categories = top_n_categories.filter((d,idx) => idx < 10)
  top_n_categories.push(top_n_categories.splice(top_n_categories.findIndex(function(e){return e.organization_category=='Other'}), 1)[0]);

  if (variant_status!='all'){
    d3.select("#top_right_section_heading").transition().duration(1000).text("TOP10 MEPs additional monthly income | " + variant_status)
    d3.select("#bottom_right_section_heading").transition().duration(1000).text("TOP10 sources of income - business areas | " + variant_status)
  }
  else{
    d3.select("#top_right_section_heading").transition().duration(1000).text("TOP10 MEPs additional monthly income")
    d3.select("#bottom_right_section_heading").transition().duration(1000).text("TOP10 sources of income - business areas")
  }

  switch_column_chart_colors("#top_left_chart", toggle_status)
  switch_cleveland_chart_colors("#top_middle_chart", toggle_status)
  draw_lollipop_chart("#top_right_chart", div_tooltip, top_n_deputies, 'deputy_name', 'salary_max', ['salary_min', 'salary_max'], top_right_width, top_right_height)
  draw_horizontal_column_chart("#bottom_right_chart", div_tooltip, top_n_categories, 'organization_category', 'total_salary_max', ['total_salary_min', 'total_salary_max'], top_right_width, top_right_height)
}
