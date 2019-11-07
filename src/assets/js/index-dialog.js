// import { magenta } from "ansi-colors";

// step1 输入姓名
// step2 输入姓名
// step3 输入生日
window.userData = {}
//let baseUrl = 'http://www.nihaodashi.com/nihaodashi'

$(function() {

    if(GetQueryString('version') === 'normal') {
        $('.price').html('9.9')
    }

    // 测试版本
    if(GetQueryString('debug') === '1') {
        localStorage.clear()
    }

    let myUserInfo = (JSON.parse(storage.getItem('myUserInfo'))) ? (JSON.parse(storage.getItem('myUserInfo'))).name : '';

    // 测试数据
    // let orderId = {
    //     orderId: 'dashi201904261208409699989'
    // }
    //setLocalStorage(orderId)

    // showDialogAsk();

    if (GetQueryString('orderId')) {
        // 如果有订单号，去查询订单状态
        let num = 0
        let timer = null
        let orderId = GetQueryString('orderId');
        var loop = function(){
            checkOrderSuccess(orderId)
            .then(function(){
                num++;
                if (config_PaySuccess) {
                    showDialogAsk();
                    clearTimeout(timer);
                } else if(num < 60 * 10){
                    reportInnerHtml(JSON.parse(storage.getItem('results')))
                    $('.result').show().siblings().hide();
                    $('.pay-dialog').hide();
                    timer = setTimeout(function(){
                        loop(orderId)
                    }, 1000);
                }
            })
        }
        loop()
    }



    // 如果本地有历史记录，出询问页，是否给自己算命
    // 如果是自己，直接显示命盘页
    // 如果是给别人算命，直接到性别选择页
    if (myUserInfo !== '') {
        // 询问 是否给自己算命
        pushData(100, 0, '');
    } else {

        // 输入姓名初始页
        //pushData(0, num, '');
    }

    // 给自己算命
    $('body').on('touchend', '.suanMyself', function() {
        _hmt.push(['_trackEvent', 'button', 'sendIsMyself', 1]);
        $('.loading').show().siblings().hide();
        $('.answer-content').append('<div class="dashi-content-mid"><div class="dashi-content-foot"></div></div>');
        $('.answer-content').append('<div class="dashi-content-mid"><div class="dashi-content-foot"></div></div>');
        a = 2;
        num = 2
        // 展示星盘页面
        let myUserInfo = JSON.parse(storage.getItem('myUserInfo'))
        window.userData = {
            name: myUserInfo.name,
            gender: myUserInfo.gender,
            birthDate: myUserInfo.birthDate,
            birthHour: myUserInfo.birthHour,
            isDoubleMonth: myUserInfo.isDoubleMonth,   // 是否闰月 1闰月 0不是闰月
            isSolarDate: myUserInfo.isSolarDate  // 是否阳历 1阳历 0阴历
        }
        drawChart()
    })

    weixinOnload()

    // 立即测算
    $('body').on('touchend', '.start-button', function() {
        $('.answer-1').show().siblings().hide();
        pushData(0, num, '');
    })

    // 吊起支付弹框
    $('body').on('touchend', '.result-pay-bottom,.result-pay-btn', function() {
        if (config_PaySuccess)
            return
        //showDialogAsk();

        if (is_neizhi() == 'weixin') {
            payForWechat();
            _hmt.push(['_trackPageview', '/weixinPay']);
        } else {
            _hmt.push(['_trackEvent', 'button', 'showPayDialog']);
            $('.pay-dialog').show();
            $('.pay-hint').html('当前算' + config_palace + '的用户给出的反馈，准确率为' + pay_probability)
        }
    })

    // 阴历阳历切换
    $('body').on('touchend', '.dashi-content-mid-data p>span', function() {
        $(this).parent().parent().children('.gearDatetime,input').remove();
        $(this).addClass('dashi-content-mid-data-p-span').siblings().removeClass('dashi-content-mid-data-p-span');
        $(this).parent().parent().append('<input id="data_demo" type="text" readonly="" name="input_date" placeholder="日期和时间选择特效" data-lcalendar="1936-01-01,2019-12-31" style="display:none;" />');
        getCalendar($(this)[0].attributes[0].value); // 0农历 1阳历
        config_calendarType = $(this)[0].attributes[0].value
    })

    // 命盘点击切换
    $('.star-map').on('touchend', '.span-top,.span-foot,.span-centerL>span,.span-centerR>span', function() {
        $('.span-center').css({
            'background': 'url(' + mImg[$(this)[0].attributes[0].value] + ') no-repeat',
            'background-size': '100% 100%'
        })
        _hmt.push(['_trackEvent', 'button', 'switchStarChart']);
    })

    // 输入框失去焦点事件
    $('body').on('blur', '.dashi-content-mid-input', function() {
        kickBack()
    })

    // 退出支付
    $('.pay-back').on('touchend', function() {
        $('.pay-dialog').hide()
    })

    // h5 微信支付
    $('.pay-h5').on('touchend', function() {
        payH5ForWechat()
        //alert('请在微信中打开该页面！')
        _hmt.push(['_trackPageview', '/weixinH5Pay']);
        
    })

    // 星盘下面的按钮点击，开始问答，去选择类型
    $('body').on('touchend', '.dashi-begin-machine', function(e) {
        $('.answer-2').show().siblings().hide()
    })
    
    // 选择类型
    $('body').on('touchend', '.selectType', function(e) {
        let sessionId = config_suan_other ? storage.getItem('otherSessionId') : storage.getItem('mySessionId')
        let sendText = $(this).attr('value');
        let askData = {
            sessionId: sessionId,
            count: 1,
            palace: parseInt(sendText),
            chatInfo: sendText
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
            $('.loading').show().siblings().hide()
            setTimeout(function() {
                getTempResult().then( (data)=> {
                    reportInnerHtml(data);
                })
                
            }, 200)
            setLocalStorages([{ 'palace': sendText }])
        })
        .catch(function (error) {
            console.log(error);
        });
    })

    // 揭秘答案
    $('body').on('touchend', '.see-result', function(e) {
        $('.loading').show().siblings().hide();
        setTimeout(function() {
            reportInnerHtml( JSON.parse(storage.getItem('results')) )
            $('.result').addClass('pay-success')
            $(document).scrollTop(0);
        }, 500)
    })

    // 继续算算
    $('body').on('touchend', '.result-continus', function(e) {
        // window.location.reload();
        let url = urlDelP(window.location.href, 'orderId')
        window.location.href = url + "&id=" + 10000 * Math.random();
    })

    // 发送按钮点击动画
    $('body').on('touchend', '.sendRadioSever,.sendName,.suanOther', function() {
        if($(this).hasClass('suanOther')) {
            config_suan_other = true;
        }
        //debugger
        if (a == 0) {
            // 姓名
            config_name = $(this).parent().prev().val()
            _hmt.push(['_trackEvent', 'button', 'sendName', config_name]);
        } else if (a == 1) {
            // 性别
            config_sex = $(this).html()
            _hmt.push(['_trackEvent', 'button', 'sendSex', config_sex]);
        } else if (a == 2) {
            // 生辰日期
            config_birth = $(this).html()
            
        }else if ( a == 100 ){
            // 是否给自己算命
            a = 0
            num = 0
            _hmt.push(['_trackEvent', 'button', 'sendIsMyself', 0]);
        }
        // 动画
        animation($(this).parent().parent(), $(this).parent().parent().offset().top);

        // 判断是否置灰
        if ($(this).css('color') == 'rgb(170, 174, 181)') {
            a--;
            num--;
            $(this).removeClass('dashi-content-foot-sendHui').siblings().removeClass('dashi-content-foot-sendHui')
            $('.dashi-content-mid').last().remove();
        } else {
            a++;
            num++;
            $(this).addClass('dashi-content-foot-sendHui').siblings().addClass('dashi-content-foot-sendHui')
            pushData(a, num, $(this).html())
        }
    })

    $('.renshu').html(9000000+ (Math.floor((+new Date() - 1557308298521)/100)))

    // 继续对话
    $('body').on('touchend', '.dashi-dialog-ask-answer', function(e) {
        $('.dashi-dialog-result').removeClass('init')
        let value = $(this).attr('value');
        let html = $(this).html();
        let $reslut = $('.dashi-dialog-result')
        $reslut.append('<p class="answer"><span>'+html+'</span></p>')
        $('.dashi-dialog-result').scrollTop(100000);
        $('.dashi-dialog-ask').html('');
        ask_dialog_step++
        beginAsk(value);
    })
})


