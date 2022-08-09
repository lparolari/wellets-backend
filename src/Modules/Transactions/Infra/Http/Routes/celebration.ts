/* eslint-disable import/prefer-default-export */
import { celebrate, Joi, Segments } from 'celebrate';

export const createTransactionCelebration = celebrate({
  [Segments.BODY]: {
    wallet_id: Joi.string().uuid().required(),
    value: Joi.number().required(),
    dollar_rate: Joi.number(),
    description: Joi.string().required(),
    created_at: Joi.date(),
    accumulation_id: Joi.string().uuid().allow(null),
  },
});

export const updateTransactionCelebration = celebrate({
  [Segments.PARAMS]: {
    transaction_id: Joi.string().uuid().required(),
  },
  [Segments.BODY]: {
    value: Joi.number().required(),
    dollar_rate: Joi.number().required(),
    description: Joi.string().required(),
    created_at: Joi.date().required(),
    accumulation_id: Joi.string().uuid().allow(null),
  },
});

export const revertTransactionCelebration = celebrate({
  [Segments.PARAMS]: {
    transaction_id: Joi.string().uuid().required(),
  },
});

export const listTransactionsCelebration = celebrate({
  [Segments.QUERY]: {
    wallet_id: Joi.string().uuid().required(),
    // TODO: remove limit/page
    limit: Joi.number().positive().max(1000).default(1000),
    page: Joi.number().positive().default(1),
  },
});
