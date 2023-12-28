const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load the .proto file
const packageDefinition = protoLoader.loadSync('./chat.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

// Extract the service definition
const chatServiceDefinition = grpc.loadPackageDefinition(packageDefinition).chatserver.Services;

class ChatServer {
  // Implement your gRPC service methods here
}

const server = new grpc.Server();
server.addService(chatServiceDefinition.service, new ChatServer());

const PORT = process.env.PORT || 8081;

server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error(`Error binding gRPC server: ${err}`);
    return;
  }
  server.start();
  console.log(`gRPC server listening on port ${port}`);
});