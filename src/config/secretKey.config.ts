import dotenv from 'dotenv';

dotenv.config();

const secretKey = String(process.env.SECRET_KEY);

export default secretKey;
