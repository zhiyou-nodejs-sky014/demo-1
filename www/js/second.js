$('form').submit(function(event){
    event.preventDefault();
    const value=$(this).serialize()
    $.get('/login?'+value+'',function(res){
        if(res.success==0){
            alert(res.message);
            $('input[type!=submit]').val()
        }else{
            location.href='home.html'
        }
    })
})
$('.navbar-bodyer').click(function(){
    location.href='tt.html'
})
$('.navbar-footer').click(function(){
    location.href='home.html'
})