const mongoose=require('mongoose');
const consts=require('./consts');

const {MLAB_URL,DB_USER,DB_PASS}=consts;
const url=MLAB_URL;
const options={
    useNewUrlParser:true,
    useCreateIndex:true,
    user:DB_USER,
    pass:DB_PASS
}


const conn=mongoose.createConnection(url,options);

conn.on('connected',()=>console.log('connected'));
conn.on('error',(err)=>console.log(err));

mongoose.connect(url,options);

module.exports=conn;