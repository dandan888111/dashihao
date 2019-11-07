// import { magenta } from "ansi-colors";

// step1 输入姓名
// step2 输入姓名
// step3 输入生日
window.userData = {}
let baseUrl = 'http://www.nihaodashi.com:8088/nihaodashi'

$(function() {

    // 如果本地有历史记录，出询问页，是否给自己算命
    // 如果是自己，直接显示命盘页
    // 如果是给别人算命，直接到性别选择页
    if (storage.getItem('name')) {
        // 询问 是否给自己算命
        pushData(100, 0, '');
    } else {
        // 输入姓名初始页
        pushData(0, num, '');
    }

    // 给自己算命
    $('body').on('click', '.suanMyself', function() {
        $('.loading').show().siblings().hide();
        $('.suan-content').append('<div class="suan-content-mid"><div class="suan-content-foot"></div></div>');
        $('.suan-content').append('<div class="suan-content-mid"><div class="suan-content-foot"></div></div>');
        a = 2;
        num = 2
        // 展示星盘页面
        window.userData = {
            name: storage.getItem('name'),
            gender: storage.getItem('gender'),
            birthDate: storage.getItem('birthDate'),
            birthHour: storage.getItem('birthHour'),
            isDoubleMonth: storage.getItem('isDoubleMonth'),   // 是否闰月 1闰月 0不是闰月
            isSolarDate: storage.getItem('isSolarDate')  // 是否阳历 1阳历 0阴历
        }
        drawChart()
    })

    weixinOnload()
    if (ios == -1) {
        //ios下运行
        var divEl1 = document.querySelector('#zwResultDiv');
        var divEl2 = document.querySelector('.suan2-content');
        iosTrouchFn(divEl1, divEl2);
    }


    // 判断支付是否成功
    if (getRequest() && getRequest().out_trade_no) {
        payForAliIsSuccess(getRequest().out_trade_no, function(res) {
            if (res.tradeStatus == 1) {
                $('.suan2').show().siblings().hide();
                integrityReport(res.sessionId, 1, function(res) {
                    if (res) {
                        reportInnerHtml('true')
                    }
                })
            } else if (res.tradeStatus == 0) {
                $('.suan2').show().siblings().hide();
                integrityReport(res.sessionId, 0, function() {
                    reportInnerHtml();
                    $('.suan2-pay').show();
                    $('.pay').show();
                    _czc.push(﻿["_trackEvent", '支付页面支付失败', '自动调起']);
                })
            }
        });
    } else if (getRequest() && getRequest().sessionId) {
        integrityReport(getRequest().sessionId, 0, function() {
            reportInnerHtml();
            $('.suan2-pay').show();
            config_sessionId = getRequest().sessionId
        })
    }
    
    // 监听姓名输入
    $("body").bind("input propertychange", '.suan-content-mid-input', function(event) {
        // if ($(".suan-content-mid-input").val()) {
        //     if ($(".suan-content-mid-input").val()) {
        //         $('.suan-content-mid-input').next('.suan-content-foot').children('p').addClass('suan-content-foot-sendOrange').removeClass('suan-content-foot-sendHui');
        //     } else {
        //         $('.suan-content-mid-input').next('.suan-content-foot').children('p').addClass('suan-content-foot-sendHui').removeClass('suan-content-foot-sendOrange');
        //     }
        // } else {
        //     $('.suan-content-mid-input').next('.suan-content-foot').children('p').addClass('suan-content-foot-sendHui').removeClass('suan-content-foot-sendOrange');
        // }
    });

    // 吊起支付弹框
    $('body').on('click ', '.suan2-pay-bottom,.result-content', function() {
        alert('a')
        if (config_isReportSuccess)
            return
        if (is_neizhi() == 'weixin') {
            payForWechat(3, config_openId);
        } else {
            $('.pay').show();
            $('.pay-hint').html('当前算' + config_palace + '的用户给出的反馈，准确率为' + pay_probability)
        }
    })

    // 阴历阳历切换
    $('body').on('click', '.suan-content-mid-data p>span', function() {
        $(this).parent().parent().children('.gearDatetime,input').remove();
        $(this).addClass('suan-content-mid-data-p-span').siblings().removeClass('suan-content-mid-data-p-span');
        $(this).parent().parent().append('<input id="data_demo" type="text" readonly="" name="input_date" placeholder="日期和时间选择特效" data-lcalendar="1936-01-01,2019-12-31" style="display:none;" />');
        getCalendar($(this)[0].attributes[0].value); // 0农历 1阳历
        config_calendarType = $(this)[0].attributes[0].value
    })

    // 查看命盘
    $('body').on('click', '.suan-content-foot-chart', function() {
        // 直接显示命盘页面即可
        $('#zwResultDiv').show().siblings().hide();
        $('#zwResultDiv').addClass('has-back').find('.suan-begin-machine').addClass('back-btn').removeClass('suan-begin-machine').html('返回')
    });

    // 命盘 返回上一个页面
    $('#zwResultDiv').on('click', '.back-btn', function() {
        $('.suan-dialog-page').show().siblings().hide()
        scrollBottom();
    })

    // 命盘点击切换
    $('#zwResultDiv').on('click', '.spanTop,.spanFoot,.spanCenterL>span,.spanCenterR>span', function() {
        $('.spanCenter').css({
            'background': 'url(' + mImg[$(this)[0].attributes[0].value] + ') no-repeat',
            'background-size': '100% 100%'
        })
    })

    // 结束
    $('body').on('click', '.suan-content-foot-ending', function() {
        $('.loading').show().siblings().hide();
        setTimeout(function() {
            reportInnerHtml()
        }, 1500)
        var newurl = updateQueryStringParameter(window.location.href, 'sessionId', config_sessionId);
        window.history.replaceState({
            path: newurl
        }, '', newurl);
    })

    // 输入框失去焦点事件
    $('body').on('blur', '.suan-content-mid-input', function() {
        kickBack()
    })

    // 退出支付
    $('.pay-back').on('click', function() {
        $('.pay').hide()
    })

    // 支付选择事件
    $('.pay-change>p').on('click', function() {
        $(this).children('img:odd').attr('src', './img/end.png').css({
            'border': 'none',
            'width': '.21rem',
            'height': '.21rem'
        }).parent().siblings().children('img:odd').attr('src', '').css({
            'border': '0.01rem solid #DDDDDD',
            'width': '.19rem',
            'height': '.19rem'
        })
        confit_pay = $(this)[0].attributes[0].value
    })

    $('.pay-btn').on('click', function() {
        if (confit_pay == 1) {
            payForWechat(1)
        } else if (confit_pay == 2) {
            payForAli()
        }
    })

    // 重新加载按钮,重新开始按钮
    $('.suan1>p').on('click', function() {
        window.location.href = requsetUrl + '/duosuansuan?channel=' + ((storage.getItem('channel') || getRequest().channel) ? (storage.getItem('channel') || getRequest().channel) : '');
    })

    $('.suan2-pay-suaxin').on('click', function() {
        // _czc.push(﻿["_trackEvent", '重新开始按钮', '点击']);
        window.location.href = requsetUrl + '/duosuansuan?channel=' + ((storage.getItem('channel') || getRequest().channel) ? (storage.getItem('channel') || getRequest().channel) : '');
    })

    // 开始机器问答
    $('body').on('click', '.suan-begin-machine', function(e) {
        $('.suan-dialog-page').show().siblings().hide()
        $('.suan-dialog-page .loadings').show()
        // 机器问答
        setTimeout(function() {
            beginAsk('');
        }, 500)
    })

    // 继续对话
    $('body').on('click', '.suan-dialog-ask-answer', function(e) {
        ask_dialog_step++
        $('.suan-dialog-result').removeClass('init')
        let value = $(this).attr('value');
        $('.suan-dialog-result-list').append(Mustache.render($('#jTmpl_dialog_result').html(), {
            'ask': $(this).parent().siblings('.suan-dialog-ask-title').html(),
            'answer': $(this).html()
        }));
        $('.suan-dialog-ask').html('');
        let $reslut = $('.suan-dialog-result-list div').eq(ask_dialog_step-1)
        $reslut.find('.left').fadeIn(300, function() {
            $reslut.find('.right').fadeIn(300, function() {
                $('.suan-dialog-page .loadings').show()
                changeTrains(value);
            });
        });
    })


    $('body').on('click', '.suan2-suan-continus-btn', function(e) {
        $('.suan2').addClass('pay-success')
    })

    // 发送按钮点击动画
    $('body').on('click', '.sendRadioSever,.sendName,.suanOther', function() {
        if (a == 0) {
            // 姓名
            config_name = $(this).parent().prev().val()
        } else if (a == 1) {
            // 性别
            config_sex = $(this).html()
        } else if (a == 2) {
            // 生辰日期
            config_birth = $(this).html()
            
        }else if ( a == 100 ){
            // 是否给自己算命
            a = 0
            num = 0
        }
        // 动画
        animation($(this).parent().parent(), $(this).parent().parent().offset().top);

        // 判断是否置灰
        if ($(this).css('color') == 'rgb(170, 174, 181)') {
            a--;
            num--;
            $(this).removeClass('suan-content-foot-sendHui').siblings().removeClass('suan-content-foot-sendHui')
            $('.suan-content-mid').last().remove();
        } else {
            a++;
            num++;
            $(this).addClass('suan-content-foot-sendHui').siblings().addClass('suan-content-foot-sendHui')
            pushData(a, num, $(this).html())
        }
    })
})

