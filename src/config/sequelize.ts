import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
    process.env.POSTGRES_DATABASE as string,
    process.env.POSTGRES_USER as string,
    process.env.POSTGRES_PASSWORD as string,
    {
        host: process.env.POSTGRES_HOST,
        dialect: 'postgres',
        port: parseInt(process.env.POSTGRES_PORT as string, 10),
    },
);

export default sequelize;
