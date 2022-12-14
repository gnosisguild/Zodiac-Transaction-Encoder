import * as React from 'react'
import Select from './Select'
import { Interface } from '@ethersproject/abi'

import StackableContainer from './StackableContainer'

type Props = {
  abi: Interface
  onChange(method: string): void
}

const FunctionOption: React.FC<{ abi: Interface; fn: string }> = ({
  abi,
  fn,
}) => {
  const functionFragment = abi.functions[fn]
  const params = functionFragment.format('full').split('(')[1].split(')')[0]
  const isOverloaded =
    abi.fragments.filter(
      (fragment) =>
        fragment.type === 'function' && fragment.name === functionFragment.name
    ).length > 1

  return (
    <div className="option">
      {functionFragment.name} {isOverloaded && <small>({params})</small>}
      <style jsx>{`
        .option {
          white-space: nowrap;
        }
      }`}</style>
    </div>
  )
}

const FunctionSelect = ({ abi, onChange }: Props) => {
  const createOptions = (abi: Interface) =>
    Object.keys(abi.functions).map((key) => ({
      value: key,
      label: <FunctionOption abi={abi} fn={key} />,
    }))

  const options = createOptions(abi)

  return (
    <StackableContainer lessMargin inputContainer>
      <label htmlFor="function-select-input">Select function to encode</label>
      <Select
        options={options as any}
        name="function-select"
        inputId="function-select-input"
        onChange={(selected) => {
          onChange(selected?.value as string)
        }}
      />
    </StackableContainer>
  )
}

export default FunctionSelect
