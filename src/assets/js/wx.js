

let baseUrl = 'https://www.nihaodashi.com/nihaodashi'
//let baseUrl = 'https://www.nihaodashi.com/nihaodashi-dev'

function wxSdk(otitle, desc, olink, oimgUrl) {
    axios({
        method: "post",
        url: 'https://www.nihaodashi.com/nihaodashi/services/v1/status/share',
        data: {'visitUrl': location.href.split('#')[0]},
        headers:{
            "version": "v1",
            "platform": "ios",
            "Token": "7e2d0ec641474c1985758959825cc1f9de29b2f02be84d90b9a7dc1edf731eba",
            "Content-Type": "application/json"
        }
    }).then(function (response) {
        let data = response.data.result;
        wx.config({
            debug: false,
            appId: 'wxe24d8d2690f536f9',
            timestamp: data.timestamp,
            nonceStr: data.noncestr,
            signature: data.signature,
            jsApiList: [
                'onMenuShareAppMessage', 'onMenuShareTimeline', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'updateAppMessageShareData', 'updateTimelineShareData','chooseWXPay'
           ]
        });
        wx.ready(function(res) {
            wx.updateAppMessageShareData({
                title: otitle,
                desc: desc,
                link: olink,
                imgUrl: oimgUrl,
                success: function() {}
            });
            wx.updateTimelineShareData({
                title: otitle,
                link: olink,
                imgUrl: oimgUrl,
                success: function() {}
            });
            wx.onMenuShareTimeline({
                title: otitle,
                desc: desc,
                link: olink,
                imgUrl: oimgUrl,
                success: function() {}
            });
            wx.onMenuShareAppMessage({
                title: otitle,
                desc: desc,
                link: olink,
                imgUrl: oimgUrl,
                success: function() {}
            });
            wx.onMenuShareQQ({
                title: otitle,
                desc: desc,
                link: olink,
                imgUrl: oimgUrl,
                success: function() {}
            });
            wx.onMenuShareWeibo({
                title: otitle,
                desc: desc,
                link: olink,
                imgUrl: oimgUrl,
                success: function() {}
            });
            wx.onMenuShareQZone({
                title: otitle,
                desc: desc,
                link: olink,
                imgUrl: oimgUrl,
                success: function() {}
            });
            wx.checkJsApi({
                jsApiList: ['chooseWXPay'],
                success: res => {},
                fail: err => {
                    alert('check api fail:', err)
                }
            })
        });
    })
    .catch(function (error) {
        alert('neizhi---->error--');
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
function wx_login() {
    if (getRequest() && getRequest().code) {
        //alert(getRequest().code);
        axios({
            method: "post",
            url: baseUrl + '/services/v1/dsorder/getopenid?code='+ getRequest().code,
            headers:{
                "version": "v1",
                "platform": "ios",
                "Token": "7e2d0ec641474c1985758959825cc1f9de29b2f02be84d90b9a7dc1edf731eba",
                "Content-Type": "application/json"
            }
        }).then(function (response) {
            //console.log(response)
            if (response.data.result) {
                config_openId = response.data.result;
                setLocalStorages([{ 'openId': config_openId }])
            } else {
                _hmt.push(['_trackEvent', 'wx_login', response.data.message]);
            }
        })
        .catch(function (error) {
            _hmt.push(['_trackEvent', 'wx_login', error]);
            console.log(error);
        });
    } else {
        let _url = encodeURIComponent(window.location.href);
        window.location.replace(
            'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxe24d8d2690f536f9&redirect_uri=' + _url + '&response_type=code&scope=snsapi_base&state=STATE&connect_redirect=1#wechat_redirect'
        )
    }
}

function weixinOnload() {
    if (is_neizhi() == 'weixin') {
        if (storage.getItem('openId')) {
            config_openId = storage.getItem('openId');
        } else { 
            wx_login()
        }
        wxSdk(
            wxSdk_title[parseInt(Math.random() * wxSdk_title.length)], 
            '大师好—为你提供一次隔空对话中国顶级“易学”大师的机会。', 
            window.location.href, 
            wxSdk_image[parseInt(Math.random() * wxSdk_image.length)]
        );
        
    }
}


