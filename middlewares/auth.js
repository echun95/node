const jwt = require('../modules/jwt');

const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;


module.exports = {
    checkToken: async (req, res, next) => {
        /*let data = {
            msg = 'ok',
            token = ''
        }*/
        var token = req.get('Authorization'); //Authorization
        // 토큰 없음
        if (!token)
            return res.send('토큰이 존재하지 않습니다.');
        // decode
        const tokenResult = await jwt.verify(token);

        // 유효기간 만료
        if (tokenResult === TOKEN_EXPIRED){
            /*const jwtToken = await jwt.sign(user[0]);
            data.token = jwtToken;
            //db insert 해야함 jwtToken.token
            db.tokenUpdate(jwtToken.token,user[0]);
            result = {
                data : user,
                token : jwtToken
            }
            return data;*/
            return res.send('유효기간이 지남')
        }
        // 유효하지 않는 토큰
        if (tokenResult === TOKEN_INVALID)
            return res.send('유효하지 않는 토큰입니다.');
        if (tokenResult.iss === undefined)
            return res.send('유효하지 않는 토큰입니다.');
        //return req = tokenResult;
        return 'ok';
    }
}