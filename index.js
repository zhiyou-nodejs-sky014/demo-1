const express = require('express');
// 请求数据的解析
const bodyParser = require('body-parser');
// 负责cookie的相关操作
const cookieParser=require('cookie-parser');
const fs = require('fs');
const expressArt=require('express-art-template');
/*****************************************************/ 
const app = express();
/*****************************************************/ 
app.engine('art',expressArt);
app.use(express.static('www'));
app.use(bodyParser.urlencoded({ extended: true }));
// 使用cookieParser的中间件进行cookie解析。
// 参数：secret，秘密，设置秘钥
app.use(cookieParser('sky014'));
/*****************************************************/ 
app.get('/',(req,res)=>{
    // req.signedCookies:解密之后的cooklie对象
    if(req.signedCookies.isLogin==="true"){
        // 说明之前已经登录成功并且没失效
        // redirect:重定向
        res.redirect('/home.html');
    }else{
        // 没登录过
        res.redirect('/second.html');
    }
})
app.post('/registe', (req, res) => {
    registeHandle(req, res)
})
app.get('/login',(req,res)=>{
    loginHandle(req,res)
})
app.get('/users',(req,res)=>{
    usersHandle(req,res)
})
app.post('/exists',(req,res)=>{
    existsHandle(req,res)
})
app.listen(3000, () => { })

function registeHandle(req, res) {
    username = req.body.username;
    password = req.body.password;
    fs.readFile('user.json', (err, data) => {
        const userArray = JSON.parse(data);
        console.log(userArray)
        for (let i = 0; i < userArray.length; i++) {
            if (username == userArray[i].username) {
                res.end(JSON.stringify({ success: 0, message: '用户名已存在，注册失败' }))
                return
            }
        }
        userArray.push({ username, password })
        fs.writeFile('user.json', JSON.stringify(userArray), (err) => {
            if (err) {
                rse.end(JSON.stringify({ success: 0, message: '系统错误，请稍后重试' }))
                return
            } else {
                res.end(JSON.stringify({ success: 1, message: '注册成功' }))
            }
        })
    })
}

function loginHandle(req,res){
    username=req.query.username
    password=req.query.password;
    fs.readFile('user.json',(err,data)=>{
        if(err){
            res.end(JSON.stringify({success:0,message:'系统错误，请重新尝试'}))
            return
        }
        const userArray=JSON.parse(data);
        for(let i=0;i<userArray.length;i++){
            if(username==userArray[i].username){
                if(password==userArray[i].password){
                    // 设置cookie，记录用户状态 需要一个第三方模块
                    // expires：有效日期   signed：是否加密
                    res.cookie('isLogin',true,{expires:new Date(Date.now()+1000*60),signed:true})
                    res.end(JSON.stringify({success:1,message:'登录成功'}))
                    return
                }
                res.end(JSON.stringify({success:0,message:'密码错误，请重新输入'}))
                return
            }
            res.end(JSON.stringify({success:0,message:'用户名错误，请重新输入'}))
        }
    })
}

function usersHandle(req,res){
    fs.readFile('user.json',(err,data)=>{
        if(err){
            res.end(JSON.stringify({success:0,message:'系统错误，请重新尝试'}))
            return
        }
        const arr=JSON.parse(data);
        console.log(arr)
        var obj={aa:arr}
        res.render('user.art',obj)
    })
}

function existsHandle(req,res){
    const user=req.body;
    fs.readFile('user.json',(error,data)=>{
        if(error){
            res.json({code:0,message:error.message})
            return
        }
        const users=JSON.parse(data);
        for(let i=0;i<users.length;i++){
            const obj=users[i];
            if(obj.username==user.username){
                res.json({code:0,message:'该用户已存在'})
                return;
            }
        }
        res.json({code:1,message:'该用户名不存在'})
    })
}


// 不需要添加querystring解析模块，在express中 也不需要设置响应头

// a-----信----->b
// 为了数据安全，需要加密
// 对称加密 与非对称加密
// 对称加密只有一把钥匙，加密解密都用该秘钥，造成秘钥在网络上传递，很容易被黑客窃取。
// 非对称加密有公钥和私钥。公钥公开，私钥只有自己有
// 当a发送数据给b时，采用b的公钥加密，把密文发给b，b再用私钥解密成明文，阅读。

// 签名：

// a----->b  a先签名、给内容加密；