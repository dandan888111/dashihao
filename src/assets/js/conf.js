
var storage = window.localStorage;
// 如果是想禁用长按弹出菜单, 用js
window.addEventListener('contextmenu', function(e){
	e.preventDefault();
});



var a = 0,
    num = 0,
    config_name = '', //姓名
    config_sex = '', //性别
    config_palace = '',//那方面（财富啥的）
    config_birthday = '', //生日
    config_birthPlace = '', //出生地a
    config_calendarType = '1',//1 农历 2 阳历
    config_openId ='',
    askCount = 0,
    ask_dialog_step = 0;
    config_suan_other = false,
    config_PaySuccess = '', //是否是完整报告
	pay_probability = parseInt(96 + Math.random() * (99 - 96))+'%！',  //支付概率初始化
    mImg = ['assets/img/m0.png','assets/img/m1.png','assets/img/m2.png','assets/img/m3.png','assets/img/m11.png','assets/img/m10.png','assets/img/m4.png','assets/img/m5.png','assets/img/m9.png','assets/img/m8.png','assets/img/m7.png','assets/img/m6.png'],
    wxSdk_title = [
        '我的命是顶级好命，但今年7月会有......',
        '紫薇大师说我命好，今年10月份有桃花...... ',
        '我今年的大限里，命特别牛逼，你也来看看你的......',
        '马云跟我的命局一样？我怎么今天才知道，后悔死了......',
        '我的命是罕见的大吉，今年10月份有财神关照，哈哈哈......',
        '我的命里有煞星，今年11月份会迎来改命机会，太赞了......',
        '据说这是张三丰师父创造的命理书，测了测我的命很......        ',
        '今年有凶星害我，我要来个逆天改命......',
        '2018年很多不顺都被我避开了，庆幸庆幸，看看2019年的......',
        '今年是我发财的机会，紫薇大师告诉我要保持......',
        '紫微斗数上说我今年犯桃花运，这么做就可以成为万人迷？',
        '乔布斯跟我同命？而且明年是我俩共同的大吉流年啊',
        '比尔盖茨的命跟竟然我一样，求大师帮我详解！',
        '吴磊适合找我这样的女朋友，紫薇大师来一卦，助我拥抱男神......',
        '卦面上说，我儿子会是富二代......',
        '我的命竟然是99分，极品好命，求大师指点一二，逆天改命......'
    ], //标题
    wxSdk_image = [
        'https://www.nihaodashi.com/dashihao/assets/img/share1.jpg',
        'https://www.nihaodashi.com/dashihao/assets/img/share2.jpg',
        'https://www.nihaodashi.com/dashihao/assets/img/share3.jpg',
        'https://www.nihaodashi.com/dashihao/assets/img/share4.jpg',
        'https://www.nihaodashi.com/dashihao/assets/img/share5.jpg',
        'https://www.nihaodashi.com/dashihao/assets/img/share6.jpg'
    ], //图片
    wxSdk_description = [
        '火爆朋友圈的AI算命，准确率95%，限时优惠中...',
        '和机器人聊3分钟就能了解一生运势，准得不行，限时优惠！',
        '朋友用人工智能算了一次，竟然算准了对象出轨……',
        '居然能算出吴磊喜欢什么样的女孩，你想不想测测看未来对象在哪？',
        '裁员潮滚滚，下个月能找到工作吗？测事业运，限时优惠！'
    ]; //描述

const htmlList = {
  data0:'<p class="dashi-content-mid-title" style="white-space:pre-line">{{text}}</p><input class="dashi-content-mid-input" type="text" name="" value="">',
  data1:'<p class="dashi-content-mid-title" style="white-space:pre-line">{{text}}</p><p class="dashi-content-mid-content" style="white-space:pre-line">{{content}}</p>',
  data2:'<p class="dashi-content-mid-title" style="white-space:pre-line">{{text}}</p><div class="dashi-content-mid-data"><p><span type="1" class="dashi-content-mid-data-p-span">阳历</span><span type="0">阴历</span></p><input id="data_demo" type="text" readonly="" name="input_date" placeholder="日期和时间选择特效" data-lcalendar="1936-01-01,2019-12-31" style="display:none;" /></div>',
  data3:'<p class="dashi-content-mid-title" style="white-space:pre-line">{{text}}</p><div class="dashi-content-mid-area"><div class="content-block"><input id="area_demo" type="text" readonly placeholder="城市选择特效" /><input id="area_value" type="hidden" /></div></div>',
  data4:'<p class="dashi-content-mid-title" style="white-space:pre-line">{{text}}</p>',

  data0_btn:'<p class="dashi-content-foot-send sendName" style="white-space:pre-line">{{text}}</p><br>',
  data1_btn:'<p class="dashi-content-foot-send dashi-content-foot-radio sendRadioSever" style="white-space:pre-line">{{text}}</p><br>',
  data2_btn:'<p class="dashi-content-foot-send lcalendar_finish" style="white-space:pre-line">{{text}}</p>',
  data3_btn:'<p class="dashi-content-foot-send larea_finish" style="white-space:pre-line">{{text}}</p>',
  data4_btn:'<p class="dashi-content-foot-send dashi-content-foot-ending" style="white-space:pre-line">{{text}}</p>',

  btn_myself:'<p class="dashi-content-foot-send dashi-content-foot-radio suanMyself" style="white-space:pre-line">{{text}}</p><br>',
  btn_other:'<p class="dashi-content-foot-send dashi-content-foot-radio suanOther" style="white-space:pre-line">{{text}}</p><br>',
  btn_chart:'<p class="dashi-content-foot-send dashi-content-foot-chart" style="white-space:pre-line">{{text}}</p><br>',
  btn_askBtn:'<p class="dashi-content-foot-send dashi-begin-machine" style="white-space:pre-line" value="{{value}}">{{text}}</p><br>',

  zwResultDiv0:'<span class="span-top">{{data}}</span>'
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
        }else{
          return theRequest
        }
        return theRequest;
    } else {
        return
    }
}

