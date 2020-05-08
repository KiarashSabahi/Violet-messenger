import redis from "redis";
import util from "util";


//

const redisURL = "redis://127.0.0.1:6379";
const client = redis.createClient(redisURL);

client.hget = util.promisify(client.hget);
client.hgetall = util.promisify(client.hgetall);
client.get = util.promisify(client.get);


export let cacheIt = async (hashKey, key, input, toggle) => {
  //toggle = true -> set
  //toggle = false -> get
  if (toggle) {
    client.hset(hashKey, key, JSON.stringify(input));
  } else {
    const output = await client.hget(hashKey, key);
    return JSON.parse(output);
  }
};