function changeTrains (sendText){
    setTimeout(function() {
        beginAsk(sendText);
    }, 800)
}

// 获取问答数据
function pushData(a, num, sendText) {
    $('.suan-content').append('<div class="suan-content-mid"><div class="suan-content-foot"></div></div>');
    if (a == 0) {
        $('.suan-content-mid').eq(num).prepend(Mustache.render(htmlList.data0, {
            'text': '你好，我是人类历史上第一款基于“天下第一神术”——紫微斗数，结合了人工智能技术的算命软件。我会结合你的生辰八字，然后通过对话的方式与你沟通，帮你算命。下面，赶快输入姓名使用吧！'
        }))
        $('.suan-content-mid').eq(num).children('.suan-content-foot').prepend(Mustache.render(htmlList.data0_btn, {
            'text': '发送'
        }))
    } else if (a == 1) {
        $('.suan-content-mid').eq(num).prepend(Mustache.render(htmlList.data1, {
            'text': '阴阳五行决定了你是一个什么性格的人。下面请告诉我你的性别，我来看一下你的阴阳五行：'
        }))
        $('.suan-content-mid').eq(num).children('.suan-content-foot').append(Mustache.render(htmlList.data1_btn, {
            'text': '男'
        }))
        $('.suan-content-mid').eq(num).children('.suan-content-foot').append(Mustache.render(htmlList.data1_btn, {
            'text': '女'
        }))
    } else if (a == 2) {
        $('.suan-content-mid').eq(num).prepend(Mustache.render(htmlList.data2, {
            'text': '天干代表天，地支代表地，组合在一起，代表了完整的天地。下面告诉你的生辰八字，也就是出生年月日时，我来找到你在天地间的位置吧。'
        }))
        getCalendar(1)
        $('.suan-content-mid').eq(num).children('.suan-content-foot').prepend(Mustache.render(htmlList.data2_btn, {
            'text': '确定'
        }))
    } else if (a == 100) {
        $('.suan-content-mid').eq(num).prepend(Mustache.render(htmlList.data1, {
            'text': '是否给您自己算命：'
        }))
        $('.suan-content-mid').eq(num).children('.suan-content-foot').append(Mustache.render(htmlList.btn_myself, {
            'text': '是'
        }))
        $('.suan-content-mid').eq(num).children('.suan-content-foot').append(Mustache.render(htmlList.btn_other, {
            'text': '给朋友算命'
        }))
    } else {
        // 机器问答
        setTimeout(function() {
            beginAsk(sendText);
        }, 200)
    } 
}

