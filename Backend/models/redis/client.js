import { createClient } from 'redis';

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-18620.c114.us-east-1-4.ec2.redns.redis-cloud.com',
        port: 18620
    }
});

export default redisClient ; 