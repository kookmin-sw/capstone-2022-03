const express = require('express')
const app = express()
const port = 7000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {User} = require("./model/User.js");
const config = require("./config/key");
//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

//application/json
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI)
   .then(() => console.log('MongoDB Connected...'))
   .catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello kkok!')
})

//회원가입 파트
app.post('/register', (req, res) => {
    //회원가입 할때 필요한 정보들을 client에서 가져오면 그것들을 database에 넣어준다.
    const user = new User(req.body)

    //비밀번호의 경우 암호화 필요, 이때 mongoose의 기능이용, 따라서 User.js에서 암호화 작업 진행후
    user.save((err, userInfo) => {
        if(err) return res.json({ success: false,  err})
        return res.status(200).json({
            success: true
            // make user account 
            // blockchain 연동
            
        })
    })
})

//로그인 파트
app.post('/login', (req, res) => {
  // 요청된 이메일을 데이터베이스에서 있는지 찾는다.
  User.findOne({email : req.body.email}, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다!"
      })
    }
  // 요청된 이메일이 데이터베이스에 있다면, 비밀번호가 맞는 비밀번호인지 확인.
  user.comparePassword(req.body.password, (err, isMatch) => {
    if(!isMatch)
      return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})
    // 비밀번호 까지 맞다면 토큰을 생성하기.
    user.generateToken((err, user) => {
      if(err) return res.status(400).send(err);
      
      //토큰을 저장한다. 어디에? 쿠키에 저장
      res.cookie("x_auth",user.token)
        .status(200)
        .json({ loginSuccess: true, userId: user,_id})
    })
  })
  })
})
//.then(() => {console.log("회원가입 완료!")});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
