// 获取用户生日年份
function getBirthYear(date) {
    let year = date.split(' ')[0]
    if (year.indexOf('闰') > -1) {
        return year.replace('闰','');
    } else {
        return year;
    }
}

// 获取用户生日时辰
function getBirthHour(date) {
    var arr = date.split(' ');
    var test = arr.slice(1);
    return test.join('')
}

// 获取用户生日是否是闰月
function getIsRun(date) {
    if( date.indexOf('闰') > -1 )  { return 1 }
    else {return 0}
}

// 获取用户生日是否是闰月
function setLocalStorage (arr) {
    try {
        if (window.localStorage) {
            for (let i in arr) {
                let value = arr[i]
                if (typeof value === 'object') {
                    value = JSON.stringify(value)
                }
                window.localStorage.setItem(i, value)
            }
        }
    } catch (e) {}
}

// 把json对象格式化成url参数
function urlEncode (data) {
    try {
        let tempArr = []
        for (let i in data) {
            let key = encodeURIComponent(i)
            let value = encodeURIComponent(data[i])
            tempArr.push(key + '=' + value)
        }
        let urlParamsStr = tempArr.join('&')
        return urlParamsStr
    } catch (err) {
        return ''
    }
}

// 日历
function getCalendar(icalendar_type) {
    $(function() {
        var calendardatetime = new lCalendar();
        calendardatetime.init({
            'trigger': '#data_demo',
            'type': 'datetime',
            'icalendar_type': icalendar_type
        });
    })
}

// 城市
function getArea() {
    var area2 = new LArea();
    area2.init({
        'trigger': '#area_demo',
        'valueTo': '#area_value',
        'keys': {
            id: 'value',
            name: 'text'
        },
        'type': 2,
        'data': [provs_data, citys_data, dists_data]
    });
}


function setLocalStorages (arr) {
    try {
        if (window.localStorage) {
            for (let i in arr) {
                for (let j in arr[i]) {
                    let value = arr[i][j]
                    if (typeof value === 'object') {
                        value = JSON.stringify(value)
                    }
                    window.localStorage.setItem(j, value)
                }
            }
        }
    } catch (e) {}
}


function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

function is_neizhi() { 
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return "weixin";
    } else if (ua.match(/ qq/i) == ' qq') {
        return "QQ";
    }
    return false;
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

function urlDelP(url,name){
    var urlArr = url.split('?');
    if(urlArr.length>1 && urlArr[1].indexOf(name)>-1){
        var query = urlArr[1];
        var obj = {}
        var arr = query.split("&");
        for (var i = 0; i < arr.length; i++) {
            arr[i] = arr[i].split("=");
            obj[arr[i][0]] = arr[i][1];
        };
        delete obj[name];
        var urlte = urlArr[0] +'?'+ JSON.stringify(obj).replace(/[\"\{\}]/g,"").replace(/\:/g,"=").replace(/\,/g,"&");
        return urlte;
    }else{
        return url;
    };
}