function showDialogAsk () {
    $('.dashi-dialog-page').show().siblings().hide()
    $('.dashi-dialog-page .loadings').show()
    // 机器问答
    setTimeout(function() {
        beginAsk('');
    }, 500)
}

// 获取问答数据
function pushData(a, num, sendText) {
    $('.answer-content').append('<div class="dashi-content-mid"><div class="dashi-content-foot"></div></div>');
    if (a == 0) {
        $('.dashi-content-mid').eq(num).prepend(Mustache.render(htmlList.data0, {
            'text': '您好，我是人类历史上第一款基于《易经》中“天下第一神术”——紫微斗数，结合了人工智能技术的算命软件。请问怎么称呼您？'
        }))
        $('.dashi-content-mid').eq(num).children('.dashi-content-foot').prepend(Mustache.render(htmlList.data0_btn, {
            'text': '发送'
        }))
    } else if (a == 1) {
        $('.dashi-content-mid').eq(num).prepend(Mustache.render(htmlList.data1, {
            'text': '阴阳五行决定了你是一个什么性格的人。下面请告诉我你的性别，我来看一下你的阴阳五行：'
        }))
        $('.dashi-content-mid').eq(num).children('.dashi-content-foot').append(Mustache.render(htmlList.data1_btn, {
            'text': '男'
        }))
        $('.dashi-content-mid').eq(num).children('.dashi-content-foot').append(Mustache.render(htmlList.data1_btn, {
            'text': '女'
        }))
    } else if (a == 2) {
        $('.dashi-content-mid').eq(num).prepend(Mustache.render(htmlList.data2, {
            'text': '最后一步，告诉我你的出生年月日时间，我来给你排你的专属命盘。'
        }))
        getCalendar(1)
        $('.dashi-content-mid').eq(num).children('.dashi-content-foot').prepend(Mustache.render(htmlList.data2_btn, {
            'text': '确定'
        }))
    } else if (a == 100) {
        $('.dashi-content-mid').eq(num).prepend(Mustache.render(htmlList.data1, {
            'text': '你好，欢迎来到紫微斗数的世界，我是人类历史上第一款基于《易经》中“天下第一神术”——紫微斗数，结合了人工智能技术的算命软件。我会通过对话的形式与你沟通、为你算命，下面，请选择要算命的对象是谁？'
        }))
        $('.dashi-content-mid').eq(num).children('.dashi-content-foot').append(Mustache.render(htmlList.btn_myself, {
            'text': '我自己'
        }))
        $('.dashi-content-mid').eq(num).children('.dashi-content-foot').append(Mustache.render(htmlList.btn_other, {
            'text': '给别人'
        }))
    } else {
        // 机器问答
        setTimeout(function() {
            beginAsk(sendText);
        }, 200)
    } 
    $('.answer-1').show().siblings().hide()
}


