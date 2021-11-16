import { FormatTypes, Interface } from '@ethersproject/abi'

import StackableContainer from './StackableContainer'

type Props = {
  value: string
  onChange(value: string): void
  readOnly?: boolean
}

const ABIInput = ({ value, onChange, readOnly }: Props) => {
  const formatted = formatAbi(value)

  return (
    <>
      <StackableContainer lessMargin lessPadding lessRadius>
        <label htmlFor="ABI-input">
          {readOnly ? 'ABI from explorer' : 'Paste in ABI here'}
        </label>
        <textarea
          id="ABI-input"
          readOnly={readOnly}
          value={formatted || value}
          onChange={(ev) => {
            onChange(parseAbi(ev.target.value))
          }}
          aria-invalid={formatted !== null}
        />
      </StackableContainer>
      {formatted === null && (
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

const formatAbi = (value: string): string | null => {
  if (!value) return null
  const abiInterface = new Interface(value)
  const formatted = abiInterface.format(FormatTypes.FULL)
  if (typeof formatted === 'string') return formatted
  return formatted.join('\n')
}

const parseAbi = (value: string): string => {
  if (!value) return ''

  let input
  try {
    // try if the value is JSON format
    input = JSON.parse(value)
  } catch (e) {
    // it's not JSON, so maybe it's human readable format
    input = value.split('\n')
  }

  try {
    const abiInterface = new Interface(input)
    return abiInterface.format(FormatTypes.json) as string
  } catch (e) {
    return ''
  }
}

export default ABIInput
