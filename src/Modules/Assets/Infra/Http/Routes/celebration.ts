/* eslint-disable import/prefer-default-export */
import { celebrate, Joi, Segments } from 'celebrate';

export const averageLoadPriceCelebration = celebrate({
  [Segments.QUERY]: {
    asset_id: Joi.string().uuid().required(),
  },
});