// 绘制机器问答
function beginAsk (sendText) {
    let sessionId = config_suan_other ? storage.getItem('otherSessionId') : storage.getItem('mySessionId');
    let $div = $('.dashi-dialog-result');
    let askData = {
        sessionId: sessionId,
        count: askCount + 1,
        chatInfo: sendText || '',
        palace: parseInt(storage.getItem('palace'))
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
        //debugger
        _hmt.push(['_trackEvent', 'button', 'answer', JSON.stringify(askData)]);
        let responseData = response.data.result
        askCount = responseData.count;
        if(responseData.type === 0) {
            let arr = [];
            if (responseData.prefix && responseData.prefix !== '') {
                arr.push(responseData.prefix)
            }
            if (responseData.starContent && responseData.starContent !== '') {
                arr.push(responseData.starContent)
            }
            if (responseData.content && responseData.content !== '') {
                arr.push(responseData.content)
            }
            $div.append('<p class="loadings"><span><img class="load-image" src="assets/img/dialog-loading.gif" alt=""></span></p>')
            $('.dashi-dialog-result').scrollTop(100000); 
            for (let i = 0; i < arr.length; i++) {
                setTimeout( function() {
                    $div.find('.loadings').remove();
                    $div.append('<p class="question"><span>'+arr[i]+'</span></p>');
                    
                    if (i < arr.length -1 ) {
                        $div.append('<p class="loadings"><span><img class="load-image" src="assets/img/dialog-loading.gif" alt=""></span></p>')
                    }
                    $('.dashi-dialog-result').scrollTop(100000); 
                    if (i == arr.length -1 ) {
                        setTimeout(function() {
                            $('.dashi-dialog-ask').hide();
                            $('.dashi-dialog-ask').html(Mustache.render($('#jTmpl_dialog_ask').html(), {
                                'btnArr': responseData.optionList
                            }));
                            $('.dashi-dialog-ask').fadeIn(200);
                        }, 300)
                    }
                },  Math.max(1000, i * 1500) );
            }
            
        }
        if (responseData.type === 1) {
            // 把结论写入本地历史记录
            setLocalStorages([{ 'results': responseData.chatReport ?  responseData.chatReport : '' }])
            $div.append('<p class="loadings"><span><img class="load-image" src="assets/img/dialog-loading.gif" alt=""></span></p>')
            $('.dashi-dialog-result').scrollTop(100000); 
            setTimeout(function() {
                $div.find('.loadings').remove();
                $('.dashi-dialog-result').append('<p class="question"><span>与你交流的非常愉快，下面是根据你的对话，为你生成的个性化结论，希望我的建议能帮你克服生活中的不顺利，早日完成自己的愿望，每天生活快乐！</span></p>');
                $('.dashi-dialog-result').append('<button class="see-result">揭晓</button>');
                $('.dashi-dialog-result').scrollTop(100000); 
            }, 1500)  
        }
        
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
        name: config_name === '' ? '我的朋友' : config_name,
        gender:config_sex,
        birthDate:getBirthYear(config_birthday),
        birthHour: getBirthHour(config_birthday),
        isDoubleMonth: getIsRun(config_birthday),   // 是否闰月 1闰月 0不是闰月
        isSolarDate: parseInt(config_calendarType)  // 是否阳历 1阳历 0阴历
    }
    if (config_suan_other) {
        setLocalStorages([{ 'otherUserInfo': window.userData }])
    } else {
        setLocalStorages([{ 'myUserInfo': window.userData }])
    }
    setTimeout(function() {
        drawChart()
    }, 200)
})


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
        // $('.star-map .chart_map').html('');
        // $('.star-map .intro, .star-map .dashi-begin-machine').remove();
        if (response.data.code === 200 && response.data.result) {
            // 测试sessionId
            // dsuser201904181718195813744
            // dsuser201904191753396634903
            // dsuser201904181731580909544
            
            $('.star-map').show().siblings().hide();
            $('.loading').hide();
            let d4, d5, d6, d7;
            let responseData = response.data.result
            let responseCells = formatChartOrder(responseData.cells);
            let responseConfig = responseData.config;

            if (config_suan_other) {
                setLocalStorages([{ 'otherSessionId': responseConfig.userCode || 'dsuser201904181718195813744' }])
            } else {
                setLocalStorages([{ 'mySessionId': responseConfig.userCode || 'dsuser201904191753396634903' }])
            }
            
            for (let i = 0; i < 4; i++) {
                drawStarMapDiv(responseCells[i], function(starStr0, starStr1) {
                    $('.star-map .chart_map').append('<span type="' + i + '" class="span-top index-'+ i +'">' + starStr0 + starStr1 + '</span>')
                });
            }
            drawStarMapDiv(responseCells[4], function(starStr0, starStr1) {
                d4 = '<span type="' + 4 + '" class="spanCenterLRInFoot index-4">' + starStr0 + starStr1 + '<br class="clearfloat"></span>'
            });
            drawStarMapDiv(responseCells[5], function(starStr0, starStr1) {
                d5 = '<span type="' + 5 + '" class="spanCenterLRInTop index-5" >' + starStr0 + starStr1 + '<br class="clearfloat"></span>'
            });
            $('.star-map .chart_map').append('<span class="span-centerL">' + d4 + d5 + '</span>');
            $('.star-map .chart_map').append('<span class="span-center"><span><span>大师好 ·紫微斗数</span><span>姓名:' + window.userData.name + '&nbsp;' + responseConfig.shadowLight + responseConfig.sex + '&nbsp;' + responseConfig.fiveElement + '</span><span>身主：' + responseData.bodyMaster.name + '&nbsp;&nbsp;' + '命主：' + responseData.destinyMaster.name + '</span><span>农历：' + responseConfig.bornLunar + '</span><span>阳历：' + responseConfig.bornSolar + ' '+ responseConfig.bornTimeGround + '</span></span><br class="clearfloat"></span>');
            drawStarMapDiv(responseCells[6], function(starStr0, starStr1) {
                d6 = '<span type="' + 6 + '" class="spanCenterLRInFoot index-6">' + starStr0 + starStr1 + '<br class="clearfloat"></span>'
            });
            drawStarMapDiv(responseCells[7], function(starStr0, starStr1) {
                d7 = '<span type="' + 7 + '" class="spanCenterLRInTop index-7" >' + starStr0 + starStr1 + '<br class="clearfloat"></span>'
            });
            $('.star-map .chart_map').append('<span class="span-centerR">' + d6 + d7 + '</span>');

            for (let i = 8; i < 12; i++) {
                drawStarMapDiv(responseCells[i], function(starStr0, starStr1) {
                    $('.star-map .chart_map').append('<span type="' + i + '"class="span-foot index-'+ i +'">' + starStr0 + starStr1 + '</span>')
                });
            }
            // $('.star-map').append('');
            // $('.star-map').append('');
            _hmt.push(['_trackPageview', '/showStarChart']);
        }
    })
    .catch(function (error) {
        console.log(error);
    });
}

