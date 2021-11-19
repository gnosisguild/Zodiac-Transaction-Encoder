import { FormatTypes, Interface } from '@ethersproject/abi'
import { getAddress } from '@ethersproject/address'

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
      fetchAbi(network, address, blockExplorerApiKey).then(
        ({ abi, abiText }) => {
          if (!canceled) {
            setState({
              abi,
              abiText,
              loading: false,
              success: abi !== null,
              error: abi === null,
            })
          }
        }
      )
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

const fetchAbi = async (
  network: NetworkId,
  address: string,
  blockExplorerApiKey = ''
) => {
  const apiUrl = NETWORK_ULS[network]
  const params = new URLSearchParams({
    module: 'contract',
    action: 'getAbi',
    address: address,
    apiKey: blockExplorerApiKey,
  })

  try {
    const response = await fetch(`${apiUrl}?${params}`)
    if (!response.ok) {
      return { abi: null, abiText: '' }
    }

    const { result, status } = await response.json()
    if (status === '0') {
      console.error(`Could not fetch contract ABI: ${result}`)
      return { abi: null, abiText: '' }
    }

    const abi = new Interface(result)
    const formatted = abi.format(FormatTypes.FULL)
    const abiText = Array.isArray(formatted) ? formatted.join('\n') : formatted
    return { abi, abiText }
  } catch (e) {
    return { abi: null, abiText: '' }
  }
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
