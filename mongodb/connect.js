import mongoose from 'mongoose';


//Connect to the database
const connectDb = (url) => {

    mongoose.set('strictQuery', true);

    mongoose.connect(url)
        .then(() => console.log('MongoDB connected'))
        .catch((err) => console.log(err));
}

export default connectDb;