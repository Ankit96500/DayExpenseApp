
// Database setup using mongoDB-ATLAS(ODM)-mongoose
import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config()

const URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0fp2n.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`

async function connectMongoDB(callback){
    try {
        await mongoose.connect(URI)
        if (callback) {
            callback()
        }
    } catch (error) {
        console.log(error);
        if (callback) {
            callback(error)
        }
    }
}

export default connectMongoDB;
// import Sequelize from 'sequelize';
// dotenv.config()

// const sequelize = new Sequelize(
//     'dayexpenseapp',
//     process.env.MYSQL_DB_USER,
//     process.env.MYSQL_DB_PASSWORD,
//     {dialect:'mysql',
//         host:process.env.MYSQL_HOST,
//         logging:false
//     });

// export default sequelize;



