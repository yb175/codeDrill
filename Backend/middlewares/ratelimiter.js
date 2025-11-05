import redisClient from "../models/redis/client.js";

export default async function ratelimiter(req, res, next) {
  try {
    const key = String(req?.result?._id) || req.ip;

    const currTime = Date.now() / 1000; // in seconds
    const maxReqTime = 3600;
    const total_time = currTime - maxReqTime;

    const prevReqTime = parseFloat(await redisClient.get(`prevTime:${key}`));

    if (prevReqTime && currTime - prevReqTime < 10) {
      throw new Error("Too frequent submission");
    }

    // Remove old requests outside of window
    await redisClient.zRemRangeByScore(key, 0, total_time);

    const numberofReq = await redisClient.zCard(key);

    if (numberofReq >= 500) {
      throw new Error("Number of requests exceeded :(");
    }

    // Store new request info
    await redisClient.set(`prevTime:${key}`, currTime);
    await redisClient.zAdd(key, {
      score: currTime,
      value: `${currTime}:${Math.random()}`,
    });

    // Set expiry for both keys
    await redisClient.expire(key, maxReqTime);
    await redisClient.expire(`prevTime:${key}`, maxReqTime);

    next();
  } catch (err) {
    res.status(429).json({
      success: false,
      message: err.message,
    });
  }
}
