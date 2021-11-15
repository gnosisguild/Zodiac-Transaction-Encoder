import React, { useState } from 'react'
import { Interface } from '@ethersproject/abi'

import Layout from '../components/Layout'
import StackableContainer from '../components/StackableContainer'
import ABIInput from '../components/ABIInput'
import ABIFunctionSelect from '../components/ABIFunctionSelect'
import ABIFunctionRenderer from '../components/ABIFunctionRenderer'

const IndexPage = () => {
  const [abi, setAbi] = useState<Interface | null>(null)
  const [method, setMethod] = useState<string | null>(null)
  return (
    <Layout title="ABI Explorer">
      <StackableContainer>
        <h1>ABI Function Encoder</h1>
      </StackableContainer>
      <ABIInput onChange={setAbi} />
      {abi && <ABIFunctionSelect abi={abi} onChange={setMethod} />}
      {abi && method && (
        <ABIFunctionRenderer ABI={abi} ABIFunction={abi.functions[method]} />
      )}
      <style jsx>{`
        h1 {
        }
      `}</style>
    </Layout>
  )
  return null
}

export default IndexPage
