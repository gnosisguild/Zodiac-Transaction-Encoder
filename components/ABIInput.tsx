import { useEffect, useState } from 'react'
import { Interface } from '@ethersproject/abi'

import StackableContainer from './StackableContainer'

type Props = {
  fetchedAbiText: string | null
  onChange(abi: Interface | null): void
}

const ABIInput = ({ fetchedAbiText, onChange }: Props) => {
  const [abiText, setAbiText] = useState(fetchedAbiText || '')
  useEffect(() => {
    if (fetchedAbiText) {
      setAbiText(fetchedAbiText)
    }
  }, [fetchedAbiText])
  const [syntaxError, setSyntaxError] = useState(false)

  const jsonText = formatAbiText(abiText, 'json')
  const humanText = formatAbiText(abiText, 'human')

  useEffect(() => {
    try {
      const abi = parseAbiText(abiText)
      setSyntaxError(false)
      onChange(abi)
    } catch (error) {
      console.log('ABI parsing error: ', error)
      setSyntaxError(true)
      onChange(null)
    }
  }, [abiText])

  const disableFormatButtons = syntaxError || !abiText.trim()

  return (
    <>
      <StackableContainer inputContainer lessMargin>
        <div className="field-head">
          <label htmlFor="ABI-input">
            {fetchedAbiText ? 'ABI from explorer' : 'Paste in ABI here'}
          </label>
          <div className="formats">
            <button
              aria-pressed={
                !disableFormatButtons && abiText.trim() === jsonText
              }
              disabled={disableFormatButtons}
              onClick={() => jsonText && setAbiText(jsonText)}
            >
              json
            </button>
            <button
              aria-pressed={
                !disableFormatButtons && abiText.trim() === humanText
              }
              disabled={disableFormatButtons}
              onClick={() => humanText && setAbiText(humanText)}
            >
              human
            </button>
          </div>
        </div>
        <textarea
          id="ABI-input"
          className="ABI-input"
          readOnly={!!fetchedAbiText}
          value={abiText}
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

        .field-head {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }

        .formats button {
          background: none;
          border: none;
          color: white;
          font-size: 11px;
        }
        .formats button[aria-pressed='true'] {
          background: none;
          border: 1px solid white;
          color: white;
          font-size: 11px;
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

function formatAbiText(abiText: string, format?: 'json' | 'human') {
  if (!format) return abiText

  try {
    const abi = parseAbiText(abiText)
    if (!abi) return abiText
    if (format === 'json') {
      return JSON.stringify(JSON.parse(abi.format('json') as string), null, 2)
    } else {
      return (abi.format('full') as string[]).join('\n')
    }
  } catch (e) {
    return null
  }
}

export default ABIInput
