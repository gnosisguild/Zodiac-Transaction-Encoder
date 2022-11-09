import React, { useState } from 'react'
import { Interface } from '@ethersproject/abi'

import Layout from '../components/Layout'
import StackableContainer from '../components/StackableContainer'
import ABIInput from '../components/ABIInput'
import FunctionSelect from '../components/FunctionSelect'
import Inputs from '../components/Inputs'
import Encoder, { InputValueMap } from '../components/Encoder'
import Address from '../components/Address'
import Network from '../components/Network'
import { NetworkId, useAbiFetch } from '../components/useAbiFetch'
import Call from '../components/Call'

const IndexPage = () => {
  const [network, setNetwork] = useState<NetworkId>('1')
  const [address, setAddress] = useState('')
  const [abi, setAbi] = useState<Interface | null>(null)
  const [method, setMethod] = useState<string | null>(null)
  const [inputValues, setInputValues] = useState<InputValueMap>({})

  const { abiText, success, error: error } = useAbiFetch({ address, network })

  return (
    <Layout title="Transaction Encoder">
      <h1>Transaction Encoder</h1>
      <StackableContainer base>
        <StackableContainer>
          <p>
            Paste in the Contract Address or the ABI to render available
            functions.
          </p>
          <StackableContainer inputContainer lessMargin>
            <Network onChange={setNetwork} />
            <Address value={address} onChange={setAddress} />
            {error && (
              <span className="error">
                ABI for address could not be retrieved
              </span>
            )}
          </StackableContainer>
          <ABIInput
            fetchedAbiText={success ? abiText : null}
            onChange={setAbi}
          />
        </StackableContainer>
        {abi && <FunctionSelect abi={abi} onChange={setMethod} />}
        {abi && method && !!abi.functions[method] && (
          <>
            <Inputs
              fn={abi.functions[method]}
              inputValues={inputValues}
              onChange={(id, value, isValid) =>
                setInputValues({ ...inputValues, [id]: { value, isValid } })
              }
            />
            <Encoder
              abi={abi}
              fn={abi.functions[method]}
              inputValues={inputValues}
            />

            {address && network && (
              <Call
                network={network}
                address={address}
                abi={abi}
                fn={abi.functions[method]}
                inputValues={inputValues}
              />
            )}
          </>
        )}
      </StackableContainer>
      <style jsx>{`
        h1 {
          font-size: 48px;
        }
      `}</style>
    </Layout>
  )
  return null
}

export default IndexPage
