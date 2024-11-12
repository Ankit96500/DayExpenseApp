
// export { sequelize }
// sequelize works with promises..
import dotenv from 'dotenv';
import {Sequelize} from 'sequelize';
dotenv.config()
console.log('DB_HOST:', process.env.DB_HOST); // This should print a valid host, like 'localhost' or your DB server's IP.

const sequelize = new Sequelize(
    process.env.DB_NAME || "localdb",
    process.env.DB_USER || "localuser",
    process.env.DB_PASSWORD || "localpw",
    {dialect:'mysql',
        host: process.env.DB_HOST || 'localhost',
        logging:false,
        pool: {
            max: 5,         // Maximum number of connection in pool
            min: 2,         // Minimum number of connection in pool
            acquire: 60000, // Maximum time (in ms) to wait for a connection before throwing a timeout error
            idle: 10000     // Maximum time (in ms) a connection can be idle before being released
    }
}
);

export default sequelize;



