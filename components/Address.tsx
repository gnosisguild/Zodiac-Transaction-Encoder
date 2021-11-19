import React from 'react'
import { getAddress } from '@ethersproject/address'

type Props = {
  value: string
  onChange(value: string): void
}

const validateAddress = (value: string): boolean => {
  try {
    return !!getAddress(value)
  } catch (e) {
    return false
  }
}

const Address: React.FC<Props> = ({ value, onChange }) => (
  <>
    <label style={{ marginTop: '1em' }} htmlFor="contract-address">
      Address
    </label>
    <input
      type="text"
      value={value}
      onChange={(ev) => {
        onChange(ev.target.value)
      }}
      aria-invalid={validateAddress(value)}
    />
  </>
)

export default Address