// 绘制机器问答
function beginAsk (sendText) {
    let askData = {
        sessionId: window.userSessionId,
        count: askCount + 1,
        chatInfo: sendText || ''
    }
    axios({
        method: "post",
        url: baseUrl + '/services/v1/question/star',
        data: askData,
        headers:{
            "version": "v1",
            "platform": "ios",
            "Token": "7e2d0ec641474c1985758959825cc1f9de29b2f02be84d90b9a7dc1edf731eba",
            "Content-Type": "application/json"
        }
    }).then(function (response) {
        $('.suan-dialog-page .loadings').hide()
        let responseData = response.data.result
        askCount = responseData.count

        if(responseData.type === 0) {
            $('.suan-dialog-ask').hide();
            $('.suan-dialog-ask').html(Mustache.render($('#jTmpl_dialog_ask').html(), {
                'text': responseData.starContent ? responseData.starContent : '' + '' + responseData.content ? responseData.content : '',
                'btnArr': responseData.optionList
            }));
            $('.suan-dialog-ask').fadeIn(800, function() {});
        }

        if (responseData.type === 1) {
            $('.loading').show().siblings().hide();
            setTimeout(function() {
                reportInnerHtml(responseData.chatReport)
            }, 500)
        }
        scrollBottom()
    })
    .catch(function (error) {
        console.log(error);
    });
}

