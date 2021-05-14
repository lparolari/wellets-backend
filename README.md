<div align="center">
  <a href="https://wellets-api.ondaniel.com.br/">
    <div>
      <h1 style="color: #68d391">Wellets</h1>
    </div>
    <img src="https://github.com/stemDaniel/wellets-frontend/raw/master/src/Assets/Icons/wallet.svg" width="100" height="100">
  </a>
  <br>
  <br>
  <div>
    <a href="https://img.shields.io/github/v/tag/stemDaniel/wellets-backend?color=%2368d391&style=for-the-badge">
      <img src="https://img.shields.io/github/v/tag/stemDaniel/wellets-backend?color=%2368d391&style=for-the-badge">
    </a>
    <a href="https://img.shields.io/github/license/stemDaniel/wellets-backend?color=%2368d391&style=for-the-badge">
      <img src="https://img.shields.io/github/license/stemDaniel/wellets-backend?color=%2368d391&style=for-the-badge">
    </a>
  </div>
  <hr>
</div>

## Introduction

[Wellets](https://wellets.ondaniel.com.br/) is a financial management website that helps users to manage their money placed in multiple portfolios.
It was developed with a focus on users engaged in the crypto world. Theses users usually have money on their bank accounts, exchanges, blockchain wallets and stuff like that. As there are a lots of places to put their money, it is easy to gets confused with their own money.
To avoid that, [Wellets](https://wellets.ondaniel.com.br/) currently provide wallet and currency management features to help users control their money with more accurately.

ADVICE: [Wellets](https://wellets.ondaniel.com.br/) does not have any type of integration with bank accounts or blockchain wallets, all management is done manually. The benefit of using this is the user experience and practicality, but the user needs to specify their transfers and transactions to see the power of the application.

## Features

- Sign up
- Sign in
- Sign out
- Wallet CRUD
- View sum of balances of all wallets on a specific currency
- Create transactions and transfers
- View transaction and transfer history
- Custom currencies CRUD

If [Wellets](https://wellets.ondaniel.com.br/) currently does not have a certain feature you think it is awesome, be sure to check out the [roadmap](https://www.notion.so/Wellets-public-roadmap-d5e4445d9cc0441694c246904979e5bb) to see if this is already planned for the future. Otherwise, you can contact me by any contact method listed in my [Github Profile](https://github.com/stemDaniel) to send your ideas.

## Endpoints

| METHOD | PATH                   | SHORT DESCRIPTION                       |
| ------ | ---------------------- | --------------------------------------- |
| GET    | /currencies            | Index native and user custom currencies |
| GET    | /currencies/custom     | Index user custom currencies            |
| POST   | /currencies/custom     | Create a custom currency                |
| PUT    | /currencies/custom/:id | Update a custom currency                |
| DELETE | /currencies/custom/:id | Delete a custom currency                |
| GET    | /transactions          | Index wallet transactions               |
| POST   | /transactions          | Create a wallet transaction             |
| GET    | /transfers             | Index wallet transfers                  |
| POST   | /transfers             | Create a transfer between two wallets   |
| POST   | /users                 | User sign up                            |
| POST   | /users/sessions        | User sign in                            |
| DELETE | /users/sessions        | User sign out                           |
| GET    | /wallets               | Index user wallets                      |
| POST   | /wallets               | Create a wallet                         |
| DELETE | /wallets               | Delete a wallet                         |
| GET    | /wallets/total-balance | Show the sum of wallets balances        |

## How to run

1. Install project dependencies:

   `npm install` or `yarn install`

2. Copy `docker-compose.example.yml` located at the root folder to a new `docker-compose.yml` file and fill it with the credentials that you want to create the containers.

3. Set up docker containers:

   `docker-compose up -d`

4. Copy `ormconfig.example.json` located at the root folder to a new `ormconfig.json` file and fill it with the credentials that you have set up when creating the containers.

5. If you make sure that your containers were successfully created, run TypeORM migrations:

   `npm run run-migrations` or `yarn run-migrations`

6. Copy `.env.example` located at the root folder to a new `.env` file and fill it with the credentials that you have set up on the past steps.

7. Run project:

   `npm run dev` or `yarn dev`

## How to build

1. Generate `build` folder:

   `npm run build` or `yarn build`

2. Change your `ormconfig.json` file to use the files located on the `dist` folder:

   Just replace `src` by `dist` and `.ts` to `.js` on the `ormconfig.json` entries.

3. Run project:

   `pm2 reload ecosystem.config.js`

   May you will need to install `pm2` globally with `npm install -g pm2` or `yarn global add pm2`

## How to contribute

If you want to contribute with me to improve it and add new features, you can contact me by any contact method listed in my [Github Profile](https://github.com/stemDaniel).

## License

MIT © [Daniel Oliveira](https://homepages.dcc.ufmg.br/~oliveiradaniel/)
