import * as React from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import StackableContainer from './StackableContainer'
import {
  defaultAbiCoder,
  FunctionFragment,
  Interface,
  ParamType,
} from '@ethersproject/abi'

type Props = {
  abi: Interface
  fn: FunctionFragment
  inputValues: InputValueMap
}

export type InputValueMap = {
  [key: string]: { value: string; isValid: boolean }
}

const ABIFunctionRenderer = ({ abi, fn, inputValues }: Props) => {
  const { calldata, encodeError } = encode(abi, fn, inputValues)

  return (
    <>
      <StackableContainer lessMargin lessPadding lessRadius>
        <label>Call Data</label>
        <textarea className="callData" disabled value={calldata} />
        <CopyToClipboard text={calldata}>
          <button className="copy-button">Copy to clipboard</button>
        </CopyToClipboard>
      </StackableContainer>
      {encodeError && (
        <StackableContainer lessMargin lessPadding lessRadius>
          <div className="error">
            <p>{encodeError}</p>
          </div>
        </StackableContainer>
      )}
      <style jsx>{`
        .callData {
          padding: 1em;
        }
        .callData:focus,
        .callData:hover,
        .callData:active {
          border: 1px solid #7240a4;
        }
        .copy-button {
          position: absolute;
          top: 10px;
          right: 15px;
          background: #430086;
          color: white;
          border-radius: 10px;
          padding: 5px 8px;
          border: 1px solid #7240a4;
        }
        .copy-button:hover {
          border: 1px solid #8559b0;
        }
      `}</style>
    </>
  )
}

// ABI might have inputs without name
export function inputId(fn: FunctionFragment, input: ParamType, i: number) {
  return `${fn.name}-${input.name ? input.name : i}`
}

export function isInputValid(input: ParamType, value: string): boolean {
  let sanitisedValue
  try {
    sanitisedValue = JSON.parse(value)
  } catch (e) {
    sanitisedValue = value
  }

  try {
    const result = defaultAbiCoder.encode([input.type], [sanitisedValue])
    return !!result
  } catch (e) {
    return false
  }
}

function encode(
  abi: Interface,
  fn: FunctionFragment,
  inputValueMap: InputValueMap
) {
  let calldata = ''
  let encodeError = ''

  const inputValues = fn.inputs.map(
    (input, i) => inputValueMap[inputId(fn, input, i)]?.value || ''
  )

  try {
    calldata = abi.encodeFunctionData(
      fn.name,
      inputValues.map((value) => {
        try {
          return JSON.parse(value)
        } catch (e) {
          return value
        }
      })
    )
    encodeError = ''
  } catch (error) {
    const count = inputValues.filter((value) => value.trim().length > 0).length
    // show a console log if theres at least one filled input
    if (count > 0) {
      console.log('Encoding error: ', error)
    }
    // show ui error if every field has some value
    if (fn.inputs.length === count) {
      encodeError = 'Invalid or not enough data to generate call data'
    }
  }
  return { calldata, encodeError }
}

export default ABIFunctionRenderer