// 输入完日期，绘制命盘
$(document).on('SELECT-BITRTH', function(e){
    console.log('用户信息读取写入')
    $('.loading').show().siblings().hide();
    window.userData = {
        name: config_name === '' ? '游客' : config_name,
        gender:config_sex,
        birthDate:getBirthYear(config_birthday),
        birthHour: getBirthHour(config_birthday),
        isDoubleMonth: getIsRun(config_birthday),   // 是否闰月 1闰月 0不是闰月
        isSolarDate: parseInt(config_calendarType)  // 是否阳历 1阳历 0阴历
    }
    setLocalStorage(window.userData)

    setTimeout(function() {
        drawChart()
    }, 200)
})

// js滚动到页面底部
function scrollBottom () {
    var h = $(document).height() - $(window).height();
    $(document).scrollTop(h); 
}

// 格式化星盘的顺序为显示的顺序
function formatChartOrder (arr) {
    let returnArr = [];
    returnArr.push(arr[5])
    returnArr.push(arr[6])
    returnArr.push(arr[7])
    returnArr.push(arr[8])
    returnArr.push(arr[4])
    returnArr.push(arr[3])
    returnArr.push(arr[9])
    returnArr.push(arr[10])
    returnArr.push(arr[2])
    returnArr.push(arr[1])
    returnArr.push(arr[0])
    returnArr.push(arr[11])
    return returnArr
}

// 绘制命盘
function drawChart () {
    axios({
        method: "post",
        url: baseUrl + '/services/v1/dsUserInfo/save/info',
        data: window.userData,
        headers:{
            "version": "v1",
            "platform": "ios",
            "Token": "7e2d0ec641474c1985758959825cc1f9de29b2f02be84d90b9a7dc1edf731eba",
            "Content-Type": "application/json"
        }
    }).then(function (response) {

        if (response.data.code === 200 && response.data.result) {
            // 测试sessionId
            // dsuser201904181718195813744
            // dsuser201904191753396634903
            // dsuser201904181731580909544
            
            $('#zwResultDiv').show().siblings().hide();
            $('.loading').hide();
            let d4, d5, d6, d7;
            let responseData = response.data.result
            let responseCells = formatChartOrder(responseData.cells);
            let responseConfig = responseData.config;
            window.userSessionId = responseConfig.userCode || 'dsuser201904181718195813744';

            for (let i = 0; i < 4; i++) {
                zwResultDiv(responseCells[i], function(starStr0, starStr1) {
                    $('#zwResultDiv .chart_map').append('<span type="' + i + '" class="spanTop index-'+ i +'">' + starStr0 + starStr1 + '</span>')
                });
            }
            zwResultDiv(responseCells[4], function(starStr0, starStr1) {
                d4 = '<span type="' + 4 + '" class="spanCenterLRInFoot index-4">' + starStr0 + starStr1 + '<br class="clearfloat"></span>'
            });
            zwResultDiv(responseCells[5], function(starStr0, starStr1) {
                d5 = '<span type="' + 5 + '" class="spanCenterLRInTop index-5" >' + starStr0 + starStr1 + '<br class="clearfloat"></span>'
            });
            $('#zwResultDiv .chart_map').append('<span class="spanCenterL">' + d4 + d5 + '</span>');
            $('#zwResultDiv .chart_map').append('<span class="spanCenter"><span><span>多算算·紫微斗数</span><span>姓名：' + window.userData.name + '&nbsp;&nbsp;' + responseConfig.shadowLight + responseConfig.sex + '&nbsp;&nbsp;&nbsp;&nbsp;' + responseConfig.fiveElement + '</span><span>身主：' + responseData.bodyMaster.name + '&nbsp;&nbsp;' + '命主：' + responseData.destinyMaster.name + '</span><span>农历：' + responseConfig.bornLunar + '</span><span>阳历：' + responseConfig.bornSolar + ' '+ responseConfig.bornTimeGround + '</span></span><br class="clearfloat"></span>');
            zwResultDiv(responseCells[6], function(starStr0, starStr1) {
                d6 = '<span type="' + 6 + '" class="spanCenterLRInFoot index-6">' + starStr0 + starStr1 + '<br class="clearfloat"></span>'
            });
            zwResultDiv(responseCells[7], function(starStr0, starStr1) {
                d7 = '<span type="' + 7 + '" class="spanCenterLRInTop index-7" >' + starStr0 + starStr1 + '<br class="clearfloat"></span>'
            });
            $('#zwResultDiv .chart_map').append('<span class="spanCenterR">' + d6 + d7 + '</span>');

            for (let i = 8; i < 12; i++) {
                zwResultDiv(responseCells[i], function(starStr0, starStr1) {
                    $('#zwResultDiv .chart_map').append('<span type="' + i + '"class="spanFoot index-'+ i +'">' + starStr0 + starStr1 + '</span>')
                });
            }

            $('#zwResultDiv').append('<div class="color-fff intro">这是依据紫微斗数安星诀为您生成的命盘，接下来很重要，请认真作答，现在让我们开始吧！</div>');
            $('#zwResultDiv').append('<div class="suan-begin suan-begin-machine">好的</div>');
        }
    })
    .catch(function (error) {
        console.log(error);
    });
}

