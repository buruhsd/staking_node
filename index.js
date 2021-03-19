var express = require('express');
var app = express();
var http = require('http').Server(app);
var port = process.env.PORT || 3000;
var path = require('path');


app.use(express.static(path.join(__dirname, '../public/')));

app.get('/', function(req, res){
    res.sendFile('/index.html');
});

http.listen(port, function(){
    console.log('listening on : ' + port);
})