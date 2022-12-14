import { FunctionFragment, Interface, Result } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'
import { isBigNumberish } from '@ethersproject/bignumber/lib/bignumber'
import { Bytes, hexlify, isBytesLike } from '@ethersproject/bytes'
import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider } from '@ethersproject/providers'

import { useEffect, useState } from 'react'

import { encode, InputValueMap, processInputValues } from './Encoder'
import { NetworkId, RPC_URLS } from './networks'
import StackableContainer from './StackableContainer'

type Props = {
  network: NetworkId
  address: string
  abi: Interface
  fn: FunctionFragment
  inputValues: InputValueMap
}

const Call = ({ network, address, abi, fn, inputValues }: Props) => {
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { calldata } = encode(abi, fn, inputValues)

  useEffect(() => {
    if (!address) {
      return
    }
    let canceled = false

    setError(null)
    setResult(null)
    const contract = new Contract(
      address,
      abi,
      new JsonRpcProvider(RPC_URLS[network], parseInt(network))
    )

    contract.callStatic[fn.format('sighash')](
      ...processInputValues(fn, inputValues)
    )
      .then((result) => {
        if (!canceled) {
          console.log('call result', result)
          setResult(result)
        }
      })
      .catch((e) => {
        console.error(e, { ...e })
        setError(e.reason)
      })

    return () => {
      canceled = true
    }
  }, [calldata, network, address])

  if (error) {
    return (
      <StackableContainer>
        <p>Execution reverted</p>
        <StackableContainer inputContainer lessMargin>
          <code>{error}</code>
        </StackableContainer>
      </StackableContainer>
    )
  }

  if (!result) return null

  if (!fn.outputs || fn.outputs.length === 0) {
    return (
      <StackableContainer>
        <p>Call successful, no output</p>
      </StackableContainer>
    )
  }

  return (
    <StackableContainer>
      <p>Call result</p>
      {Array.isArray(result) ? (
        <ArrayValue value={result} />
      ) : (
        <StackableContainer inputContainer lessMargin>
          <PrimitiveValue value={result} />
        </StackableContainer>
      )}
    </StackableContainer>
  )
}

export default Call

const PrimitiveValue = ({
  value,
}: {
  value: BigNumber | Bytes | string | boolean
}) => {
  if (isBytesLike(value)) {
    return <input type="text" readOnly value={hexlify(value)} />
  }

  if (isBigNumberish(value)) {
    return <input type="text" readOnly value={value.toString()} />
  }

  if (typeof value === 'boolean') {
    return <input type="text" readOnly value={value ? 'true' : 'false'} />
  }

  return <input type="text" readOnly value={value} />
}

const ArrayValue = ({ value }: { value: any[] }) => {
  const labels = Object.keys(value).filter((key) => isNaN(parseInt(key)))
  return (
    <>
      {value.map((item, index) => (
        <StackableContainer inputContainer lessMargin key={index}>
          {labels[index] && <label>{labels[index]}</label>}
          <>
            {Array.isArray(item) ? (
              <ArrayValue value={item} />
            ) : (
              <PrimitiveValue value={item} />
            )}
          </>
        </StackableContainer>
      ))}
    </>
  )
}
