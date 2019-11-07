$(function() {
     $('.bindNumber,.withdrawal').hide();
     // 输入框失去焦点事件
     $('body').on('blur', 'input', function() {
       kickBack()
     })

     if(getRequest() && getRequest().inviteCode){
       getWithDrawList(getRequest().inviteCode,function(){
         $('.withdrawal').show().siblings().hide();
         $('.withdrawalList').hide()
       })
     }else{
       pushHistory()
       onLoadTab();
     }

     // 绑定手机号
     $('.sendNumber').on('click', function() {
         if ($('.mobileNumber>input').val() && $('.mobileCode>input').val()) {
             sendNumber($('.mobileNumber>input').val(), $('.mobileCode>input').val(), function(res) {
                 if (res.ret == 0) {
                   getWithDrawList(res.data.code,function(){
                     $('.withdrawal').show().siblings().hide();
                      $('.withdrawalList').hide()
                   })
                 } else if (res.ret == 1) {
                     $('.bindNumber').show().siblings().hide();
                 }
             })
         } else {
             alert('请填写正确的手机号或验证码')
         }
     })

     // tab切换
     $('.withdrawal-tab>p').on('click',function(){
       if($(this).html() == '提现'){
         $('.withdrawal-c').show();
         $('.withdrawalList').hide();
       }else{
         $('.withdrawal-c').hide();
         $('.withdrawalList').show();
       }
       $(this).css('background','#fff').siblings('p').css('background','#F7F8FA')
     })


     // 选中钱数
     $('.withdrawal-money-span').on('click',function(){
       $(this).addClass('clickMoney').siblings().removeClass('clickMoney');
      console.log($(this).html().split('元')[0] + '-->' + $('.withdrawal-top>p>span>span').html())
       if($('.withdrawal-c-mobiel>input').val() != ''){
         if($(this).html().split('元')[0]*100 < $('.withdrawal-top>p>span>span').html()*100){
           $('.withdrawalBtn').css('background','#FF4D4F');
           $('.withdrawalBtn').html('立即提现')
         }else{
           $('.withdrawalBtn').css('background','#FFB8B9');
           $('.withdrawalBtn').html('余额不足')
         }
       }else{
         if($(this).html().split('元')[0]*100 < $('.withdrawal-top>p>span>span').html()*100){
           $('.withdrawalBtn').css('background','#FFB8B9');
           $('.withdrawalBtn').html('立即提现')
         }else{
           $('.withdrawalBtn').css('background','#FFB8B9');
           $('.withdrawalBtn').html('余额不足')
         }
       }
     })
     // 监听姓名输入
    $("body").bind("input propertychange", '.withdrawal-c-mobiel>input', function(event) {
      // #FFB8B9 灰色  #FF4D4F红色
      if($('.withdrawal-c-mobiel>input').val()!= ''){
        if($('.clickMoney').html() && $('.clickMoney').html().split('元')[0]*100 < $('.withdrawal-top>p>span>span').html()*100){
          $('.withdrawalBtn').css('background','#FF4D4F');
          $('.withdrawalBtn').html('立即提现')
        }else if($('.clickMoney').html() && $('.clickMoney').html().split('元')[0]*100 > $('.withdrawal-top>p>span>span').html()*100){
          $('.withdrawalBtn').css('background','#FFB8B9');
          $('.withdrawalBtn').html('余额不足')
        }else{
          $('.withdrawalBtn').css('background','#FFB8B9');
          $('.withdrawalBtn').html('立即提现')
        }
      }else{
        if($('.clickMoney').html() && $('.clickMoney').html().split('元')[0]*100 < $('.withdrawal-top>p>span>span').html()*100){
          $('.withdrawalBtn').css('background','#FFB8B9');
          $('.withdrawalBtn').html('立即提现')
        }else if($('.clickMoney').html() && $('.clickMoney').html().split('元')[0]*100 > $('.withdrawal-top>p>span>span').html()*100){
          $('.withdrawalBtn').css('background','#FFB8B9');
          $('.withdrawalBtn').html('余额不足')
        }else{
          $('.withdrawalBtn').css('background','#FFB8B9');
          $('.withdrawalBtn').html('立即提现')
        }
      }
    });

     // 注意事项
     $('.showShade').on('click',function(){
       $('.withdrawalShade').show()
     })
     $('.withdrawalShade p').eq(2).on('click',function(){
       $('.withdrawalShade').hide()
     })

     // 提现按钮
     $('.withdrawalBtn').on('click',function(){
       if($('.withdrawalBtn').css("background-color") == '#FFB8B9' || $('.withdrawalBtn').css("background-color") =='rgb(255, 184, 185)')
       return

       withDrawApply(config_code,$('.clickMoney').html().split('元')[0],$('.withdrawal-c-mobiel>input').val(),function(msg){
         if(msg.ret == 0){
           alert('已成功提交提现请求，请耐心等待客服处理。');
           getWithDrawList(config_code,function(){
             $('.withdrawal').show().siblings().hide();
             $('.withdrawalList').hide()
           })
         }else if(msg.ret == 1){
           alert('提现失败')
         }
       })
     })
  })

  function onLoadTab(){
    telLogin(function(res) {
        if (res.ret == 0) {
            getWithDrawList(res.data.code || 'EAHEZR',function(){
              $('.withdrawal').show().siblings().hide();
              $('.withdrawalList').hide()
            })
        } else if (res.ret == 1) {
            $('.bindNumber').show();
        }
    })
  }

  function getWithDrawList(code,fn){
    config_code = code
    $.ajax({
      type: "GET",
      url: requsetUrl + "/v1/trade/getWithDrawList",
      data: {
        code:code
      },
      success: function(msg) {
         fn(msg);
         $('.withdrawalList-title>p>span').html(msg.data.hasWithdraw);
         $('.withdrawal-top>p>span>span').html(msg.data.balance);
         $('.withdrawal-list').empty()
         $('.withdrawal-c-mobiel>input').val('');
         $('.withdrawal-money>span').removeClass('clickMoney');
         $('.withdrawalList-title>p').eq(2).html('待入账 ' + msg.data.inWithdraw + '元')
         for(let i = 0;i < msg.data.list.length;i ++){
           $('.withdrawal-list').append('<div class="withdrawal-list-min"><p><span style="color:'+((msg.data.list[i].tradeState == 0)?'#FB8000':((msg.data.list[i].tradeState == 1)?'':'#FE4C12')) + '">'+ ((msg.data.list[i].tradeState == 0)?'提现中':((msg.data.list[i].tradeState == 1)?'提现已到账':'提现失败')) +'</span><br> <span>' + msg.data.list[i].tradeTime + '</span></p> <p>'+ msg.data.list[i].amount +'元</p> </div>')
         }
      },
      error: function(msg) {
      }
    });
  }

  function withDrawApply(code,amount,contactWay,fn){
    $.ajax({
      type: "GET",
      url: requsetUrl + "/v1/trade/withDrawApply",
      data: {
        code:code,
        contactWay:contactWay,
        amount:amount
      },
      success: function(msg) {
         console.log(msg)
         fn(msg)
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
