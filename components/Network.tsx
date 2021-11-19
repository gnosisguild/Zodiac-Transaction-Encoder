import * as React from 'react'
import Select from './Select'
import { NetworkId, NETWORK_NAMES } from './useAbiFetch'

type Props = {
  onChange(networkId: NetworkId): void
}

const options = Object.keys(NETWORK_NAMES).map((key) => ({
  value: key as NetworkId,
  label: NETWORK_NAMES[key],
}))

const Network = ({ onChange }: Props) => {
  return (
    <>
      <label htmlFor="network-select-input">Network</label>
      <Select
        defaultValue={options[0]}
        options={options}
        onChange={(selected: { value: string }) => {
          onChange((selected?.value as NetworkId) || '1')
        }}
        name="network-select"
        inputId="network-select-input"
      />
    </>
  )
}

export default Network
