var regChannels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
var channel_info = {};

$(document).ready(function(){
  regChannels.map(loadChannelInfo);   
  
  $("input:radio[name=filter]").change(function(){
    redrawTable(this.value);
  });
});  

function loadChannelInfo(channel) {
  var api="https://wind-bow.gomix.me/twitch-api/channels/" + channel + "?callback=?";
  $.getJSON(api, function(json){
    channel_info[channel] = {'logo':json.logo, 'url':json.url, 'display_name':json.display_name};
    query(channel);
  })
  .fail(function(){
    ('Failed query');
    query(channel); // still need to grab other info
   });  
}

function query(channel) {
  var api="https://wind-bow.gomix.me/twitch-api/streams/" + channel + "?callback=?";  
 
  $.getJSON(api, extractChannelInfo)
  .fail(function(){console.log('Failed query');});
}

function extractChannelInfo(c) {
  var channel = c._links.channel.match(/[a-zA-Z0-9\_]*$/);
  //channel_info[channel].link = c._links.channel;
  channel_info[channel].offline = c.stream == null;
  channel_info[channel].game = ""
  channel_info[channel].status="";
  if (!channel_info[channel].offline) {
    channel_info[channel].game = c.stream.game;
    channel_info[channel].status = c.stream.channel.status;
  }
  
  $("#channels").append(creatRow(channel_info[channel]));
}

function redrawTable(fter) {
  var filter_num = 0;
  if (fter=='all') filter_num = 2;
  else if (fter=='online') filter_num = 1;
  
  var html = "";
  
  for (var k in channel_info) {
    if (filter_num==2 || (filter_num==0 && channel_info[k].offline) || (filter_num==1 && !channel_info[k].offline)) {
      html += creatRow(channel_info[k]);
    }
  }

  $("#channels").html(html);
}

function creatRow(cinfo) {
  return "<div class='col-xs-1 col-lg-4 twrow'></div><div class='col-xs-3 col-lg-1 text-center twrow twcontent'><img height=80px src=\"" + cinfo.logo + "\"></div><div class='col-xs-7 col-lg-3 text-left twrow twcontent'> " + "<a target='_blank' href='" + cinfo.url +"'><strong>" + cinfo.display_name + "</strong></a><p>"+ (cinfo.offline?"offline":capLen(cinfo.game+' '+ cinfo.status,48))+"</p></div><div class='col-xs-1 col-lg-4 twrow'></div>";  
}


function capLen(str, maxlen) {
    if (str.length-3>maxlen) return str.slice(0,maxlen) + "...";
    return str;
}