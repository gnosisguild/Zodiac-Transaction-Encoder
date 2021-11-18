import * as React from 'react'
import Select from './Select'
import { Interface } from '@ethersproject/abi'

import StackableContainer from './StackableContainer'

type Props = {
  abi: Interface
  onChange(method: string): void
}

const FunctionSelect = ({ abi, onChange }: Props) => {
  const createOptions = (abi: Interface) =>
    Object.keys(abi.functions).map((key) => ({
      value: key,
      label: abi.functions[key].name,
    }))

  const options = createOptions(abi)

  return (
    <StackableContainer lessMargin inputContainer>
      <label htmlFor="function-select-input">Select function to encode</label>
      <Select
        options={options}
        name="function-select"
        inputId="function-select-input"
        onChange={(selected: { value: string; label: string }) => {
          onChange((selected as { value: string; label: string }).value)
        }}
      />
    </StackableContainer>
  )
}

export default FunctionSelect
