function genToken(){
    const chars = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*";
    const length = 40;
    let token = "";
    for(let i = 0; i < length; i++){
        token += chars[generateRandom(0, chars.length - 1)];
    }
    return token;
}

function generateRandom(low, up) {
    const u = Math.max(low, up);
    const l = Math.min(low, up);
    const diff = u - l;
    const r = Math.floor(Math.random() * (diff + 1));
    
    return l + r; 
}

console.log(genToken());