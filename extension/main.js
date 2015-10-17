function onAuthenticated(token, authWindow) {
  if (token) {

    (function($){
      
      var odurl = "https://api.onedrive.com/v1.0/drive/root:/Documents/:";
      var odquery = "?expand=thumbnails,children(expand=thumbnails(select=large,c200x150_Crop))&access_token=" + token;

      $.ajax({
        url: odurl + odquery,
        dataType: 'json',
        success: function(data) {
          if (data) {
            console.log(data);
            
          } else {
            $('#od-items').empty();
            $('<p>error.</p>').appendTo('#od-items');
            $('#od-json').empty();
          }
        }
      });
    })(jQuery);
  }
  else {
    alert("Error signing in");
  }
}
odauth();