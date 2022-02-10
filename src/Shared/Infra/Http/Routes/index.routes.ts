import { Router } from 'express';

import currenciesRoutes from 'Modules/Currencies/Infra/Http/Routes/index.routes';
import portfoliosRoutes from 'Modules/Portfolios/Infra/Http/Routes/Portfolios.routes';
import transactionsRoutes from 'Modules/Transactions/Infra/Http/Routes/Transactions.routes';
import transfersRoutes from 'Modules/Transfers/Infra/Http/Routes/Transfers.routes';
import usersRoutes from 'Modules/Users/Infra/Http/Routes/index.routes';
import walletsRoutes from 'Modules/Wallets/Infra/Http/Routes/Wallets.routes';

const routes = Router();

routes.use('/currencies', currenciesRoutes);
routes.use('/transactions', transactionsRoutes);
routes.use('/transfers', transfersRoutes);
routes.use('/users', usersRoutes);
routes.use('/wallets', walletsRoutes);
routes.use('/portfolios', portfoliosRoutes);

export default routes;
