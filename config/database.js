
// export { sequelize }
// sequelize works with promises..
import Sequelize from 'sequelize';

const sequelize = new Sequelize('dayexpenseapp','root','1Ankit@2002',{dialect:'mysql',host:'localhost',logging:false});

export default sequelize;



