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
      <StackableContainer lessMargin inputContainer>
        <label>Call data</label>
        <textarea className="callData" disabled value={calldata} />
        <CopyToClipboard text={calldata}>
          <button className="copy-button">
            <img src="copy.png" alt="Copy and paste icon" />
          </button>
        </CopyToClipboard>
      </StackableContainer>
      {encodeError && (
        <StackableContainer lessMargin>
          <div className="error">
            <p>{encodeError}</p>
          </div>
        </StackableContainer>
      )}
      <style jsx>{`
        .copy-button {
          position: absolute;
          top: 15px;
          right: 15px;
          background: none;
          color: white;
          border-radius: 10px;
          padding: 5px 8px;
          border: none;
        }
        .copy-button:hover {
          background: rgba(217, 212, 173, 0.2);
        }
        .copy-button img {
          display: block;
          width: 16px;
        }

        .callData {
          resize: vertical;
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
  try {
    const result = defaultAbiCoder.encode([input.type], [maybeParseJSON(value)])
    return !!result
  } catch (e) {
    console.warn('invalid input', e, { input, value })
    return false
  }
}

export function processInputValues(
  fn: FunctionFragment,
  inputValueMap: InputValueMap
) {
  const inputEntries = fn.inputs.map(
    (input, i) => inputValueMap[inputId(fn, input, i)]
  )
  return inputEntries.map((entry) => entry?.value || '').map(maybeParseJSON)
}

export function encode(
  abi: Interface,
  fn: FunctionFragment,
  inputValueMap: InputValueMap
) {
  let calldata = ''
  let encodeError = ''

  const inputEntries = fn.inputs.map(
    (input, i) => inputValueMap[inputId(fn, input, i)]
  )
  const countFilled = inputEntries.filter(Boolean).length

  const countValid = inputEntries.filter(
    (entry) => entry?.isValid === true
  ).length

  const inputValues = processInputValues(fn, inputValueMap)

  try {
    calldata = abi.encodeFunctionData(fn.name, inputValues)
    encodeError = ''
  } catch (error) {
    // show a console log if theres at least one filled input
    if (countFilled > 0) {
      console.log('Encoding error: ', error)
    }

    // @Sam not sure if this change makes sense
    // if (fn.inputs.length === count) {
    if (countFilled === fn.inputs.length && countValid > 0) {
      encodeError = 'Invalid or not enough data to generate call data'
    }
  }
  return { calldata, encodeError }
}

function maybeParseJSON(value: string) {
  try {
    const result = JSON.parse(value)
    if (typeof result === 'number') {
      // we want to keep numbers as strings to avoid overflow issues
      return value
    }
    return result
  } catch (e) {
    return value
  }
}

export default ABIFunctionRenderer
