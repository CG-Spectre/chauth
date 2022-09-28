const mysql = require("mysql");
const crypto = require("crypto");
const algorithm = 'aes-192-cbc';
const con = mysql.createConnection({
    host: "192.168.1.230",
    user: "CoHanceAdmin",
    password: "CoHance9652M!so"
});
con.connect((err)=>{
    if (err) throw err;
    console.log("Connected to mysql!")
});
console.log(encrypt(genToken()));
function genToken(){
    const chars = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*";
    const length = 40;
    let token = "";
    for(let i = 0; i < length; i++){
        token += chars[generateRandom(0, chars.length - 1)];
    }
    return token;
}

function encrypt(password){
    /*let hash = "";
    crypto.scrypt(password, 'salt', 24, (err, key) => {
        if (err) throw err;
        crypto.randomFill(new Uint8Array(16), (err, iv) => {
          if (err) throw err;
          const cipher = crypto.createCipheriv(algorithm, key, iv);
          let encrypted = '';
          cipher.setEncoding('hex');
          cipher.on('data', (chunk) => encrypted += chunk);
          cipher.on('end', () => {
            hash += encrypted;
            callback(hash);
          });
          cipher.write('some clear text data');
          cipher.end();
          
        });
    });*/
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = salt + ":" + crypto.scryptSync(password, salt, 64).toString('hex');
    return hashedPassword;
}

function decrypt(hash, password){
    /*const key = crypto.scryptSync(password, 'salt', 24);
    const iv = Buffer.alloc(16, 0);
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = '';
    decipher.on('readable', () => {
        while (null !== (chunk = decipher.read())) {
          decrypted += chunk.toString('utf8');
        }
      });
      decipher.on('end', () => {
        console.log(decrypted);
      });
      const encrypted = hash;
    decipher.write(encrypted, 'hex');
    decipher.end();
    console.log(decipher)*/
    const [salt, key] = hash.split(':');
    const hashedBuffer = crypto.scryptSync(password, salt, 64);
    const keyBuffer = Buffer.from(key, 'hex');
    const match = crypto.timingSafeEqual(hashedBuffer, keyBuffer);
    return match;
}

function generateRandom(low, up) {
    const u = Math.max(low, up);
    const l = Math.min(low, up);
    const diff = u - l;
    const r = Math.floor(Math.random() * (diff + 1));
    
    return l + r; 
}

function getFromTable(table, target, targetFilter, callback){
    if(typeof targetFilter == "string"){
        targetFilter = "'"+targetFilter+"'";
    }
    const sql = mysql.format("SELECT * FROM CHAuth."+table+" WHERE "+target+"=?", [targetFilter]);
    con.query(sql, (err, rows, fields)=>{
        if(err) throw err;
        callback(rows);
    })
}

exports.generateToken = genToken;
exports.generateRandom = generateRandom;