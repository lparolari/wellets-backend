/* eslint-disable import/prefer-default-export */
import { celebrate, Joi, Segments } from 'celebrate';

export const averageLoadPriceCelebration = celebrate({
  [Segments.QUERY]: {
    asset_id: Joi.string().uuid().required(),
  },
});

export const balanceCelebration = celebrate({
  [Segments.QUERY]: {
    asset_id: Joi.string().uuid().required(),
  },
});

export const historyCelebration = celebrate({
  [Segments.QUERY]: {
    asset_id: Joi.string().uuid().required(),
    interval: Joi.string().valid('1h', '1d', '1w', '1M', '1y').required(),
    start: Joi.date().required(),
    end: Joi.date().required(),
  },
});

export const capitalGainCelebration = celebrate({
  [Segments.QUERY]: {
    asset_id: Joi.string().uuid().required(),
  },
});
