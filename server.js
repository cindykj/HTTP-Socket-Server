const http = require('http');
const pages = require('.pages');
const PORT = 8080;
const HOST = '0.0.0.0';

let connectionCount = [];

const server = http.createServer(function (socket) {
  console.log('Client connected!');
  socket.setEncoding('utf8');
  process.stdin.pipe(socket); //pipe from server to socket
  socket.username = undefined; // make property on socket object

  if (socket.username === undefined) {
    socket.write('Welcome, Client!\r\n Please enter your username: ');
  };

  socket.on('data', (data) => {
    // if new user name, please set
    if (!socket.username) {
      let username = socket.username;
      username = data.trim();
      socket.write(`Welcome back, ${username}! \r\n`);
      socket.write(`${username} just logged in.`)
    } else {
      connectionCount
        .filter(element => {
          return element !== socket; // filters whether incoming is true connection
        })
        .forEach(element => {
          element.write(`${username}, ${data}`) // this writes msg to other connected clients
        })
    };
  }); //closing for socket.on(data)

  connectionCount.push(socket); //counts number of listeners
  
  //function to end connection
  socket.on('end', () => {
    //cleanup to remove the disconnected socket
    connectionCount.splice(connectionCount.indexOf(socket), 1)
    console.log('Client disconnected');
  }); //closing for socket.on(end)
}); // closing server connect

server.on('error', (err) => {
  throw err;
});

// Listens for connections on port 6969
server.listen(PORT, HOST, () => {
  console.log('Server listening on');
}); // closing for server.listen
