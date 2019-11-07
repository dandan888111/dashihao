let userId = ''
let storage = window.localStorage;
let imageArr = [];


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

let source = GetQueryString('source') || ''
let url = window.location.href;

if (is_neizhi() == 'weixin') {

    wx_login(function(res) {
        userId = res;
        wxSdk(
            '大师好—分佣后台', 
            '来自全球最顶级的命理大师，为你解读你所不知道的命理密码。', 
             window.location.href,
            'https://www.nihaodashi.com/dashihao/assets/img/share.jpg'
        );
    }, window.location.href)


    // if (storage.getItem('userId')) {
    //     userId = storage.getItem('userId');
    //     getUserInfo(userId, 'userId');
    //     wxSdk(
    //         '大师好—分佣后台', 
    //         '来自全球最顶级的命理大师，为你解读你所不知道的命理密码。', 
    //          window.location.href,
    //         'https://www.nihaodashi.com/dashihao/assets/img/share.jpg'
    //     );
    // } else {
    //     wx_login(function(res) {
    //         userId = res;
    //         wxSdk(
    //             '大师好—分佣后台', 
    //             '来自全球最顶级的命理大师，为你解读你所不知道的命理密码。', 
    //              window.location.href,
    //             'https://www.nihaodashi.com/dashihao/assets/img/share.jpg'
    //         );
    //     }, window.location.href)
    // }
} else {

}


// replaceOrAddUrlParam(url, 'source', userId),
function replaceOrAddUrlParam(url, key, value) {
    var oldval = GetQueryString2(key, url)
    if(url.indexOf('?') !== -1) {
        
        if(oldval) {
            var regex = new RegExp(key + "=([^&]*)(&|$)");
            url  = url.replace(regex, key + '='+ value + '&')
        } else {
            url  = url + '&'+ key + '='+ value;
        }
    } else {
        url  = url + '?'+ key + '='+ value;
    }
    return url
}


// 拉取用户个人信息
function getUserInfo(code, type) {
    let requestUrl = ''
    if (type === 'code') {
        requestUrl = 'https://www.nihaodashi.com/nihaodashi/services/v1/dsAccount/get?uid=0&code='+ code;
    } else if (type === 'userId') {
        requestUrl = 'https://www.nihaodashi.com/nihaodashi/services/v1/dsAccount/get?uid=' + code + '&code=0';
    }
    axios({
        method: "get",
        url: requestUrl,
        headers:{
            "version": "v1",
            "platform": "ios",
            "Token": "7e2d0ec641474c1985758959825cc1f9de29b2f02be84d90b9a7dc1edf731eba",
            "Content-Type": "application/json"
        }
    }).then(function (response) {
        
        let userData = response.data.result;
        if (userData.nickname) {
            imageArr = userData.dsAccountShareInfo.sharePictures;
            setLocalStorages([{ 'userId': userData.userId }])

            $('.header-wrap').append(Mustache.render($('#userInfoTpl').html(), {
                'userName': userData.nickname,
                'avctor': userData.figurl
            }));
            // 设置我的推广链接
            $('[node-type=extend-jump-url]').attr('href', userData.dsAccountShareInfo.shareLink)
            $('[node-type=extend-jump-url]').html(userData.dsAccountShareInfo.shareLink)
            // $('[node-type=extend-url]').html(userData.dsAccountShareInfo.shareLink)
            $('[node-type=extend-url-copy]').attr('data-clipboard-text', userData.dsAccountShareInfo.shareLink)
            // 设置我的推广图片
            $('[node-type=extend-image]').attr('src', userData.dsAccountShareInfo.sharePictures[0]);
            // 设置我的推广数据的url
            $('[node-type=promote-data-url]').attr('href', 'https://www.nihaodashi.com/dashihao/assets/html/dsorder-3.html?source=' + userData.userId);
            $('.wp').show();
            
        } else {
            alert('个人信息拉取失败，请退出后重试')
        }
        
    })
    .catch(function (error) {
        console.log(error);
    });
}

// 微信登录
function wx_login(fn, url) {
    if (getRequest() && getRequest().code) {
        $('.tips').hide()
        getUserInfo(getRequest().code, 'code')
    } else {
        let url = encodeURIComponent(window.location.href);
        window.location.replace(
            'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxe24d8d2690f536f9&redirect_uri=' + url + '&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect'
        )
    }
}


// 切换推广文案
let introArr = [
    '真神了！连我哪一年结的婚，什么时候有孩子都能看出来，这个人工智能算命有点炸！---大师好',
    '过错是暂时的遗憾，而错过则是永远的遗憾！AI智能对话算命负责帮我探听天命---大师好',
    '天上下雨地下滑，命运奥秘很复杂，施主，请留步，预知前程事，可用AI智能对话算命---大师好',
]
let curIntroIndex = 0;
let introMaxIndex = introArr.length - 1;
$('[node-type=extend-intro]').html(introArr[curIntroIndex]);
$('[node-type=copy-intro-btn]').attr('data-clipboard-text', introArr[curIntroIndex]);
$('[action-type=change-intro]').click(function(e) {
    curIntroIndex++;
    if(curIntroIndex > introMaxIndex) curIntroIndex = 0;
    let intro = introArr[curIntroIndex];
    $('[node-type=extend-intro]').html(intro);
    $('[node-type=copy-intro-btn]').attr('data-clipboard-text', intro);
})


// 切换推广图片
let curImageIndex = 0;
$('[action-type=change-image]').click(function(e) {
    let imageMaxIndex = imageArr.length - 1;
    curImageIndex++;
    if(curImageIndex > imageMaxIndex) curImageIndex = 0;
    let image = imageArr[curImageIndex];
    $('[node-type=extend-image]').attr('src', image);
})


