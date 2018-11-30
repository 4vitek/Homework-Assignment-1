/*Primary file for the Api*/
//Author : Victor Rodniansky
///////////////////////////

//dependencies
const http = require("http");
const url = require("url");
const config = require("./config");
const stringDecoder = require("string_decoder").StringDecoder;

let ProcceedRequest = (req,res) => {
    //get url & parse url
    let pasedUrl = url.parse(req.url,true);
    
    //get path
    let pathName = pasedUrl.pathname;
    let trimmedPath = pathName.replace(/^\/+|\/+$/g,'');
   
    //get method : GET POST PUT DELETE
    let methodName = req.method.toLowerCase();

    //get the query string
    let queryStringObject = pasedUrl.query;
    let queryString;

    //headers
    let headers = req.headers;

    //get the paiload
    let decoder = new stringDecoder('utf-8');
    let buf = '';

    //listen to data emit
    req.on('data',(data)=>{
        buf += decoder.write(data);
    });
    //we are done
    req.on('end',()=>{
        buf += decoder.end();

        //choose the handler
        let chooseHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        //data object ot handler
        let data = {
            'trimmedPath'      : trimmedPath,
            'queryStringObject': queryStringObject,
            'method'           : methodName,
            'headers'          : headers,
            'payload'          : buf
        }

        //rout the request using router deffinition
        chooseHandler(data,(statusCode,payload) => {
            //use handlers statusCode or default 200
            statusCode = typeof(statusCode) === 'number' ? statusCode : 200;
            //payload
            payload = typeof(payload) === 'object' ? payload : {};

            //convert payload to string
            let payLoadString = JSON.stringify(payload);

            res.setHeader('Content-Type','application/json');
            res.writeHead(statusCode);
            res.end(payLoadString);

            //log
            console.log(`method = ${methodName} uri = ${trimmedPath} with this queryString ${JSON.stringify(queryStringObject)},
            payload : ${payLoadString} `);

        });
    });
}

//start server
let httpServer = http.createServer((req,res) => {
    ProcceedRequest(req,res);
});

httpServer.listen(config.port,() => {
    console.log(`the hhtp server is listening on port ${config.port} in ${config.envName} mode`);
});

//handlera
let handlers = {};

handlers.hello = (data,callback) => {
//calback an http status code & payload obj
    switch (data.method.toLowerCase()) {
        case 'post': //homework task for post
            callback(406,{'message':'Welcome man , how are you!?'});
            break;
        case 'get':
            //TODO
            callback(501,{"error":"Not Implemented"});
            break;
        case 'put':
            //TODO
            callback(501,{"error":"Not Implemented"});
            break;
        case 'delete':
            //TODO
            callback(501,{"error":"Not Implemented"});
            break;
        default: 
            callback(501,{"error":"Not Implemented"});
    }
}

//notfound handler
handlers.notFound = (data,callback) => {
    callback(404,{"error":"Not Found"});
}

//request router
let router = {
    'hello'  : handlers.hello
}



