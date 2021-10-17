import redis from 'redis';
const client = redis.createClient();
// const client = redisClient(6379, 'localhost');
export default client;