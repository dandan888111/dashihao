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