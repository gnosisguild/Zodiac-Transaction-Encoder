import { FormatTypes, Interface } from '@ethersproject/abi'
import { Provider } from '@ethersproject/abstract-provider'
import { JsonRpcProvider } from '@ethersproject/providers'
import { getAddress } from '@ethersproject/address'
import detectProxyTarget from 'ethers-proxies'

import { useEffect, useState } from 'react'
import { NetworkId, BLOCK_EXPLORER_URLS, RPC_URLS } from './networks'

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
  const apiUrl = BLOCK_EXPLORER_URLS[network]
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
