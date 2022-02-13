interface IWalletBalancesRepository {
  snapshot(): Promise<void>;
}

export default IWalletBalancesRepository;
