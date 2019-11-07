

$("[action-type=more-family]").click(function() {
    var type = $(this).attr('type');
    console.log(type)
})

// 绑定师傅确认按钮 出弹窗
$("[action-type=bind-btn]").click(function() {
    var name = $('[node-type=teacher]').val();
    if(name === '') {
        alert('请填写师傅邀请码')
        return
    }
    $("[node-type=dialog-teacher-name]").html(name);
    $("[node-type=dialog-mask]").show();
})

//弹窗关闭按钮
$("[action-type=close-dialog]").click(function() {
    $("[node-type=dialog-mask]").hide();
})