import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';

import IndexPortfoliosByParentIdService from 'Modules/Portfolios/Services/IndexPortfoliosByParentIdService';
import CreatePortfolioService from 'Modules/Portfolios/Services/CreatePortfolioService';
import DeletePortfolioService from 'Modules/Portfolios/Services/DeletePortfolioService';
import IndexAllPortfoliosService from 'Modules/Portfolios/Services/IndexAllPortfoliosService';
import UpdatePortfolioService from 'Modules/Portfolios/Services/UpdatePortfolioService';
import ShowPortfolioService from 'Modules/Portfolios/Services/ShowPortfolioService';
import ShowPortfolioBalanceService from 'Modules/Portfolios/Services/ShowPortfolioBalanceService';
import GetUserPreferredCurrencyService from 'Modules/Users/Services/GetUserPreferredCurrencyService';
import ShowPortfolioCurrentAllocationService from 'Modules/Portfolios/Services/ShowPortfolioCurrentAllocationService';
import ShowPortfoliosBalanceService from 'Modules/Portfolios/Services/ShowPortfoliosBalanceService';
import CollectRecursiveParentPotfoliosService from 'Modules/Portfolios/Services/CollectRecursiveParentPotfoliosService';

class PortfoliosController {
  public async index(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const { id } = request.user;
    const parent_id =
      request.params.parent_id ||
      request.query.parent_id?.toString() ||
      undefined;

    const indexPortfoliosByParentId = container.resolve(
      IndexPortfoliosByParentIdService,
    );

    const portfolios = await indexPortfoliosByParentId.execute({
      parent_id,
      user_id: id,
    });

    return response.json(portfolios);
  }

  public async indexAll(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const { id } = request.user;

    const indexAll = container.resolve(IndexAllPortfoliosService);

    const portfolios = await indexAll.execute({
      user_id: id,
    });

    return response.json(portfolios);
  }

  public async details(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const { user } = request;
    const { portfolio_id } = request.params;

    const showPortfolio = container.resolve(ShowPortfolioService);

    const portfolios = await showPortfolio.execute({
      id: portfolio_id,
      user_id: user.id,
    });

    return response.json(portfolios);
  }

  public async create(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const { id } = request.user;
    const { alias, weight, wallet_ids, parent_id } = request.body;
    const createPortfolio = container.resolve(CreatePortfolioService);

    const portfolio = await createPortfolio.execute({
      user_id: id,
      alias,
      weight,
      wallet_ids: wallet_ids ?? [],
      parent_id: parent_id ?? undefined,
    });

    return response.status(201).json(portfolio);
  }

  public async update(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const { user } = request;
    const { portfolio_id } = request.params;
    const { alias, weight, wallet_ids, parent_id } = request.body;

    const updatePortfolio = container.resolve(UpdatePortfolioService);

    const portfolio = await updatePortfolio.execute({
      id: portfolio_id,
      user_id: user.id,
      alias,
      weight,
      wallet_ids: wallet_ids ?? [],
      parent_id,
    });

    return response.json(portfolio);
  }

  public async delete(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const { user } = request;

    const { portfolio_id } = request.params;

    const showPortfolio = container.resolve(ShowPortfolioService);
    const deletePortfolio = container.resolve(DeletePortfolioService);

    const portfolio = await showPortfolio.execute({
      id: portfolio_id,
      user_id: user.id,
    });

    await deletePortfolio.execute({
      user_id: user.id,
      portfolio_id,
    });

    return response.status(200).json(portfolio);
  }

  public async balance(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const { user } = request;

    const portfolio_id =
      request.params.portfolio_id ||
      request.query.portfolio_id?.toString() ||
      undefined;

    const showPortfolioBalance = container.resolve(ShowPortfolioBalanceService);
    const showPortfoliosBalance = container.resolve(
      ShowPortfoliosBalanceService,
    );
    const getUserPreferredCurrency = container.resolve(
      GetUserPreferredCurrencyService,
    );

    const currency = await getUserPreferredCurrency.execute({
      user_id: user.id,
    });

    const showBalanceService = portfolio_id
      ? showPortfolioBalance
      : showPortfoliosBalance;

    const balance = await showBalanceService.execute({
      currency_id: currency.id,
      user_id: user.id,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...((portfolio_id ? { portfolio_id } : {}) as any), // type checker cannot ensure that portfolio_id will be forwarded to `showPortfolioBalance`
    });

    return response.status(200).json({ ...balance, currency });
  }

  public async rebalance(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const { user } = request;
    const { portfolio_id } = request.params;

    const showPortfolioCurrentAllocation = container.resolve(
      ShowPortfolioCurrentAllocationService,
    );
    const showBaseCurrency = container.resolve(GetUserPreferredCurrencyService);

    const currency = await showBaseCurrency.execute({
      user_id: user.id,
    });

    const currentAllocation = await showPortfolioCurrentAllocation.execute({
      portfolio_id,
      currency_id: currency.id,
      user_id: user.id,
    });

    return response.status(200).json({ ...currentAllocation, currency });
  }

  public async parents(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const { user } = request;
    const { portfolio_id } = request.params;

    const collectRecursiveParentPotfolios = container.resolve(
      CollectRecursiveParentPotfoliosService,
    );

    const portfolios = await collectRecursiveParentPotfolios.execute({
      portfolio_id,
      user_id: user.id,
    });

    return response.json(portfolios);
  }
}

export default PortfoliosController;
