
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
        host:'localhost',
        logging:false
    });

export default sequelize;



