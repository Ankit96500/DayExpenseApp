
// export { sequelize }
// sequelize works with promises..
import dotenv from 'dotenv';
import Sequelize from 'sequelize';
dotenv.config()

const sequelize = new Sequelize(
    'dayexpenseapp',
    process.env.MYSQL_DB_USER,
    process.env.MYSQL_DB_PASSWORD,
    {dialect:'mysql',
        host:process.env.MYSQL_HOST,
        logging:false,
        pool: {
            max: 5,         // Maximum number of connection in pool
            min: 0,         // Minimum number of connection in pool
            acquire: 60000, // Maximum time (in ms) to wait for a connection before throwing a timeout error
            idle: 10000     // Maximum time (in ms) a connection can be idle before being released
    }
}
);

export default sequelize;



