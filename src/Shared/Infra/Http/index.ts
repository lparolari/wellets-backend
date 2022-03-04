import 'dotenv/config';
import 'reflect-metadata';
import 'express-async-errors';
import '../../Containers';

import express from 'express';
import cors from 'cors';
import { errors as celebrateErrors } from 'celebrate';

import log from '../../Helpers/log';
import TypeORM from '../TypeORM';
import Jobs from '../Jobs';
import routes from './Routes/index.routes';
import HandleErrors from './Middlewares/HandleErrors';
// import RateLimiter from './Middlewares/RateLimiter';

const app = express();
const port = process.env.PORT || process.env.APP_PORT || 3333;
const typeORM = new TypeORM();
const jobs = new Jobs();
const handleErrors = new HandleErrors();
// const rateLimiter = new RateLimiter();

typeORM.run().then(() => {
  jobs.run();
  jobs.once();
});

app.use(cors());
app.use(express.json());
// app.use(rateLimiter.on);
app.use(routes);
app.use(celebrateErrors());
app.use(handleErrors.on);

app.listen(port, () => {
  log(`Server Running On Port ${port}`, 'yellow');
});
