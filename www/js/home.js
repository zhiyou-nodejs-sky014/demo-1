$.get('/users',function(res){
    $('#container').html(res);
    console.log(res)
})
$('.navbar-bodyer').click(function(){
    location.href='second.html'
})