const requsetUrl = 'https://www.huiyidabai.cn';

var ios = navigator.userAgent.indexOf('iphone');//判断是否为ios

var storage = window.localStorage;
// 如果是想禁用长按弹出菜单, 用js
window.addEventListener('contextmenu', function(e){
	e.preventDefault();
});

function iosTrouchFn(el1,el2) {
    //el需要滑动的元素
    el1.addEventListener('touchmove',function(e){
        e.isSCROLL = true;
    })
    if(el2){
      el2.addEventListener('touchmove',function(e){
          e.isSCROLL = true;
      })
    }
    document.body.addEventListener('touchmove',function(e){
        if(!e.isSCROLL){
            e.preventDefault(); //阻止默认事件(上下滑动)
        }else{
            // //需要滑动的区域
            // var top = el.scrollTop; //对象最顶端和窗口最顶端之间的距离
            // var scrollH = el.scrollHeight; //含滚动内容的元素大小
            // var offsetH = el.offsetHeight; //网页可见区域高
            // var cScroll = top + offsetH; //当前滚动的距离
            //
            // //被滑动到最上方和最下方的时候
            // if(top == 0){
            //     top = 1; //0～1之间的小数会被当成0
            // }else if(cScroll === scrollH){
            //       el.scrollTop = top - 0.1;
            // }
        }
    }, {passive: false}) //passive防止阻止默认事件不生效
}

var a = 0,
    num = 0,
    icalendarM = '',
    config_name = '', //姓名
    config_sex = '', //性别
    config_palace = '',//那方面（财富啥的）
    config_birthday = '', //生日
    config_birthPlace = '', //出生地a
    config_type = '', //type 0 命 1 运
    config_fortune = '',//选择运的内容
    config_calendarType = '1',//1 农历 2 阳历
    config_sessionId = uuid(),
    config_report={} ,
    config_openId ='',
    confit_pay = 1,
    askCount = 0,
    ask_dialog_step = 0;
    config_reloadData = '',
		url_setInterval='', //定时器
		url_setInterval_num = 0, //定时器记时
		config_isReportSuccess = '', //是否是完整报告
		channel = '',//来源
		pay_probability=parseInt(96 + Math.random() * (99 - 96))+'%！',  //支付概率初始化
    mImg = ['./img/m0.png','./img/m1.png','./img/m2.png','./img/m3.png','./img/m11.png','./img/m10.png','./img/m4.png','./img/m5.png','./img/m9.png','./img/m8.png','./img/m7.png','./img/m6.png'],
    wxSdk_description=['火爆朋友圈的AI算命，准确率95%，只要8.8块就能解锁你的命运！','和机器人聊3分钟就能了解一生运势，准得不行，限时优惠8块8！','朋友用人工智能算了一次，竟然算准了对象出轨……','居然能算出吴磊喜欢什么样的女孩，你想不想测测看未来对象在哪？','裁员潮滚滚，下个月能找到工作吗？测事业运，限时优惠只要8.8块！'];//结论


/**
  公共元素  标题，选项
  0.输入姓名
  1.单项选择（包含解释）
  2.选择生日
  3.选择城市
  4.结论 （更换Ui）

  按钮样式
  公共样式：suan-content-foot-send(黄框白底)
  已选过/姓名未输入 ：suan-content-foot-sendHui  (灰框白字)
  姓名已输入/城市/生日：suan-content-foot-sendOrange (黄底白字)
  查看命盘：suan-content-foot-chart (黄字无边框)

  按钮点击（唯一标记）：
  单选发送：sendRadioSever
  生日发送：lcalendar_finish
  城市发送：larea_finish
  姓名发送：sendName
  查看命盘：suan-content-foot-chart
  结论：suan-content-foot-ending
*/

const htmlList = {
  data0:'<p class="suan-content-mid-title" style="white-space:pre-line">{{text}}</p><input class="suan-content-mid-input" type="text" name="" value="">',
  data1:'<p class="suan-content-mid-title" style="white-space:pre-line">{{text}}</p><p class="suan-content-mid-content" style="white-space:pre-line">{{content}}</p>',
  data2:'<p class="suan-content-mid-title" style="white-space:pre-line">{{text}}</p><div class="suan-content-mid-data"><p><span type="1" class="suan-content-mid-data-p-span">阳历</span><span type="0">阴历</span></p><input id="data_demo" type="text" readonly="" name="input_date" placeholder="日期和时间选择特效" data-lcalendar="1936-01-01,2019-12-31" style="display:none;" /></div>',
  data3:'<p class="suan-content-mid-title" style="white-space:pre-line">{{text}}</p><div class="suan-content-mid-area"><div class="content-block"><input id="area_demo" type="text" readonly placeholder="城市选择特效" /><input id="area_value" type="hidden" /></div></div>',
  data4:'<p class="suan-content-mid-title" style="white-space:pre-line">{{text}}</p>',

  data0_btn:'<p class="suan-content-foot-send sendName" style="white-space:pre-line">{{text}}</p><br>',
  data1_btn:'<p class="suan-content-foot-send suan-content-foot-radio sendRadioSever" style="white-space:pre-line">{{text}}</p><br>',
  data2_btn:'<p class="suan-content-foot-send lcalendar_finish" style="white-space:pre-line">{{text}}</p>',
  data3_btn:'<p class="suan-content-foot-send larea_finish" style="white-space:pre-line">{{text}}</p>',
  data4_btn:'<p class="suan-content-foot-send suan-content-foot-ending" style="white-space:pre-line">{{text}}</p>',

  btn_myself:'<p class="suan-content-foot-send suan-content-foot-radio suanMyself" style="white-space:pre-line">{{text}}</p><br>',
  btn_other:'<p class="suan-content-foot-send suan-content-foot-radio suanOther" style="white-space:pre-line">{{text}}</p><br>',
  btn_chart:'<p class="suan-content-foot-send suan-content-foot-chart" style="white-space:pre-line">{{text}}</p><br>',
  btn_askBtn:'<p class="suan-content-foot-send suan-begin-machine" style="white-space:pre-line" value="{{value}}">{{text}}</p><br>',

  zwResultDiv0:'<span class="spanTop">{{data}}</span>'
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

// 缓存
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
