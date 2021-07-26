//db
const db = require('../../../db.js')
const jwt = require('../../../modules/jwt')
const authUtils = require('../../../middlewares/auth')

signup = (req,res) => {
    //const encrypted = crypto.createHmac('shal', config.secret).update(req.body.password).digest('base64')

    const id = req.body.id;
    const password = req.body.password;
    const name = req.body.name;

    db.insertUser(id,password,name).then((rows)=>{
        console.log(rows);
        res.send('signup success');
    })
    .catch((errMsg) =>{
        console.log(errMsg);
    });
}

login = (req, res) => {
    console.log('login function start');
    const id = req.body.id;
    const password = req.body.password;
    let result;
    let check;
    db.loginUser(id,password).then(async (user)=>{
        console.log(user);

        //로그인 후 토큰 값 있는지 확인
        if(user[0].user_token == null){  //token is null
            const jwtToken = await jwt.sign(user[0]);

            //db insert 해야함 jwtToken.token
            db.tokenUpdate(jwtToken.token,user[0]);
            result = {
                data : user,
                token : jwtToken
            }
        }else{
            await jwt.verify(user[0].user_token).then((data)=>{
                console.log('promise : ' + data);
                check = data;  
            });
                
            if(check == -3){//-3 유효기간 경과 -2 유효하지않음
                //유효기간 경과 새로 만들어서 저장
                const jwtToken = await jwt.sign(user[0]);
                //db 업뎃 해야함 jwtToken.token
                db.tokenUpdate(jwtToken.token, user[0]);
                result = {
                    data : user,
                    token : jwtToken
                }
            }else if(check == -2){
                console.log('token 값이 유효하지않습니다.');
                result = 'token 값이 유효하지않습니다.';
                
            }else{
                console.log('token 정상')
                result = {
                    data : user,
                    token : user[0].user_token
                }
            }
        }
        res.json(JSON.stringify(result));
    })
    .catch((errMsg)=>{
        console.log(errMsg);
    });
}

auth = async (req, res) => {
    const result = await authUtils.checkToken(req);  //ok
    console.log(result);
}



module.exports = {
    login,
    signup,
    auth
}