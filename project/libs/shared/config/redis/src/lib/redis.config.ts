import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

const DEFAULT_REDIS_PORT = 6379;

export interface RedisConfig {
  host: string;
  port: number;
}

const validationSchema = Joi.object({
  host: Joi.string().hostname().required(),
  port: Joi.number().port().default(DEFAULT_REDIS_PORT),
});

function getConfig(): RedisConfig {
  const config: RedisConfig = {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT ?? DEFAULT_REDIS_PORT.toString(), 10),
  };

  const { error } = validationSchema.validate(config, { abortEarly: true });
  if (error) {
    throw new Error(`[Redis Config Validation Error]: ${error.message}`);
  }

  return config;
}

export default registerAs('redis', getConfig);
