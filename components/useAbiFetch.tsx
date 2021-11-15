import { FormatTypes, Interface } from '@ethersproject/abi'
import { getAddress } from '@ethersproject/address'

import { useEffect, useState } from 'react'

const NETWORK_ULS = {
  '1': 'https://api.etherscan.io/api',
  '4': 'https://api-rinkeby.etherscan.io/api',
  '100': 'https://blockscout.com/xdai/mainnet/api',
  '73799': 'https://volta-explorer.energyweb.org/api',
  '246': 'https://explorer.energyweb.org/api',
  '137': 'https://api.polygonscan.com/api',
  '56': 'https://api.bscscan.com/api',
  '42161': 'https://api.arbiscan.io/api',
}

export const NETWORK_NAMES: { [key: string]: string } = {
  '1': 'Mainnet',
  '4': 'Rinkeby',
  '100': 'xDai',
  '73799': 'Volta',
  '246': 'EnergyWeb',
  '137': 'Polygon',
  '56': 'BSC',
  '42161': 'Arbi',
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
}

export const useAbiFetch = ({
  address,
  network,
  blockExplorerApiKey,
}: Props) => {
  const [{ abiText, abi, loading, success }, setState] = useState<State>({
    abiText: '',
    abi: null,
    loading: false,
    success: false,
  })

  useEffect(() => {
    let canceled = false

    if (isValidAddress(address)) {
      setState({ abi: null, abiText: '', loading: true, success: false })
      fetchAbi(network, address, blockExplorerApiKey).then(
        ({ abi, abiText }) => {
          if (!canceled) {
            setState({ abi, abiText, loading: false, success: abi !== null })
          }
        }
      )
    } else {
      setState({ abi: null, abiText: '', loading: false, success: false })
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
}

function isValidAddress(value: string): boolean {
  try {
    return !!getAddress(value)
  } catch (e) {
    return false
  }
}
