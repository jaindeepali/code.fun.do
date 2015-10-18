var server_endpoint = "http://localhost:8000";
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
            // console.log(data);
            var children = data.children;
            $.each(children, function(i, item) {
              var name = item.name;
              var url = item['@content.downloadUrl'];
              $.get(url, function(text){
                // console.log(text);
                text = encodeURIComponent(text);
                var req = {text:text}
                try{
                  $.ajax({
                      type: "GET",
                      url: '/',
                      data: {text: text, name:name},
                      dataType: "json",
                      // jsonp: false,
                      async: false,
                      success: function (response) {
                        // console.log(response);
                        cat = response['folder_name'];
                        fname = response['name'];
                        tag_list = response['list'];
                        id = '#' + cat + ' .list';
                        var tags = '';
                        // $.each(tag_list, function(t,tg){
                        //   tags = tags + '<span> ' + tg + ' </span>'
                        // });
                        var item = '<div class="listitem"><span> ' + fname + ' </span><span> ' + tags + ' </span></div>'
                        $(id).append(item);
                      },
                      error: function(err) {
                        // alert(err);
                      }
                    });
                } catch(err) {
                  // console.log('errdone');
                }
                console.log(name);
              });
            });
            $('#myChart').show();
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
// odauth();

function list_files() {
  $.get('')
}
// console.log('end');