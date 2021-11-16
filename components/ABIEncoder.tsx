import * as React from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { CallContractTransactionInput, encodeSingle } from 'react-multisend'

import StackableContainer from './StackableContainer'

type Props = {
  value: CallContractTransactionInput
}

const ABIEncoder: React.FC<Props> = ({ value }) => {
  let callData = ''
  let encodeError = null
  try {
    callData = encodeSingle(value).data
  } catch (e) {
    encodeError = (e as Error).message
  }

  return (
    <StackableContainer lessMargin>
      <StackableContainer lessMargin lessPadding lessRadius>
        <label>Call Data</label>
        <textarea className="callData" disabled value={callData} />
        <CopyToClipboard text={callData}>
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
        ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        li {
          margin-top: 20px;
        }
        li:first-child {
          margin-top: 0;
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
    </StackableContainer>
  )
}

export default ABIEncoder
