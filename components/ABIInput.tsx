import { useEffect, useState } from 'react'
import { Interface } from '@ethersproject/abi'

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

  const {
    abiText: fetchedAbiText,
    success: success,
    error: error,
  } = useAbiFetch({ address, network })

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
    <>
      <StackableContainer inputContainer lessMargin>
        <Network onChange={setNetwork} />
        <Address value={address} onChange={setAddress} />
        {error && (
          <span className="error">ABI for address could not be retrieved</span>
        )}
      </StackableContainer>
      <StackableContainer inputContainer lessMargin>
        <label htmlFor="ABI-input">
          {success ? 'ABI from explorer' : 'Paste in ABI here'}
        </label>
        <textarea
          id="ABI-input"
          readOnly={success}
          value={success ? fetchedAbiText : abiText}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setAbiText(e.target.value)
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
    </>
  )
}

// function sanitize(abiText: string) {
//   try {
//     const t = JSON.parse(abiText)
//     const abi = new Interface(t)
//     const r = abi.format(FormatTypes.FULL)
//     return Array.isArray(r) ? r.join('\n') : r
//   } catch (e) {
//     return abiText
//   }
// }

function parseAbiText(abiText: string) {
  if (abiText.trim().length === 0) {
    return null
  }

  let sanitizedAbiText
  try {
    sanitizedAbiText = JSON.parse(abiText)
  } catch (e) {
    sanitizedAbiText = abiText.split('\n').filter((l) => l.trim().length > 0)
  }

  return new Interface(sanitizedAbiText)
}

export default ABIInput
