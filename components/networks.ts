export const BLOCK_EXPLORER_URLS = {
  '1': 'https://api.etherscan.io/api',
  '100': 'https://blockscout.com/xdai/mainnet/api',
  '4': 'https://api-rinkeby.etherscan.io/api',
  '5': 'https://api-goerli.etherscan.io/api',
  '10': 'https://api-optimistic.etherscan.io/api',
  '42220': 'https://explorer.celo.org/api',
  '246': 'https://explorer.energyweb.org/api',
  '73799': 'https://volta-explorer.energyweb.org/api',
  '137': 'https://api.polygonscan.com/api',
  '80001': 'https://api-testnet.polygonscan.com/api',
  '56': 'https://api.bscscan.com/api',
  '42161': 'https://api.arbiscan.io/api',
}

export type NetworkId = keyof typeof BLOCK_EXPLORER_URLS

export const NETWORK_NAMES: Record<NetworkId, string> = {
  '1': 'mainnet',
  '100': 'xdai',
  '4': 'rinkeby',
  '5': 'görli',
  '10': 'optimism',
  '42220': 'celo',
  '246': 'energyweb',
  '73799': 'volta',
  '137': 'polygon',
  '80001': 'mumbai',
  '56': 'bsc',
  '42161': 'arbitrum',
}

export const RPC_URLS: Record<NetworkId, string> = {
  '1': 'https://mainnet.infura.io/v3/2d043e79a14e4145b4e07dd3eb3a5a4b',
  '100': 'https://rpc.gnosischain.com',
  '4': 'https://rinkeby.infura.io/v3/2d043e79a14e4145b4e07dd3eb3a5a4b',
  '5': 'https://goerli.infura.io/v3/2d043e79a14e4145b4e07dd3eb3a5a4b',
  '10': 'https://mainnet.optimism.io',
  '42220': 'https://forno.celo.org',
  '246': 'https://rpc.energyweb.org',
  '73799': 'https://volta-rpc.energyweb.org',
  '137': 'https://polygon-rpc.com',
  '80001': 'https://rpc-mumbai.maticvigil.com',
  '56': 'https://bsc-dataseed.binance.org',
  '42161': 'https://arb1.arbitrum.io/rpc',
}
