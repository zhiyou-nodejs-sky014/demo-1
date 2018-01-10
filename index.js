const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const expressArt=require('express-art-template');
const querystring = require('querystring')
const app = express();
app.engine('art',expressArt);
app.use(express.static('www'));
app.use(bodyParser.urlencoded({ extended: true }));
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
    res.setHeader('Content-Type', 'spplication/json');
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
    res.setHeader('Content-Type','application/json');
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
    // res.setHeader('Content-Type','application/json/html');
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