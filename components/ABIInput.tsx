import { useEffect, useState } from 'react'
import { FormatTypes, Interface } from '@ethersproject/abi'

import StackableContainer from './StackableContainer'
import { NetworkId, useAbiFetch } from './useAbiFetch'
import Address from './Address'
import Network from './Network'

type Props = {
  onChange(abi: Interface | null): void
}

const ABIInput = ({ onChange }: Props) => {
  const [network, setNetwork] = useState<NetworkId>('1')
  const [address, setAddress] = useState('')
  const [abiText, setAbiText] = useState('')
  const [syntaxError, setSyntaxError] = useState(false)

  const { abiText: fetchedAbiText, success } = useAbiFetch({ address, network })

  useEffect(() => {
    try {
      const abi = parseAbiText(success ? fetchedAbiText : abiText)
      setSyntaxError(false)
      onChange(abi)
    } catch (error) {
      console.log('ABI parsing error: ', error)
      setSyntaxError(true)
      onChange(null)
    }
  }, [abiText, fetchedAbiText, success])

  return (
    <StackableContainer lessMargin>
      <StackableContainer lessMargin lessPadding lessRadius>
        <Network onChange={setNetwork} />
        <Address value={address} onChange={setAddress} />
      </StackableContainer>
      <StackableContainer lessMargin lessPadding lessRadius>
        <label htmlFor="ABI-input">Paste in ABI</label>
        <textarea
          id="ABI-input"
          readOnly={success}
          value={success ? fetchedAbiText : abiText}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setAbiText(sanitizeAbiText(e.target.value))
          }}
        />
      </StackableContainer>
      {syntaxError && (
        <StackableContainer lessMargin lessPadding lessRadius>
          <div className="error">
            <p>
              That ABI doesn't seem quite right. Is the JSON malformed?{' '}
              <a href="https://etherscan.io/address/0x1c511d88ba898b4D9cd9113D13B9c360a02Fcea1/#code">
                View an example ABI here
              </a>
              .
            </p>
          </div>
        </StackableContainer>
      )}
    </StackableContainer>
  )
}

function sanitizeAbiText(abiText: string) {
  try {
    const json = JSON.parse(abiText)
    const formatted = new Interface(json).format(FormatTypes.FULL)
    return Array.isArray(formatted) ? formatted.join('\n') : formatted
  } catch (e) {
    return abiText
  }
}

function parseAbiText(abiText: string) {
  if (abiText.trim().length === 0) {
    return null
  }

  return new Interface(abiText.split('\n').filter((l) => l.trim().length > 0))
}

export default ABIInput
