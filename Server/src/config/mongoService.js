const mongoose = require('mongoose');


mongoose.connection.once('open',()=>{
   console.log("MongDB connection established!!!");
})

mongoose.connection.on('error',(err)=>{
   console.log(err);
})

const ConnectMongoDB = async ()=>{   
     await mongoose.connect(process.env.MONGODB_URL);
}

const DisconnectMongoDB = async ()=>{
     await mongoose.disconnect();
}

module.exports={
    ConnectMongoDB,
    DisconnectMongoDB
}