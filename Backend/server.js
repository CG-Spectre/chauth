const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });
const lib = require("./lib");
const LCERROR = '\x1b[31m%s\x1b[0m'; //red
const LCWARN = '\x1b[33m%s\x1b[0m'; //yellow
const LCINFO = '\x1b[36m%s\x1b[0m'; //cyan
const LCSUCCESS = '\x1b[32m%s\x1b[0m'; //green

let connections = [];

function conAllowed(req){
    return true;
}

wss.on("connection", (ws, req)=>{
    clean();
    if(!conAllowed(req)){
        ws.close();
        console.info(LCWARN, ("Connection Rejected!") +  "\n" + new Date() + "\n" + req.socket.remoteAddress);
        return;
    }
    const id = connections.length;
    ws.id = id;
    ws.index = id;
    connections.push({id: id, ws: ws});
    console.info(LCSUCCESS, ("Connection Accepted!") + "\n" + new Date() + "\n" + req.socket.remoteAddress + "\nID:" + id);

    ws.on("close", ()=>{
        connections[ws.index].ws = null;
    })
});

wss.on("listening", ()=>{
    console.log("Listening.")
})

function clean(){
    let currentOffset = 0;
    for(i in connections){
        const con = connections[i];
        if(!con.ws){
            currentOffset += 1;
            delete connections[i];
            connections.pop(i);
        }else{
            con.id -= currentOffset;
            con.ws.id -= currentOffset;
            con.ws.index -= currentOffset;
        }
        
    }
}