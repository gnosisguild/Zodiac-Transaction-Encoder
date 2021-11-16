import React, { useState } from 'react'

import Layout from '../components/Layout'
import StackableContainer from '../components/StackableContainer'
import ABIInput from '../components/ABIInput'
import ABIFunctionSelect from '../components/ABIFunctionSelect'
import {
  CallContractTransactionInput,
  createTransaction,
  NetworkId,
  TransactionType,
  useContractCall,
} from 'react-multisend'
import Address from '../components/Address'
import Network from '../components/Network'
import ABIEncoder from '../components/ABIEncoder'

const IndexPage = () => {
  const [network, setNetwork] = useState<NetworkId>('1')
  const [state, setState] = useState<CallContractTransactionInput>(
    createTransaction(TransactionType.callContract)
  )

  const { functions, inputs, fetchSuccess } = useContractCall({
    value: state,
    onChange: setState,
    network,
    blockExplorerApiKey: '',
  })

  return (
    <Layout title="ABI Explorer">
      <StackableContainer>
        <h1>ABI Function Encoder</h1>
      </StackableContainer>
      <StackableContainer lessMargin>
        <StackableContainer lessMargin lessPadding lessRadius>
          <Network onChange={setNetwork} />
          <Address
            value={state.to}
            onChange={(to) => setState({ ...state, to })}
          />
        </StackableContainer>
        <ABIInput
          value={state.abi}
          onChange={(abi) => setState({ ...state, abi })}
          readOnly={fetchSuccess}
        />
      </StackableContainer>

      <ABIFunctionSelect
        functions={functions}
        value={state.functionSignature}
        onChange={(functionSignature) =>
          setState({ ...state, functionSignature })
        }
      />

      {inputs.length > 0 && (
        <ul>
          {inputs.map((input, i) => (
            <li key={input.name}>
              <StackableContainer lessMargin lessPadding lessRadius>
                <label htmlFor={input.name}>
                  {input.name || 'Input'} ({input.type})
                </label>
                <input
                  type="text"
                  value={JSON.stringify(input.value)}
                  onChange={(ev) =>
                    setState({
                      ...state,
                      inputValues: {
                        ...state.inputValues,
                        [input.name]: ev.target.value,
                      },
                    })
                  }
                  name={input.name}
                  data-input-type={input.type}
                />
              </StackableContainer>
            </li>
          ))}
        </ul>
      )}

      <ABIEncoder value={state} />
    </Layout>
  )
}

export default IndexPage
