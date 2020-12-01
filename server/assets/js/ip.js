// your site link
var siteDdns = "http://yourWebSiteIp"
loadIP()
function loadIP(){
  $.ajax({
    url: "/getServerIP",
    success: function(ip){
      siteDdns = ip
    }
  });
}
