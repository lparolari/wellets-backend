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

class PortfoliosController {
  public async index(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const { id } = request.user;
    const { parent_id } = request.params;

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
      wallet_ids,
      parent_id,
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
      wallet_ids,
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

    const deletePortfolio = container.resolve(DeletePortfolioService);

    const portfolio = await deletePortfolio.execute({
      user_id: user.id,
      portfolio_id,
    });

    return response.status(204).json(portfolio);
  }

  public async balance(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const { user } = request;
    const { target_currency } = request.query;
    const { portfolio_id } = request.params;

    const showPortfolioBalance = container.resolve(ShowPortfolioBalanceService);
    const getUserPreferredCurrency = container.resolve(
      GetUserPreferredCurrencyService,
    );

    const defaultCurrency = await getUserPreferredCurrency.execute({
      user_id: user.id,
    });

    const portfolio = await showPortfolioBalance.execute({
      target_currency: target_currency
        ? target_currency.toString()
        : defaultCurrency.acronym,
      portfolio_id,
      user_id: user.id,
    });

    return response.status(200).json(portfolio);
  }

  public async rebalance(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const { user } = request;
    const { target_currency } = request.query;
    const { portfolio_id } = request.params;

    const showPortfolioCurrentAllocation = container.resolve(
      ShowPortfolioCurrentAllocationService,
    );

    const currentAllocation = await showPortfolioCurrentAllocation.execute({
      target_currency: target_currency ? target_currency.toString() : '',
      portfolio_id,
      user_id: user.id,
    });

    return response.status(200).json(currentAllocation);
    // const showPortfolioBalance = container.resolve(ShowPortfolioBalanceService);
    // const getUserPreferredCurrency = container.resolve(
    //   GetUserPreferredCurrencyService,
    // );

    // const defaultCurrency = await getUserPreferredCurrency.execute({
    //   user_id: user.id,
    // });

    // const portfolio = await showPortfolioBalance.execute({
    //   target_currency: target_currency
    //     ? target_currency.toString()
    //     : defaultCurrency.acronym,
    //   portfolio_id,
    //   user_id: user.id,
    // });

    // return response.status(200).json(portfolio);
  }
}

export default PortfoliosController;
