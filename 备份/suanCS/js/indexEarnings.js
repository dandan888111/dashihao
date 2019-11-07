$(function(){
  pushHistory()
  $('.bindNumber,.earnings').hide();

  // 输入框失去焦点事件
  $('body').on('blur', 'input', function() {
    kickBack()
  })

  onLoadTab()

  // 绑定手机号
  $('.sendNumber').on('click', function() {
      if ($('.mobileNumber>input').val() && $('.mobileCode>input').val()) {
          sendNumber($('.mobileNumber>input').val(), $('.mobileCode>input').val(), function(res) {
              if (res.ret == 0) {
                getIncomeList(res.data.code,function(){
                  $('.earnings').show();
                  $('.bindNumber').hide()
                })
              } else if (res.ret == 1) {
                  $('.bindNumber').show().siblings().hide();
              }
          })
      } else {
          alert('请填写正确的手机号或验证码')
      }
  })

})

function onLoadTab(){
  telLogin(function(res) {
      if (res.ret == 0) {
          // 此处传回user对象,发送userid到服务端
          getIncomeList(res.data.code,function(){
            $('.earnings').show();
            $('.bindNumber').hide()
          })
      } else if (res.ret == 1) {
          $('.bindNumber').show();
      }
  })
}

// 获取收益列表
function getIncomeList(code,fn){
  $.ajax({
    type: "GET",
    url: requsetUrl + "/v1/trade/getIncomeList",
    data: {
      code:code
    },
    success: function(msg) {
       console.log(msg)
       $('.earnings-c').empty();
       fn(msg)
       $('.earnings-top>p>span').html(msg.data.totalAmount);
       if(msg.data.list.length <= 0){
         $('.earnings-c').append('<p>暂无收益</p>')
       }else{
         $('.earnings-c').append('<p>收益明细</p>')
       }

       for(let i = 0;i < msg.data.list.length;i ++){
         // $('.earnings-c').append('<div class="earnings-list"><div class="earnings-list-l"> <img src="'+msg.data.list[i].payerThum+'" alt=""><div class="earnings-list-l-div"><p>' + msg.data.list[i].payerName +' <span style="background:'+ ((msg.data.list[i].relative == "GSON")?"#FF4D4F;":(msg.data.list[i].relative == "SON"?"rgba(254, 113, 2, 1)":"#fff")) +'">'+((msg.data.list[i].relative == "GSON")?"间接":(msg.data.list[i].relative == "SON"?"直接":""))+'</span> </p> <p>'+msg.data.list[i].tradeTime+'</p> </div> </div><div class="earnings-list-r">'+msg.data.list[i].amount+'元</div> </div>')
         $('.earnings-c').append('<div class="earnings-list"><div class="earnings-list-l"><div class="earnings-list-l-div"><p>' + msg.data.list[i].payerName +' <span style="background:'+ ((msg.data.list[i].relative == "GSON")?"#FF4D4F;":(msg.data.list[i].relative == "SON"?"rgba(254, 113, 2, 1)":"#fff")) +'">'+((msg.data.list[i].relative == "GSON")?"间接":(msg.data.list[i].relative == "SON"?"直接":""))+'</span> </p> <p>'+msg.data.list[i].tradeTime+'</p> </div> </div><div class="earnings-list-r">'+msg.data.list[i].amount+'元</div> </div>')
       }
    },
    error: function(msg) {
    }
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
