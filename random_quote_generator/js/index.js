function drawQuoteBox(data) {
   $("#quote").html(data[0].content); 
  
  $("#author").html('<em>'+data[0].title+'</em>');
      $("#twitter").attr('href',"https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text="+data[0].content.replace(/(<\/?p>)/g,'').slice(0, 140)); // twitter character limits
}

function getQuote() {
   $.getJSON("https://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1&callback", drawQuoteBox);
}

$(document).ready(function() {
    $.ajaxSetup({ cache: false });
    getQuote();
    $("#newquote").on("click", getQuote);
  });