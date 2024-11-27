const http = require('http');
const app = require('./app');
const { ConnectMongoDB } = require('./config/mongoService');
require('dotenv').config();

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

const startServer=async ()=>{
    await ConnectMongoDB();

    server.listen(PORT,()=>{
        console.log("Server started on port "+ PORT);
    });
}

startServer();


