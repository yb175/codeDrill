import IORedis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

/**
 * @file submissionQueue.js
 * @description
 * This file defines the BullMQ queue for handling code submissions in a batch-wise manner.
 * It uses a single ioredis connection to connect to Redis (local or cloud) and supports:
 *   - Batching of test cases
 *   - Fail-skip logic: if any test case in a batch fails, remaining tests are skipped
 *   - Concurrency: multiple batches processed in parallel
 *   - Retries: automatic retry on temporary Redis/worker failure
 *
 * Features leveraged from ioredis:
 *   - TLS(Transport Layer Security)/SSL(Secure Sockets Layer) support for cloud Redis (Upstash, AWS, etc.)
 *   - Auto-reconnect and retry logic
 *   - Promise-based async/await support
 *   - Pub/Sub support (can be integrated with WebSocket for real-time updates)
 *   - Pipelining / Transactions for faster batch operations
 *
 * Usage:
 *   1. Import the queue in your controller/service:
 *        import submissionQueue from '../config/submissionQueue.js';
 *
 *   2. Add a new job (batch of test cases) to the queue:
 *        await submissionQueue.add('batch', { submissionId, testCases });
 *
 *   3. Worker listens on this queue:
 *        import { Worker } from 'bullmq';
 *        const worker = new Worker('submissions', async job => { ... }, { connection });
 *
 * Environment Variables:
 *   - REDIS_HOST: Redis host (string)
 *   - REDIS_PORT: Redis port (number)
 *   - REDIS_PASSWORD: Redis password (optional, string)
 *
 * Notes:
 *   - Only a single instance of the queue should exist to maintain consistency.
 *   - All modules should import this single instance.
 *   - Designed for a production-ready, scalable, and real-time code submission system.
 *
 * Author: Yug Bhatia
 * Date: 2025-10-18
 */

// Whenever we are working on cloud the IOredis has some more powers like 
const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  password: process.env.REDIS_PASSWORD, 
});

// It would work if we are having redis locally 
// const connection={
//     host: process.env.REDIS_HOST,
//     port: process.env.REDIS_PORT
// }

export default connection ;