// 绘制星盘内部细节
function zwResultDiv(cells0, fn) {
    let starStr0 = '',
        starStr1 = '',
        _starStr = '';
    // 上一
    for (let c_a = 0; c_a < cells0.majorStars.length; c_a++) {
        //_starStr = _starStr + '<span>' + cells0.majorStars[c_a].name + '<span style="font-size:10px;color:#fff;">' + cells0.majorStars[c_a].energy + '</span></span>'
        _starStr = _starStr + '<span>' + cells0.majorStars[c_a].name + '<span style="font-size:8px;color:#fff;">' + cells0.majorStars[c_a].energy + '</span>' + '<span style="background:#FF4D4F;color:#fff;">' + cells0.majorStars[c_a].starReaction + '</span>' + '<span style="background:#3C94FF;color:#fff;">' + cells0.majorStars[c_a].starReactionYear + '</span>' + '</span>'
    }
    starStr0 = '<span style="color:#FF4D4F;">' + _starStr + '</span>';
    _starStr = '';
    // 上二
    for (let c_b = 0; c_b < cells0.minorStars.length; c_b++) {
        _starStr = _starStr + '<span style= "width:11px;">' + cells0.minorStars[c_b].name + '<span style="font-size:10px;color:#fff;">' + cells0.minorStars[c_b].energy + '</span>' + '</span>'
    }
    starStr0 = starStr0 + '<span style="color:#2ABFFF;font-size:10px;">' + _starStr + '</span>';
    _starStr = '';
    // 上三
    for (let c_c = 0; c_c < cells0.miniStars.length; c_c++) {
        _starStr = _starStr + '<span style= "width:11px;">' + cells0.miniStars[c_c] + '</span>'
    }
    starStr0 = starStr0 + '<span style="color:#fff;font-size:10px;">' + _starStr + '</span>';
    _starStr = '';
    starStr0 = '<span class="tdLeft tdLeft-t">' + starStr0 + '</span>';

    // 下一
    _starStr = '<span style="color:#6ADCC3;">' + cells0.preDoctorStar + '</span>' + '<span>' + cells0.preAgeStar + '</span>' + '<span>' + cells0.preGeneralStar + '</span>';
    starStr1 = '<span style="color:#fff;width:30%;">' + _starStr + '</span>';
    _starStr = '';

    // 下二
    // _starStr = '<span style="color:#6ADCC3;">'+ cells0.ageStart + '~' + cells0.ageEnd +'</span>';
    _starStr = '<span style="color:#6ADCC3;"></span>';
    starStr1 = starStr1 + '<span style="color:#FF4D4F;width:1%;font-size:6px;">' + _starStr + '</span>';
    _starStr = '';

    // 下三
    _starStr = '<span style="color:#fff;">' + cells0.temples[0] + '</span>' + '<span style="color:#fff;font-weight: 700;">' + cells0.skyGround + '</span>';
    starStr1 = starStr1 + '<span style="color:#FF4D4F;width:69%;">' + _starStr + '</span>';
    starStr1 = '<span class="tdRight tdRight-b">' + starStr1 + '</span>';

    starStr1 = starStr1 + '<span style="position: absolute;top:50%;left:33%;font-size:12px;width:100%;color:#fff;">' + cells0.ageStart + '~' + cells0.ageEnd + '</span><span style="position: absolute;top:0;left:0;width:100%;height:100%;"></span>'

    if (cells0.temples.length > 1) {
        starStr1 = starStr1 + '<span style="position: absolute;top: 38%;left: 70%;font-size:12px;width:100%;color:#fff;">' + cells0.temples[1] + '</span>'
    }
    fn(starStr0, starStr1)
}

