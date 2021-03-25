var info_unrolled = false;



function unroll_info(){
  if(info_unrolled==true){
    info_unrolled = false;

    div_infobox.select("span").transition().duration(500).style('font', '0px sans-serif')
    div_infobox.style("opacity", 0.9)
    div_infobox
      .transition().duration(500).style("left", "1517px").style("width", "0px")
      .transition().duration(500).style("height", "0px").style("opacity", 0)

    div_infobox.transition().delay(1000).duration(0).select("span").remove()

  }
  else{
    info_unrolled = true;

    div_infobox.style("font-size", "0px")
    info_text = "<span>"
    info_text += "<b>Did you know that MEPs are allowed to take up side jobs? They take on opportunity.</b></br>"
    info_text += "<hr style='display: block; height: 1px; border: 0; border-top: 1px solid #888888;'>"
    info_text += "475 members are involved into extra activities and 201 of them (28%) get money for it.</br>"
    info_text += "As the requirement is to declare income in pay ranges - total declared earnings reach</br>"
    info_text += "from <b>300k to 880k EUR / month</b>. This is on top of their EUP salary, which is near to</br>"
    info_text += "13k EUR / month (incl. expenditure allowance).</br>"
    info_text += "</br>"
    info_text += "Most common roles they play are university professors, members of directors'/advisory</br>"
    info_text += "boards or local councillors. Main business areas are education, consulting and legal.</br>"
    info_text += "<hr style='display: block; height: 1px; border: 0; border-top: 1px solid #888888;'>"
    info_text += "Charts are interactive, you can play with them.</br>"
    info_text += "- click on the switch in top left area to toggle between country and party view</br>"
    info_text += "- click any bar on left chart to drill-down</br>"
    info_text += "- hover chart elements to see more details</br>"
    info_text += "- GitHub icon in the top right area redirects to repo</br>"
    info_text += "<hr style='display: block; height: 1px; border: 0; border-top: 1px solid #888888;'>"
    info_text += "About:</br>"
    info_text += "- <a href='https://twitter.com/sejm_watch' target='_blank'>@sejm_watch</a> is a Twitter bot summarizing parliament and Twitter activity of Polish deputies</br>"
    info_text += "- we keep the bot alive, posting every day and we tweet interesting (hopefully) analyzes, like this.</br>"
    info_text += "- any questions? DM @sejm_watch on Twitter"
    info_text += "</span>"
    div_infobox.html(info_text)

    div_infobox.select("span").style('font', '0px sans-serif')

    div_infobox
      .style('font', '12px sans-serif')
      .transition().duration(500).style("height", "300px").style("opacity", 0.9)
      .transition().delay(100).duration(500).style("width", "517px").style("left", "1000px")

    div_infobox.select("span").transition().delay(600).duration(500).style('font', '12px sans-serif')

  }
}
