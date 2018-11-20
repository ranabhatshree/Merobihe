const http = require('http');
const port = process.env.PORT || 8000;
const app = require('./app');

const server = http.createServer(app);

//listen to the port
server.listen(port,function(){
  console.log("Merobihe running at http://localhost:"+port);
});
