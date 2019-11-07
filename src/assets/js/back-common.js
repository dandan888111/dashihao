
$('[action-type=back-history]').click(function(e) {
    window.history.back(-1); 
})



//$('[action-type=copy-btn]').click(function(e) {
// let key = new ClipboardJS($('[action-type=copy-url]')[0]);
// key.on('success', function(e) {
//     alert('复制成功:'+e.text)
// });


$("[action-type=copy-btn]").each(function(key,value){
    var dom = new ClipboardJS(value);
    dom.on('success', function(e) {
        alert('复制成功: '+e.text)
    });
});
//})

// var clipboard = new ClipboardJS('[action-type=copy-btn]');
// clipboard.on('success', function(e) {
//     console.info('Action:', e.action);
//     console.info('Text:', e.text);
//     console.info('Trigger:', e.trigger);
//     alert('复制成功:'+ e.text)
//     e.clearSelection();
// });

// clipboard.on('error', function(e) {
//     console.error('Action:', e.action);
//     console.error('Trigger:', e.trigger);
// });


// var clipboard = new Clipboard('[action-type=copy-btn]');

// clipboard.on('success', function(e) {
//     console.info('Action:', e.action);
//     console.info('Text:', e.text);
//     console.info('Trigger:', e.trigger);
//     alert('复制成功:'+ e.text)
//     e.clearSelection();
// });

// clipboard.on('error', function(e) {
//     console.error('Action:', e.action);
//     console.error('Trigger:', e.trigger);
// });

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

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}


function GetQueryString2( name, url ) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    return results == null ? null : results[1];
}
