import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

import AuthController from 'Shared/Containers/AuthProvider/Controllers/AuthController';
import AccumulationsController from '../Controllers/AccumulationsController';

const routes = Router();
const authController = new AuthController();
const accumulationsController = new AccumulationsController();

routes.use(authController.on);

routes.delete(
  '/:accumulation_id',
  celebrate({
    [Segments.PARAMS]: {
      accumulation_id: Joi.string().uuid().required(),
    },
  }),
  accumulationsController.delete,
);

routes.get(
  '/:accumulation_id/next-entry',
  celebrate({
    [Segments.PARAMS]: {
      accumulation_id: Joi.string().uuid().required(),
    },
  }),
  accumulationsController.nextEntry,
);

routes.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      asset_id: Joi.string().uuid().allow(null),
    },
  }),
  accumulationsController.index,
);

routes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      alias: Joi.string().required(),
      strategy: Joi.string().required(),
      quote: Joi.number().min(0).required(),
      planned_entries: Joi.number().min(0).required(),
      every: Joi.object({
        years: Joi.number().allow(null),
        months: Joi.number().allow(null),
        weeks: Joi.number().allow(null),
        days: Joi.number().allow(null),
        hours: Joi.number().allow(null),
        minutes: Joi.number().allow(null),
        seconds: Joi.number().allow(null),
      }),
      planned_start: Joi.date().required(),
      planned_end: Joi.date().required(),
      asset_id: Joi.string().uuid().required(),
    },
  }),
  accumulationsController.create,
);

export default routes;
