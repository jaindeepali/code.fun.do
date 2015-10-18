var server_endpoint = "/";
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
            // $.each(children, function(i, item) {
            var delay = 1000;
            function callAjax() {
                // check to see if there are id's remaining...
                if (children.length > 0)
                {
                    // get the next id, and remove it from the array...
                    var item = children[0];
                    children.shift();
                    var name = item.name;
                    var url = item['@content.downloadUrl'];
                    $.get(url, function(text){
                      // text = encodeURIComponent(text);
                      var req = {text:text}
                      try{
                        $.ajax({
                            cache : false,
                            type: "POST",
                            url: '/',
                            data: {text: text, name:name},
                            dataType: "json",
                            // jsonp: false,
                            async: false,
                            success: function (response) {
                              if(response['success'] == 1 ){
                                var cat = response['folder_name'];
                                var fname = response['name'];
                                var tag_list = response['tags'];
                                var id = '#' + cat + ' .list';
                                var tags = '';
                                $.each(tag_list, function(t,tg){
                                  // tags = tags + '<span> ' + tg + ' </span>'
                                  tags = tags + '<span class="btn btn-default btn-xl" style="float:right;margin:5px;"> ' + tg + ' </span>'
                                  console.log(tg);
                                });
                                var item = '<div class="listitem"><span> ' + fname + '</span>' + tags + ' </div>';
                                $(id).append(item);
                              }
                              setTimeout(callAjax, delay);
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
                }
            }
            callAjax();
              
            // });
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