function wxSdk() {
    $.ajax({
        type: "GET",
        url: requsetUrl + "/v1/wxshare?url=" + encodeURIComponent(location.href.split('#')[0]),
        data: {},
        success: function(res) {
            wx.config({
                debug: false,
                appId: res.appId,
                timestamp: res.timestamp,
                nonceStr: res.nonceStr,
                signature: res.signature,
                jsApiList: [
                    'hideAllNonBaseMenuItem'
                ]
            });
            wx.ready(function(res) {
              wx.hideAllNonBaseMenuItem();
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("neizhi---->error--");
        }
    });
}
// 检测QQ微信
function is_neizhi() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return "weixin";
    } else if (ua.match(/ qq/i) == ' qq') {
        return "QQ";
    }
    return false;
}
// 登录
function wx_login(fn, url) {
    wxSdk()
    if (getRequest() && getRequest().code) {
        $.ajax({
            type: "GET",
            url:  requsetUrl + "/v1/public/accessToken",
            data: {
                code: getRequest().code,
                appid: 'wxe24d8d2690f536f9',
                secret: 'f3d388a48a446ac4ac0b1061a74963f8'
            },
            success: function(res) {
                if (res.data) {
                  config_userInfo = res.data;

                  fn(config_userInfo);
                } else {
                  // alert('url--->'+url)
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {}
        });
    } else {
        let _url = encodeURIComponent(url);
        window.location.replace(
            'http://open.weixin.qq.com/connect/oauth2/authorize?appid=wxe24d8d2690f536f9&redirect_uri=' + _url + '&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect'
        )
    }
}

function getRequest() {
    var url = location.search;
    if (location.search) {
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
        } else {
            return theRequest
        }
        return theRequest;
    } else {
        return
    }
}