// 结论写入
function reportInnerHtml(msg) {
    $('.suan2').show().siblings().hide();
    $('.suan2-title').html(Mustache.render($('#jTmpl_result_title').html(), {
        name: window.userData.name,
        isSolarDate: window.userData.isSolarDate === '1' ? '阳历' : '阴历', // 是否阳历 1阳历 0阴历
        birth: window.userData.birthDate + ' ' + window.userData.birthHour
    }));
    if (msg.fate) {
        $('.result-list_fate').html(Mustache.render($('#jTmpl_result_fate').html(), {
            score: msg.score || 95,
            txt: msg.fate
        }));
    }
    if (msg.yearFortue) {
        $('.result-list-yearFortue').html(Mustache.render($('#jTmpl_result_yearFortue').html(), {
            fateName: msg.fateName || '吉',
            typeName: msg.typeName || '事业',
            txt: msg.yearFortue
        }));
    }
    if (msg.yearAdvice) {
        $('.result-list-yearAdvice').html(Mustache.render($('#jTmpl_result_yearAdvice').html(), {
            txt: msg.yearAdvice
        }));
    }
    if (msg.fateAdvice) {
        $('.result-list-fateAdvice').html(Mustache.render($('#jTmpl_result_fateAdvice').html(), {
            txt: msg.fateAdvice
        }));
    }
}

// 查看完整诊断报告
function integrityReport(sessionId, tradeStatus, fn) {
    $.ajax({
        type: "GET",
        url: requsetUrl + "/DaBaiFortuneTelling/v1/fortuneTelling/report",
        data: {
            sessionId: sessionId,
            // tradeStatus: tradeStatus
        },
        success: function(msg) {
            if (msg.data && msg.data.report) {
                config_name = msg.data.name; //姓名
                config_sex = msg.data.gender; //性别
                config_birthday = msg.data.birthday; //生日
                config_calendarType = msg.data.calendarType; //0 农历 1 阳历
                config_report = msg.data.report;
                config_palace = msg.data.palace;
                $('.pay-hint').html('当前算' + config_palace + '的用户给出的反馈，准确率为' + pay_probability)
                fn(true)
            } else {
                $('.suan0').show().siblings().hide();
                fn()
            }
        },
        error: function(msg) {
            //alert('error-->' + msg)
        }
    });
}
 
// 开始会话的问题
function sendMsgToSever(chatInfo, fn) {
    $.ajax({
        type: "GET",
        url: requsetUrl + "/DaBaiFortuneTelling/v1/fortuneTelling/chat",
        data: {
            sessionId: config_sessionId,
            chatInfo: chatInfo || '',
            palace: config_palace,
            type: config_type,
            calendarType: config_calendarType,
            gender: config_sex,
            birthday: config_birthday,
            name: config_name
        },
        success: function(msg) {
            console.log(msg)
            fn(msg)
        },
        error: function(msg) {
            a--;
            num--;
            config_reloadData = chatInfo || '';
            $('.suan1').show().siblings().hide();
        }
    });
}