// 动画
function animation(_this, top) {
    if (_this.css('position') == 'static') {
        _this.css({
            'position': 'absolute',
            'width': 'calc(100% - .3rem - .3rem)',
            'bottom':0
        });
        // bottom: top + _this.height() - 42
        _this.animate({
            bottom: '2000px'
        }, 1000);
    } else if (_this.css('position') == 'absolute') {
        _this.animate({
            bottom: 0
        }, 1000);
        setTimeout(function() {
            _this.css({
                'position': 'static',
                'width': '100%'
            });
        }, 1000)
    }
}
// 生成sessionId
function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}

//设置cookie

function setCookie(c_name, value, expiredays) {
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = c_name + "=" + escape(value) +
        ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
        cookie.setMaxAge(60*60);
}
//取回cookie
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = document.cookie.length
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
}

// 页面回滚
function kickBack() {
  setTimeout(() => {
    window.scrollTo(0, document.body.scrollTop + 1);
    document.body.scrollTop >= 1 && window.scrollTo(0, document.body.scrollTop - 1);
  }, 10)
}

// 判断机型
function isIos() {
    var u = navigator.userAgent, app = navigator.appVersion;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
        return 'isAndroid'
    }
    if (isIOS) {
			return 'isIOS'
    }
};


function iterate (list) {
    var offset = 0
    return function () {
      if (offset === list.length) return null
  
      var len = list.length - offset
      var i = (Math.random() * len) | 0
      var el = list[offset + i]
  
      var tmp = list[offset]
      list[offset] = el
      list[offset + i] = tmp
      offset++
      return el
    }
}

  

let fateList = [
    '你生命中最真心相爱的人名字叫......',
    '你做......能赚到一笔不菲的收入。',
    '你身体的......最容易出故障，要好好保护。',
    '你的朋友......会助你发财，而这个朋友......会坑你。',
    '你做......行业才能做到高层的位置。',
    '父母',
    '你的孩子一定要做......能避免一场大灾。'
]

let typeName = [
    '婚姻',
    '财富',
    '健康',
    '交友',
    '事业',
    '父母',
    '子女'
]

let yearFortueList = [
    '婚姻',
    '财富',
    '健康',
    '交友',
    '事业',
    '父母',
    '子女'
]

let yearAdviceList = [
    '怎么做才能收获爱情，家庭幸福美满？',
    '怎么做才能把握今年这一桶金？',
    '做些什么才能健健康康一整年？',
    '告诉你哪些朋友应该交，哪些朋友应该远离？',
    '做哪些事情能职位高升或发财？',
    '父母',
    '做什么能改变孩子一生的命运？'
]

let fateAdviceList = [
    '如何克制自己性格的缺点？',
    '怎么才能把握新的财富机会？',
    '如何注意生活细节才能健康长寿？',
    '怎么才能事业更进一步？',
    '怎么做才能收获真爱和美满的家庭？',
    '今年要躲着点这几件事，否则遗憾终生。',
    '今年要做这几件事，能扭转财运。',
    '怎么做能让自己的运势旺起来？',
    '今年有哪些潜在的幸运机会或桃花点？',
]

function getTempResult () {
    let type = parseInt(storage.getItem('palace'))
    let ite = iterate(fateAdviceList);
    let sessionId = config_suan_other ? storage.getItem('otherSessionId') : storage.getItem('mySessionId');
    let arr1 = [];
    arr1.push('1、' + ite() + '<br />')
    arr1.push('2、' + ite() + '<br />')
    arr1.push('3、' + ite() + '<br />')
    return axios({
        method: "post",
        url: baseUrl + '/services/v1/question/prefix',
        data: { 
            sessionId: sessionId,
            count: 1,
            chatInfo: '1',
            palace: parseInt(storage.getItem('palace'))
        },
        headers:{
            "version": "v1",
            "platform": "ios",
            "Token": "7e2d0ec641474c1985758959825cc1f9de29b2f02be84d90b9a7dc1edf731eba",
            "Content-Type": "application/json"
        }
    }).then(function (response) {

        let tempResult = {
            "score": "94.0",
            "typeName": yearFortueList[type],
            "fateName": "吉/凶",
            "fate": fateList[type],
            "yearFortue": response.data.result.chatReport.yearFortue,
            "yearAdvice": yearAdviceList[type],
            "fateAdvice": arr1.join(' ')
        }

        setLocalStorages([{ 'results': tempResult }])

        //debugger
        return tempResult;
    })
    .catch(function (error) {
        console.log(error);
    });
}
