
// 提现金额切换
$("[action-type=select-money]").click(function(e) {
    var money = $(this).attr('value');
    $(this).addClass('current').siblings().removeClass('current');
})

// 提现 提现记录tab切换
$("[action-type=select-advanceHeader]").click(function() {
    var index = $(this).index();
    $(this).addClass('current').siblings().removeClass('current');
    $('.content-box').eq(index).show().siblings('.content-box').hide()
})


// 提现按钮
$("[action-type=advance]").click(function() {
    $("[node-type=dialog-mask]").show();
})
//弹窗关闭按钮
$("[action-type=close-dialog]").click(function() {
    $("[node-type=dialog-mask]").hide();
})