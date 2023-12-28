const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = './chat.proto';

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const chatService = grpc.loadPackageDefinition(packageDefinition).chatserver.Services;

const client = new chatService('localhost:8081', grpc.credentials.createInsecure());

const user = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

user.question('Enter your name: ', (name) => {
  const clientName = name.trim();

  const stream = client.ChatService();

  // Receive message function
  stream.on('data', (message) => {
    console.log(`${message.name}: ${message.body}`);
  });

  // Handle console input for sending messages
  user.on('line', (input) => {
    stream.write({ name: clientName, body: input });
  });

  // Client configuration
  stream.write({ name: clientName, body: 'Joined the chat' }); // Send a join message after setting the client name

  // Close the stream and end the program on SIGINT (Ctrl+C)
  process.on('SIGINT', () => {
    stream.end();
    process.exit();
  });
});
