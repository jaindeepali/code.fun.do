var server_endpoint = "localhost:8000"
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
            onSuccess(data);
            console.log(data);
            
          } else {
            alert("Data not recieved");
          }
        }
      });

      function onSuccess(data){
          $.ajax({
              type: "POST",
              url: server_endpoint,
              data: data,
              dataType: "json",
              success: function (response) {
                    if (response.d == true) {
                            alert("user detail Inserted");
                    }
                    else {
                        alert("Error Occured.");
                    }
                },
                failure: function (response) {
                    alert(response.d);
                }
            });
          }
    })(jQuery);
  }
  else {
    alert("Error signing in");
  }
}
odauth();