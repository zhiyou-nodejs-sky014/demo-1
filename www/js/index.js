$('form').submit(function(event){
    event.preventDefault();
    var psw1=$('#password').val();
    var psw2=$('#confirm').val();
    if(psw1!=psw2){
        alert('两次密码输入不一致，请重新输入')
        $('#password,#confirm').val('');
        return
    }
    var value=$(this).serialize();
    $.post('/registe',value,function(res){
        if(res.success==0){
            alert(res.message);
        }else{
            location.href='second.html'
        }
    })
})
$('.navbar-bodyer').click(function(){
    location.href='second.html'
})
$('.navbar-footer').click(function(){
    location.href='home.html'
})

$('#username').on('input',function(){
    const username=$(this).val()
    $.post('/exists',{username},function(res){
        if(res.code==0){
            $('#username+span').html('该用户名已存在').addClass('error').show();
            return
        }
        const regexp=/^[\w\u4e00-\u9fa5!@#￥%&]{2,15}$/;
        if(res.code==1&&regexp.test(username)){
            $('#username+span').html('√').removeClass('error').show();
            return;
        }
        $('#username+span').hide();
    })
})

$('#confirm,#password').on('input',function(){
    const confirm=$('#confirm').val();
    const password=$('#password').val();
    if(password&&confirm&&confirm!=password){
        $('#confirm+span').show();
    }else{
        $('#confirm+span').hide();
    }
})