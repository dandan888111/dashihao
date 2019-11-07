var activeIndex = 2; //swiper下标初始化
$(function() {
    pushHistory()
    $('.bindNumber,.swiper-container').hide();
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
                    getQr(res.data.id, function(urldata) {
                        swiper(urldata.data)
                        $('.swiper-container').show();
                        $('.bindNumber').hide();
                    })
                } else if (res.ret == 1) {
                    $('.bindNumber').show().siblings.hide();
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
          getQr(res.data.id || 2, function(urldata) {
              swiper(urldata.data)
              $('.swiper-container').show();
              $('.bindNumber').hide();
          })
      } else if (res.ret == 1) {
          $('.bindNumber').show();
      }
  })
}
function swiper(imgUrl) {
    $('.swiper-container').show();
    var mySwiper = new Swiper('.swiper-container', {
        effect: 'coverflow',
        slidesPerView: 1.2, //一屏显示的页数
        centeredSlides: true,
        initialSlide: 1,
        observer: true,//修改swiper自己或子元素时，自动初始化swiper
        observeParents: true,//修改swiper的父元素时，自动初始化swiper
        coverflowEffect: {
            rotate: 0,
            stretch: 30,
            depth: 10,
            modifier: 6,
            slideShadows: false
        }, // 如果需要前进后退按钮
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            bulletActiveClass: 'bulletActiveClass',
            clickable:true
        },
        on: {
            transitionEnd: function() {
                activeIndex = this.activeIndex;
                console.log(activeIndex)
            },
        }
    })
    for(let i = 0; i < 3; i++){
      $('.copyText').eq(i).attr('data-clipboard-text', $('.swiperDiv'+i+'>p').html());
      $('.swiperDiv').eq(i).children('img').attr('src',imgUrl[i])
      let key = String('clipboard' + i)
      key= new ClipboardJS($('.copyText')[i]);
      key.on('success', function(e) {
          alert('复制成功:'+e.text)
      });
    }
}

function getQr(userId, fn) {
    $.ajax({
        type: "GET",
        url: requsetUrl + "/v1/getPicList",
        data: {
            userId: userId
        },
        success: function(msg) {
            fn(msg)
        },
        error: function(msg) {}
    });
}

function draw(img, _canvas, a, b, fn) {
    let cxt, canvas = _canvas;
    if (!canvas.getContext) return;
    ctx = canvas.getContext("2d");
    ctx.fillRect(0, 0, 176, 283);
    let imga = new Image();
    imga.src = a;
    imga.crossOrigin = "Anonymous";
    imga.setAttribute('crossOrigin', 'anonymous');
    imga.onload = function() {
        ctx.drawImage(imga, 0, 0, 176, 283);
        let imgb = new Image();
        imgb.src = b;
        imgb.crossOrigin = "Anonymous";
        imgb.setAttribute('crossOrigin', 'anonymous');
        imgb.onload = function() {
            ctx.drawImage(imgb, 127, 234, 34, 34);
            ctx.save();
            let url = _canvas.toDataURL('image/png');
            img.attr('src', url);
            _canvas.remove()
            fn()
        }
    }
};

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
