import mongoose from 'mongoose';

const user = new mongoose.Schema({
    name: String,  
    email : {
        type: String, 
        unique : true
    },
    password :  String,
})

const UserSchema = mongoose.model('User', user);

export default UserSchema;