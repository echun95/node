var mariadb = require('mariadb');

var db = mariadb.createPool({
    host : 'localhost',
    user : 'root',
    password : '0000',
    database : 'nodedb'
});

async function GetUserList(){
    let conn, rows;
    try {
        conn = await db.getConnection();
        conn.query('use nodedb');
        rows = await conn.query('select * from user');
    } catch (error) {
        throw error
    } finally{
        if(conn) conn.end();
        return rows;
    }
}

async function InsertUser(id,password,name){
    console.log(id,password,name);
    let conn;
    try {
        conn = await db.getConnection();
        conn.query('use nodedb');
        await conn.query('insert into user(user_id, user_password, user_name) values(?,?,?)', [id,password,name]);
    } catch (error) {
        throw error
    } finally{
        if(conn) conn.end();
        return "회원가입 완료";
    }
}

async function LoginUser(id,password){
    let conn;
    let userInfo;
    try {
        conn = await db.getConnection();
        conn.query('use nodedb');
        userInfo = await conn.query('select * from user where user_id = ? and user_password = ?', [id, password]);
    } catch (error) {
        throw error
    } finally{
        if(conn) conn.end();
        return userInfo;
    }
}


async function TokenUpdate(jwtToken, user){
    let conn;
    let userInfo;
    try {
        conn = await db.getConnection();
        conn.query('use nodedb');
        userInfo = await conn.query('update user set user_token = ? where user_id = ?', [jwtToken, user.user_id]);
    } catch (error) {
        throw error
    } finally{
        if(conn) conn.end();
    }
}



module.exports = {
    getUserList : GetUserList,
    insertUser : InsertUser,
    loginUser : LoginUser,
    tokenUpdate : TokenUpdate
}