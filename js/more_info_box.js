var info_unrolled = false;



function unroll_info(){
  if(info_unrolled==true){
    info_unrolled = false;

    div_infobox.style("opacity", 0.9).style("font-size", "0px")
    div_infobox
      .transition().duration(500).style("left", "1517px").style("width", "0px")
      .transition().duration(500).style("height", "0px")

    div_infobox.html('')
  }
  else{
    info_unrolled = true;

    div_infobox.style("font-size", "0px")
    info_text = "<span>"
    info_text += "<b>Did you know that MEPs are allowed to take up side jobs? And they do.</b></br>"
    info_text += "</br>"
    info_text += "475 members are involved into extra activities and 201 of them (28%) get money for it.</br>"
    info_text += "As the requirement is to declare income in pay ranges - total declared earnings range</br>"
    info_text += "from <b>300k to 880k EUR / month</b>. This is on top of their EUP salary, which is near to</br>"
    info_text += "13k EUR / month (incl. expenditure allowance).</br>"
    info_text += "</br>"
    info_text += "Most common roles they play are university professors, members of directors'/advisory</br>"
    info_text += "boards or local councillors.</br>"
    info_text += "</br>"
    info_text += "</span>"
    div_infobox.html(info_text)

    div_infobox
      .transition().duration(500).style("height", "200px")
      .transition().duration(500).style("width", "517px").style("left", "1000px")

    div_infobox.transition().delay(1000).duration(500).style("font-size", "12px")

  }
}
