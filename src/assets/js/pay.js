

// 检查订单是否支付成功
function checkOrderSuccess(orderId) {
    // dashi201904261208409699989
    // dashi201904262110374993507
    // dashi201904262325116793906
    return axios({
        method: "post",
        url: baseUrl + '/services/v1/dsorder/get/order',
        //url: 'https://www.nihaodashi.com/nihaodashi-dev/services/v1/dsorder/get/order',
        data: { orderId: orderId, status: 1 },
        headers:{
            "version": "v1",
            "platform": "ios",
            "Token": "7e2d0ec641474c1985758959825cc1f9de29b2f02be84d90b9a7dc1edf731eba",
            "Content-Type": "application/json"
        }
    }).then(function (response) {
        let status = response.data.result.status;
        if (status === 1) {
            config_PaySuccess = true
        } else {
            config_PaySuccess = false
        }
    })
    .catch(function (error) {
        console.log(error);
    });
}

// 微信内支付，调用微信SDK
function payForWechat(clientType, openid) {
    let from = GetQueryString('source') || '';
    let version = GetQueryString('version') || '';
    if (!config_openId) {
        // _hmt.push(['_trackPageview', '/no_openId']);
       alert('openId获取失败，请退出页面重新进入！');
       return;
    }
    let requetData = {
        amount: 990,
        openId: config_openId,
        from: from,
        version: version
    }
    axios({
        method: "post",
        url: baseUrl + '/services/v1/dsorder/wxorder?'+ urlEncode(requetData),
        headers:{
            "version": "v1",
            "platform": "ios",
            "Token": "7e2d0ec641474c1985758959825cc1f9de29b2f02be84d90b9a7dc1edf731eba",
            "Content-Type": "application/json"
        }
    }).then(function (response) {
        let data = response.data.result;
        if (data.orderId && data.orderId !== '') {
            setLocalStorages([{ 'orderId': data.orderId ?  data.orderId : '' }])
        }
        if (typeof WeixinJSBridge == "undefined"){
            if( document.addEventListener ){
                document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
            }else if (document.attachEvent){
                document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
            }
        }else{
            onBridgeReady();
        }

        function onBridgeReady(){
            WeixinJSBridge.invoke(
                 'getBrandWCPayRequest', {
                     "appId":"wxe24d8d2690f536f9",     //公众号名称，由商户传入     
                     "timeStamp":data.timeStamp,         //时间戳，自1970年以来的秒数     
                     "nonceStr":data.nonceStr, //随机串     
                     "package": 'prepay_id=' + data.prepay_id,     
                     "signType":data.signType, 
                     "paySign": data.paySign, 
                },
                function(res){
                     //alert(res.err_msg)
                     if(res.err_msg == "get_brand_wcpay_request:ok" ){
                         // 使用以上方式判断前端返回,微信团队郑重提示：
                         //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                        config_PaySuccess = 1;

                        $('.loading').show().siblings().hide()
                        setTimeout(function() {
                            showDialogAsk();
                            $('.loading').hide();
                        }, 1000)
                        $(document).scrollTop(0);

                     }else if(res.err_msg == "get_brand_wcpay_request:cancel"){  
                        alert("用户取消支付!");  
                     }else{  
                        alert("支付失败!");  
                     }  
                }
            ); 
        }
    })
    .catch(function (error) {
        console.log(error);
    });
}

// 微信H5支付
function payH5ForWechat() {
    let from = GetQueryString('source') || '';
    let version = GetQueryString('version') || '';
    let requetData = {
        returnurl: encodeURIComponent(window.location.href),
        from: from,
        version: version
    }

    axios({
        method: "post",
        url: baseUrl + '/services/v1/dsorder/h5order?' + urlEncode(requetData),
        // url: 'https://www.nihaodashi.com/nihaodashi-dev/services/v1/dsorder/h5order?' + urlEncode(requetData),
        data: requetData,
        headers:{
            "version": "v1",
            "platform": "ios",
            "Token": "7e2d0ec641474c1985758959825cc1f9de29b2f02be84d90b9a7dc1edf731eba",
            "Content-Type": "application/json"
        }
    }).then(function (response) {
        console.log(response)
        let data = response.data.result;
        if (data.orderId && data.orderId !== '') {
            setLocalStorages([{ 'orderId': data.orderId ?  data.orderId : '' }])
        }
        window.location.href = data.goPayUrl;
        console.log(response)

    })
}