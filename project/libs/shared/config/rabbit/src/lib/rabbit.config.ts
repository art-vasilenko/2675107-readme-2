import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

const DEFAULT_RABBIT_PORT = 5672;

export interface RabbitConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  queue: string;
  exchange: string;
}

const validationSchema = Joi.object({
  host: Joi.string().hostname().required(),
  port: Joi.number().port().default(DEFAULT_RABBIT_PORT),
  user: Joi.string().required(),
  password: Joi.string().required(),
  queue: Joi.string().required(),
  exchange: Joi.string().required(),
});

function getConfig(): RabbitConfig {
  const config: RabbitConfig = {
    host: process.env.RABBIT_HOST,
    port: parseInt(process.env.RABBIT_PORT ?? DEFAULT_RABBIT_PORT.toString(), 10),
    user: process.env.RABBIT_USER,
    password: process.env.RABBIT_PASSWORD,
    queue: process.env.RABBIT_QUEUE,
    exchange: process.env.RABBIT_EXCHANGE,
  };
  const { error } = validationSchema.validate(config, { abortEarly: true });
  if (error) throw new Error(`[Rabbit Config Validation Error]: ${error.message}`);
  return config;
}

export default registerAs('rabbit', getConfig);
