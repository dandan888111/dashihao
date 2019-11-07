// 公共参数
var requsetUrl = 'https://www.huiyidabai.cn/DaBaiFortuneTelling',
    requsetUrlm = 'https://www.huiyidabai.cn',
    config_userInfo = {},
    telTimerNum = 59,
    config_code ='';

//填邀请码
var indexInviteCode = '';

// var ios = navigator.userAgent.indexOf('iphone');//判断是否为ios
// function iosTrouchFn(el1,el2) {
//     //el需要滑动的元素
//     if(el1){
//       el1.addEventListener('touchmove',function(e){
//           e.isSCROLL = true;
//       })
//     }
//
//     if(el2){
//       el2.addEventListener('touchmove',function(e){
//           e.isSCROLL = true;
//       })
//     }
//     document.body.addEventListener('touchmove',function(e){
//         if(!e.isSCROLL){
//             e.preventDefault(); //阻止默认事件(上下滑动)
//         }
//     }, {passive: false}) //passive防止阻止默认事件不生效
// }


// 页面回滚
function kickBack() {
  setTimeout(() => {
    window.scrollTo(0, document.body.scrollTop + 1);
    document.body.scrollTop >= 1 && window.scrollTo(0, document.body.scrollTop - 1);
  }, 10)
}
