import { useEffect, useState } from 'react'
import { Interface } from '@ethersproject/abi'

import StackableContainer from './StackableContainer'

type Props = {
  fetchedAbiText: string | null
  onChange(abi: Interface | null): void
}

const ABIInput = ({ fetchedAbiText, onChange }: Props) => {
  const [abiText, setAbiText] = useState('')
  const [syntaxError, setSyntaxError] = useState(false)

  useEffect(() => {
    try {
      const abi = parseAbiText(fetchedAbiText || abiText)
      setSyntaxError(false)
      onChange(abi)
    } catch (error) {
      console.log('ABI parsing error: ', error)
      setSyntaxError(true)
      onChange(null)
    }
  }, [abiText, fetchedAbiText])

  return (
    <>
      <StackableContainer inputContainer lessMargin>
        <label htmlFor="ABI-input">
          {fetchedAbiText ? 'ABI from explorer' : 'Paste in ABI here'}
        </label>
        <textarea
          id="ABI-input"
          className="ABI-input"
          readOnly={!!fetchedAbiText}
          value={fetchedAbiText || abiText}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setAbiText(e.target.value)
          }}
        />
      </StackableContainer>
      {syntaxError && (
        <StackableContainer lessMargin lessPadding lessRadius>
          <div className="error">
            <p>
              That ABI doesn't seem quite right. Is it malformed?{' '}
              <a href="https://etherscan.io/address/0x1c511d88ba898b4D9cd9113D13B9c360a02Fcea1/#code">
                View an example ABI here
              </a>
              .
            </p>
          </div>
        </StackableContainer>
      )}

      <style jsx>{`
        .ABI-input {
          resize: vertical;
          white-space: pre;
        }
      `}</style>
    </>
  )
}

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
