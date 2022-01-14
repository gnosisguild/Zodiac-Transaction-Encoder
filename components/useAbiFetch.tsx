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
  '1': 'https://mainnet.infura.io/v3/2d043e79a14e4145b4e07dd3eb3a5a4b',
  '100': 'https://dai.poa.network',
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

const DEFAULT_ETHERSCAN_API_KEY = '9D13ZE7XSBTJ94N9BNJ2MA33VMAY2YPIRB'

export const fetchAbi = async (
  network: NetworkId,
  contractAddress: string,
  provider: Provider,
  blockExplorerApiKey = DEFAULT_ETHERSCAN_API_KEY
): Promise<{ abi: Interface | null; abiText: string }> => {
  const apiUrl = NETWORK_ULS[network]
  const params = new URLSearchParams({
    module: 'contract',
    action: 'getAbi',
    address: contractAddress,
    apiKey: blockExplorerApiKey,
  })

  const response = await throttledFetch(`${apiUrl}?${params}`)
  if (!response.ok) {
    return { abi: null, abiText: '' }
  }

  let { result, status } = await response.json()

  if (result && result.toLowerCase().indexOf('rate limit') >= 0) {
    console.error('Block explorer API rate limit is exceeded.')
    return { abi: null, abiText: '' }
  }

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

const throttledFetch = throttle(fetch, 5)

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function throttle<T extends (...args: any[]) => Promise<any>>(
  callback: T,
  callsPerSecond: number
): T {
  let slotStart = 0
  let callsPending = 0

  const throttled = (async (...args) => {
    if (slotStart === 0) slotStart = Date.now()

    const slotsPassed = Math.floor(Date.now() - slotStart / 1000)
    if (slotsPassed > 0) {
      // we've reached a later slot, this means some pending calls have been dispatched
      callsPending = Math.max(callsPending - slotsPassed * callsPerSecond, 0)
    }

    // Calculate delay based on the number of pending calls.
    // We need to wait for all already filled slots to pass.
    const delay = Math.floor(callsPending / callsPerSecond) * 1000
    callsPending++
    if (delay > 0) await wait(delay)

    return callback(...args)
  }) as T

  return throttled
}
