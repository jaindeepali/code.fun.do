var server_endpoint = "http://localhost:8000";
var count = [];
count['Arts']=0;
count['Games']=0;
count['Computers'] = 0;
count['Recreation'] = 0;
count['Sports']=0;
count['Science']=0;
count['Society'] = 0;
count['Home'] = 0;
count['Health']=0;
count['Business']=0;
function onAuthenticated(token, authWindow) {
  $('#loading').show();
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
            var delay = 500;
            function callAjax() {
                // check to see if there are id's remaining...
                if (children.length > 0)
                {
                    console.log(children.length);
                    // get the next id, and remove it from the array...
                    var item = children[0];
                    children.shift();
                    var name = item.name;
                    var url = item['@content.downloadUrl'];
                    $.get(url, function(text){
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
                                  // console.log(tg);
                                });
                                var item = '<div class="listitem"><span> ' + fname + '</span>' + tags + ' </div>';
                                $(id).append(item);
                                count[cat]++;
                              }
                              else{
                                var cat = 'Arts';
                                var fname = name;
                                var id = '#' + cat + ' .list';
                                var tags = '';
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
                  if(children.length == 0){
                    $('#loading').hide();
                    $('#done').show();
                             var pieData = [
                             {
                        value: count['Arts'],
                        color:"#ce57a0 ",
                        highlight: "#FF5A5E ",
                        label: "Art"
                    },
                     {
                        value: count['Business'],
                        color:"#00aeef ",
                        highlight: "#FF5A5E ",
                        label: "Business"
                    },
                    
                    {
                        value: count['Computers'],
                        color: "#00fe9c ",
                        highlight: "#FFC870 ",
                        label: "Computers"
                    },
                    {
                        value: count['Society'],
                        color:"#78c5ee ",
                        highlight: "#FF5A5E ",
                        label: "Social"
                    },
                    {
                        value: count['Science'],
                        color:"#00b48d ",
                        highlight: "#FF5A5E ",
                        label: "Science"
                    },
                    {
                        value: count['Recreation'],
                        color:"#ff6d00 ",
                        highlight: "#FF5A5E ",
                        label: "Recreation"
                    },
                    {
                        value: count['Sports'],
                        color:"#8252b1 ",
                        highlight: "#FF5A5E ",
                        label: "Sport"
                    },
                    
                    
                    {
                        value: count['Games'],
                        color:"#f1583e ",
                        highlight: "#FF5A5E ",
                        label: "Games"
                    },
                    {
                        value: count['Health'],
                        color: "#abb48d ",
                        highlight: "#5AD3D1 ",
                        label: "Health"
                    },
                    {
                        value: count['Home'],
                        color: "#f16690 ",
                        highlight: "#FFC870 ",
                        label: "Home"
                    }

                       ];

                     var myPie = new Chart(document.getElementById("myChart").getContext("2d")).Doughnut(pieData,{percentageInnerCutout : 80});  
                     console.log(myPie);
                  }
                }
            }
            callAjax();
            // });
            // $('#myChart').show();
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