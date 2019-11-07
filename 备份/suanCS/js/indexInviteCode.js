$(function() {
    pushHistory()
    $('.bindNumber,.inviteCode').hide();
    onLoadTab();
    // 输入框失去焦点事件
    $('body').on('blur', 'input', function() {
        kickBack()
    })
    $('body').on('click', function() {
        if (!config_userInfo)
            onLoadTab()
    })
    // 绑定手机号
    $('.sendNumber').on('click', function() {
        if ($('.mobileNumber>input').val() && $('.mobileCode>input').val()) {
            sendNumber($('.mobileNumber>input').val(), $('.mobileCode>input').val(), function(res) {
                if (res.ret == 0) {
                    hasFather(res.data.code, function() {
                        indexInviteCode = res.data.code;
                        $('.inviteCode01-copy>span').eq(1).html(indexInviteCode);
                        $('.inviteCodeMine').attr('data-clipboard-text', indexInviteCode);
                        let indexInviteCodeMineCopy = new ClipboardJS($('.inviteCodeMine')[0]);
                        indexInviteCodeMineCopy.on('success', function(e) {
                            alert('复制成功:' + e.text)
                        });
                        $('.inviteCode').show().siblings().hide();
                        $('.inviteCode01-box-1').show();
                        $('.inviteCode01-box-2,.inviteCode02').hide();
                    })
                } else if (res.ret == 1) {
                    $('.bindNumber').show().siblings().hide();
                }
            })
        } else {
            alert('请填写正确的手机号或验证码1')
        }
    });

    // 填写邀请码
    $('.saveFather').on('click', function() {
        saveFather(indexInviteCode, $(this).prev().val(), function(msg) {
            if (msg.ret == 1) {
                alert('输入有误')
            } else if (msg.ret == 0) {
                $('.inviteCode01,.inviteCode01-box-2').show().siblings().hide();
                $('.inviteCode01-copy').show();
            }
        })
    })

    // 我要提现
    $('.goWithdrawal').on('click', function() {
        window.location.replace(
            'https://www.huiyidabai.cn/suanWeb/withdrawal.html?inviteCode=' + indexInviteCode
        )
    })
})

function onLoadTab() {
    telLogin(function(res) {
        if (res.ret == 0) {
            // 此处传回user对象,发送userid到服务端
            hasFather(res.data.code || 'EA53LM', function(msg) {
                indexInviteCode = res.data.code || 'EA53LM';
                $('.inviteCode').show().siblings().hide();
                if (msg.ret == 1) { //未保存
                    $('.inviteCode01-copy>span').eq(1).html(indexInviteCode);
                    $('.inviteCodeMine').attr('data-clipboard-text', indexInviteCode);
                    let indexInviteCodeMineCopy = new ClipboardJS($('.inviteCodeMine')[0]);
                    indexInviteCodeMineCopy.on('success', function(e) {
                        alert('复制成功:' + e.text)
                    });

                    $('.inviteCode01,.inviteCode01-box-1').show().siblings().hide();
                    $('.inviteCode01-copy').show();
                } else if (msg.ret == 0) { //保存
                    $('.inviteCode02-father>img').attr('src', msg.data.headImgUrl);
                    $('.inviteCode02-father>span').html(msg.data.nickName);
                    $('.inviteCode01-box-1>h3').html(indexInviteCode);
                    $('.inviteCode01-copy-text').attr('data-clipboard-text', indexInviteCode);
                    let indexInviteCodeCopy = new ClipboardJS($('.inviteCode01-copy-text')[0]);
                    indexInviteCodeCopy.on('success', function(e) {
                        alert('复制成功:' + e.text)
                    });

                    $('.inviteCode02').show().siblings().hide();
                }
            })
        } else if (res.ret == 1) {
            $('.bindNumber').show();
        }
    })
}

function hasFather(code, fn) {
    $.ajax({
        type: "GET",
        url: requsetUrl + "/v1/user/hasFather",
        data: {
            code: code
        },
        success: function(msg) {
            console.log(msg)
            fn(msg)
        },
        error: function(msg) {}
    });
}

function saveFather(code, codeFather, fn) {
    $.ajax({
        type: "GET",
        url: requsetUrl + "/v1/user/saveFather",
        data: {
            code: code,
            codeFather: codeFather
        },
        success: function(msg) {
            console.log(msg)
            fn(msg)
        },
        error: function(msg) {}
    });
}
function pushHistory() {
    window.addEventListener("popstate", function(e) {
        onLoadTab();
    }, false);
    var state = {
        title: "",
        url: "#"
    };
    window.history.pushState(state, "", "#");
};