// 绘制星盘内部细节
function drawStarMapDiv(cells0, fn) {
    let starStr0 = '',
        starStr1 = '',
        _starStr = '';
    // 上一
    for (let c_a = 0; c_a < cells0.majorStars.length; c_a++) {
        //_starStr = _starStr + '<span>' + cells0.majorStars[c_a].name + '<span style="font-size:10px;color:#000;">' + cells0.majorStars[c_a].energy + '</span></span>'
        _starStr = _starStr + '<span>' + cells0.majorStars[c_a].name + '<span style="font-size:8px;color:#000;">' + cells0.majorStars[c_a].energy + '</span>' + '<span style="font-size:10px;background:#FF4D4F;color:#fff;">' + cells0.majorStars[c_a].starReaction + '</span>' + '<span style="background:#3C94FF;color:#000;">' + cells0.majorStars[c_a].starReactionYear + '</span>' + '</span>'
    }
    starStr0 = '<span style="color:#FF4D4F;">' + _starStr + '</span>';
    _starStr = '';
    // 上二
    for (let c_b = 0; c_b < cells0.minorStars.length; c_b++) {
        _starStr = _starStr + '<span style= "width:11px;">' + cells0.minorStars[c_b].name + '<span style="font-size:8px;color:#000;">' + cells0.minorStars[c_b].energy + '</span>' + '<span style="font-size:10px;background:#FF4D4F;color:#fff;">' + cells0.minorStars[c_b].starReaction + '</span>' + '</span>'
    }
    starStr0 = starStr0 + '<span style="color:#2ABFFF;font-size:10px;">' + _starStr + '</span>';
    _starStr = '';
    // 上三
    for (let c_c = 0; c_c < cells0.miniStars.length; c_c++) {
        _starStr = _starStr + '<span style= "width:11px;">' + cells0.miniStars[c_c] + '</span>'
    }
    starStr0 = starStr0 + '<span style="color:#000;font-size:10px;">' + _starStr + '</span>';
    _starStr = '';
    starStr0 = '<span class="td-left td-left-t">' + starStr0 + '</span>';

    // 下一
    _starStr = '<span style="color:#6ADCC3;">' + cells0.preDoctorStar + '</span>' + '<span>' + cells0.preAgeStar + '</span>' + '<span>' + cells0.preGeneralStar + '</span>';
    starStr1 = '<span style="color:#000;width:30%;">' + _starStr + '</span>';
    _starStr = '';

    // 下二
    // _starStr = '<span style="color:#6ADCC3;">'+ cells0.ageStart + '~' + cells0.ageEnd +'</span>';
    _starStr = '<span style="color:#6ADCC3;"></span>';
    starStr1 = starStr1 + '<span style="color:#FF4D4F;width:1%;font-size:6px;">' + _starStr + '</span>';
    _starStr = '';

    // 下三
    _starStr = '<span style="color:#FF4D4F;font-weight: 700;">' + cells0.temples[0] + '</span>' + '<span style="color:#000;font-weight: 700;">' + cells0.skyGround + '</span>';
    starStr1 = starStr1 + '<span style="color:#FF4D4F;width:69%;">' + _starStr + '</span>';
    starStr1 = '<span class="td-right td-right-b">' + starStr1 + '</span>';

    starStr1 = starStr1 + '<span style="position: absolute;top:50%;left:33%;font-size:12px;width:100%;color:#000;">' + cells0.ageStart + '~' + cells0.ageEnd + '</span><span style="position: absolute;top:0;left:0;width:100%;height:100%;"></span>'

    if (cells0.temples.length > 1) {
        starStr1 = starStr1 + '<span style="position: absolute;top: 38%;left: 70%;font-size:12px;width:100%;color:#000;">' + cells0.temples[1] + '</span>'
    }
    fn(starStr0, starStr1)
}

// 结论写入
function reportInnerHtml(msg) {
    let userInfo = config_suan_other ? JSON.parse(storage.getItem('otherUserInfo')) : JSON.parse(storage.getItem('myUserInfo'))
    $('.result').show().siblings().hide();
    $('.result-title').html(Mustache.render($('#jTmpl_result_title').html(), {
        name: userInfo.name || '',
        isSolarDate: userInfo.isSolarDate === 1 ? '阳历' : '阴历', // 是否阳历 1阳历 0阴历
        birth: userInfo.birthDate + ' ' + userInfo.birthHour
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
    config_palace = msg.typeName || '事业';
    _hmt.push(['_trackPageview', '/result']);
}




