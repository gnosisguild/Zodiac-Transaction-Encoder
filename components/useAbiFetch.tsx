import { FormatTypes, Interface } from '@ethersproject/abi'
import { Provider } from '@ethersproject/abstract-provider'
import { JsonRpcProvider } from '@ethersproject/providers'
import { getAddress } from '@ethersproject/address'
import detectProxyTarget from 'ethers-proxies'

import { useEffect, useState } from 'react'

const NETWORK_ULS = {
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

export const NETWORK_NAMES: { [key: string]: string } = {
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

const RPC_URLS = {
  '1': 'https://mainnet.infura.io',
  '100': 'https://dai.poa.network',
  '4': 'https://rinkeby.infura.io',
  '5': 'https://goerli.infura.io',
  '10': 'https://mainnet.optimism.io',
  '42220': 'https://forno.celo.org',
  '246': 'https://rpc.energyweb.org',
  '73799': 'https://volta-rpc.energyweb.org',
  '137': 'https://polygon-rpc.com',
  '80001': 'https://rpc-mumbai.maticvigil.com',
  '56': 'https://bsc-dataseed.binance.org',
  '42161': 'https://arb1.arbitrum.io/rpc',
}

export type NetworkId = keyof typeof NETWORK_ULS

type Props = {
  address: string
  network: NetworkId
  blockExplorerApiKey?: string
}

interface State {
  abiText: string
  abi: Interface | null
  loading: boolean
  success: boolean
  error: boolean
}

export const useAbiFetch = ({
  address,
  network,
  blockExplorerApiKey,
}: Props) => {
  const [{ abiText, abi, loading, success, error }, setState] = useState<State>(
    {
      abiText: '',
      abi: null,
      loading: false,
      success: false,
      error: false,
    }
  )

  useEffect(() => {
    let canceled = false

    if (isValidAddress(address)) {
      setState({
        abi: null,
        abiText: '',
        loading: true,
        success: false,
        error: false,
      })
      fetchAbi(
        network,
        address,
        new JsonRpcProvider(RPC_URLS[network], parseInt(network)),
        blockExplorerApiKey
      ).then(({ abi, abiText }) => {
        if (!canceled) {
          setState({
            abi,
            abiText,
            loading: false,
            success: abi !== null,
            error: abi === null,
          })
        }
      })
    } else {
      setState({
        abi: null,
        abiText: '',
        loading: false,
        success: false,
        error: !isEmptyText(address),
      })
    }

    return () => {
      canceled = true
    }
  }, [address, network, blockExplorerApiKey])

  return {
    abi,
    abiText,
    loading,
    success,
    error,
  }
}

export const fetchAbi = async (
  network: NetworkId,
  contractAddress: string,
  provider: Provider,
  blockExplorerApiKey = ''
): Promise<{ abi: Interface | null; abiText: string }> => {
  const apiUrl = NETWORK_ULS[network]
  const params = new URLSearchParams({
    module: 'contract',
    action: 'getAbi',
    address: contractAddress,
    apiKey: blockExplorerApiKey,
  })

  const response = await fetch(`${apiUrl}?${params}`)
  if (!response.ok) {
    return { abi: null, abiText: '' }
  }

  const { result, status } = await response.json()

  if (status === '0' || looksLikeAProxy(result)) {
    // Is this a proxy contract?
    const proxyTarget = await detectProxyTarget(contractAddress, provider)
    return proxyTarget
      ? await fetchAbi(network, proxyTarget, provider, blockExplorerApiKey)
      : { abi: null, abiText: '' }
  }

  const abi = new Interface(result)
  const formatted = abi.format(FormatTypes.FULL)
  const abiText = Array.isArray(formatted) ? formatted.join('\n') : formatted
  return { abi, abiText }
}

function isValidAddress(value: string): boolean {
  try {
    return !!getAddress(value)
  } catch (e) {
    return false
  }
}

function isEmptyText(value: string): boolean {
  return value.trim().length === 0
}

const looksLikeAProxy = (abi: string) => {
  const iface = new Interface(abi)
  const signatures = Object.keys(iface.functions)
  return signatures.length === 0
}