function updateQueryStringParameter(uri, key, value) {
    if (!value) {
        return uri;
    }
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    } else {
        return uri + separator + key + "=" + value;
    }
}

// 支付宝支付
function payForAli() {
    $.ajax({
        type: "GET",
        url: requsetUrl + "/DaBaiFortuneTelling/v1/report/zfbPay",
        data: {
            userId: '',
            money: '8.8',
            sessionId: config_sessionId,
            type: 1,
            clientType: 1,
            channel: storage.getItem('channel') || getRequest().channel
        },
        success: function(msg) {
            $('body').append(msg.data)
        },
        error: function(msg) {}
    });
}

// 微信支付
function payForWechat(clientType, openid) {
    $.ajax({
        type: "GET",
        url: requsetUrl + "/DaBaiFortuneTelling/v1/report/wxPay",
        data: {
            money: '8.8',
            sessionId: config_sessionId,
            type: 1,
            clientType: clientType,
            openId: openid,
            channel: storage.getItem('channel') || getRequest().channel
        },
        success: function(msg) {
            if (clientType == 1) {
                window.location.href = msg.data
            } else if (clientType == 3) {
                wx.chooseWXPay({
                    timestamp: msg.data.timeStamp,
                    nonceStr: msg.data.nonceStr,
                    package: msg.data.package,
                    signType: msg.data.signType,
                    paySign: msg.data.paySign,
                    success: function(res) {
                        if (res.errMsg === 'chooseWXPay:ok') {
                            integrityReport(config_sessionId, 1, function() {
                                reportInnerHtml(true)
                            })
                        }
                    },
                    // 支付取消回调函数
                    cencel: function(res) {
                        console.log('用户取消支付~')
                    },
                    // 支付失败回调函数
                    fail: function(res) {
                        console.log('支付失败~' + res.errMsg)
                    }
                })
            }

        },
        error: function(msg) {
            console.log(msg)
            alert('drror')
        }
    });
}

function weixinOnload() {
    if (is_neizhi() == 'weixin') {
        wx_login(function(res) {
            config_openId = res;
            wxSdk(
                '多算算—人工智能算命', 
                wxSdk_description[parseInt(Math.random() * wxSdk_description.length)], 
                requsetUrl + '/duosuansuan?channel=' + (getRequest().channel ? getRequest().channel : 'weixin'), 
                requsetUrl + '/duosuansuan/img/wx-Img.jpg'
            );
            _czc.push(﻿["_trackEvent", '微信内部', 'h5显示']);
        }, window.location.href)
    } else {
        _czc.push(﻿["_trackEvent", '微信外部', 'h5显示']);
    }
}

// 查看是否支付成功
function payForAliIsSuccess(out_trade_no, fn) {
    $.ajax({
        type: "GET",
        url: requsetUrl + "/DaBaiFortuneTelling/v1/zfbPay/tradeStatus",
        data: {
            out_trade_no: out_trade_no
        },
        success: function(msg) {
            console.log($('.suan2-content').children().length > 0)
            if ($('.suan2-content').children().length > 0)
                return
            if (msg.data.tradeStatus == -1) {
                if (url_setInterval_num < 5) {
                    $('.loading').show().siblings().hide();
                }
                clearInterval(url_setInterval)
                if (url_setInterval_num == 5) {
                    config_sessionId = msg.data.sessionId
                    fn({
                        sessionId: msg.data.sessionId,
                        tradeStatus: 0
                    })
                }
                if (url_setInterval_num > 20) {
                    clearInterval(url_setInterval)
                }
                url_setInterval = setInterval(function() {
                    if (url_setInterval_num < 20) {
                        payForAliIsSuccess(out_trade_no, fn);
                    }
                    url_setInterval_num++;
                }, 1000)
            } else {
                if (url_setInterval)
                    clearInterval(url_setInterval)
                url_setInterval_num = 100;
                config_sessionId = msg.data.sessionId
                fn({
                    sessionId: msg.data.sessionId,
                    tradeStatus: msg.data.tradeStatus
                })
            }
        },
        error: function(msg) {
            console.log(msg)
        }
    });
}