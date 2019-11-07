$(function() {
  // wxSdk()
    $('.mobileCode>span').on('click', function() {
        if (/^1[34578]\d{9}$/.test($('.mobileNumber>input').val())) {
            if ($(this).is('.sendYyanzhengCode'))
                return;
            $(this).addClass('sendYyanzhengCode');
            yanzheng($('.mobileNumber>input').val())
            $('.sendYyanzhengCode').html('重新获取(' + 59 + ')')
            let timer = setInterval(function() {
                telTimerNum--;
                $('.sendYyanzhengCode').html('重新获取(' + telTimerNum + ')')
                if (telTimerNum <= 0) {
                    clearInterval(timer);
                    $('.sendYyanzhengCode').html('获取验证码');
                    $('.sendYyanzhengCode').removeClass('sendYyanzhengCode');
                    telTimerNum = 59
                }
            }, 1000)
        } else {
            alert('手机号输入有误')
        }
    })


})
function telLogin(fn) {
    if (is_neizhi() == 'weixin') {
        wx_login(function(res) {
            isTel(res.unionid, res.openid, function(isTel) {
                fn(isTel)
            })
            wxSdk();
        }, window.location.href)
    }else{
      fn({data:{id:''},ret:0})
    }
}
// 判断是否保存有手机号
function isTel(unionid, openid, fn) {
    $.ajax({
        type: "GET",
        url: requsetUrl + "/v1/user/hasTel",
        data: {
            source: 'WX',
            openId: openid,
            unionId: unionid,
            telphone: '',
        },
        success: function(msg) {
            fn(msg)
        },
        error: function(msg) {}
    });
}
// 发送验证码
function yanzheng(telphone) {
    $.ajax({
        type: "GET",
        url: requsetUrl + "/v1/getVerifyCode",
        data: {
            telphone: telphone
        },
        success: function(msg) {

        },
        error: function(msg) {
          alert('验证码发送失败')
        }
    });
}
// 校验验证码
function sendNumber(tel, code, fn) {
    $.ajax({
        type: "GET",
        url: requsetUrl + "/v1/checkCodeAndRegister",
        data: {
            telphone: tel,
            telCode: code,
            openId: config_userInfo.openid,
            unionId: config_userInfo.unionid,
            source: 'WX'
        },
        success: function(msg) {
            fn(msg)
        },
        error: function(msg) {
            alert(msg.msg)
        }
    });
}
