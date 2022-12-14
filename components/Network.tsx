import * as React from 'react'
import { NetworkId, NETWORK_NAMES } from './networks'
import Select from './Select'

type Props = {
  onChange(networkId: NetworkId): void
}

const options = Object.keys(NETWORK_NAMES).map((key) => ({
  value: key as NetworkId,
  label: NETWORK_NAMES[key as NetworkId],
}))

const Network = ({ onChange }: Props) => {
  return (
    <>
      <label htmlFor="network-select-input">Network</label>
      <Select
        defaultValue={options[0]}
        options={options}
        onChange={(selected) => {
          onChange((selected?.value as NetworkId) || '1')
        }}
        name="network-select"
        inputId="network-select-input"
      />
    </>
  )
}

export default Network
