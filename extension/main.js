var server_endpoint = "http://localhost:8000";
function onAuthenticated(token, authWindow) {
  if (token) {

    (function($){
      
      var odurl = "https://api.onedrive.com/v1.0/drive/root:/Documents/:";
      var odquery = "?expand=thumbnails,children(expand=thumbnails(select=large,c200x150_Crop))&access_token=" + token;

      // $.ajax({
      //     type: "POST",
      //     url: odurl,
      //     data: {
      //           name: "Arts",
      //           // folder:{},
      //           // @name.conflictBehavior: "rename"
      //         },
      //     dataType: "json",
      //     jsonp: false,
      //     async: false,
      //     success: function (response) {
      //       // console.log(JSON.parse(response));

      //     }
      //   });

      $.ajax({
        url: odurl + odquery,
        dataType: 'json',
        success: function(data) {
          if (data) {
            // onSuccess(data);
            // console.log(data);

            var children = data.children;
            $.each(children, function(i, item) {
              var url = item['@content.downloadUrl'];
              $.get(url, function(text){
                // console.log(text);
                var req = {text:text}
                try{
                  $.ajax({
                      type: "GET",
                      url: server_endpoint,
                      data: {text: text},
                      dataType: "jsonp",
                      jsonp: false,
                      async: false,
                      success: function (response) {
                        // console.log(JSON.parse(response));
                      }
                    });
                } catch(err) {
                  console.log('done');
                }
              });
            });
          } else {
            alert("Data not recieved");
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