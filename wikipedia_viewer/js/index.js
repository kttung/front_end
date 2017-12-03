$(document).ready(function(){
  $("#searchicon").on("click", function(){   
    if ($("#sbox").val()!="")
      query($("#sbox").val());    
  });
  
  $("#sbox").on('keyup', function (e) {  
    if (e.keyCode == 13) {
        $("#searchicon").click();
    }
});  
});

function query(term) {
  var api="https://en.wikipedia.org/w/api.php?format=json&action=query&list=search&srprop=snippet&srsearch=" + term + "&callback=?";
 
  $.getJSON(api, function(json){
    console.log(json);
  var html = makeResultBox(json.query.search);
    $("#results").html(html);
  })
  .fail(function(){console.log('Failed query');});
}

function makeResultBox(searchResults) {
  return searchResults.map(function(r){
    return "<div class=\"col-xs-12\"><a href=\"http://en.wikipedia.org/?curid="+ r.pageid +"\" target=\"_blank\"><h4>"+ r.title + "</h4>" + "<p>" + r.snippet + "</p></a></div>";    
  }).join("");
}