import * as React from 'react'
import Select from 'react-select'
import { NetworkId, NETWORK_NAMES } from './useAbiFetch'

type Props = {
  onChange(networkId: NetworkId): void
}

interface ThemeSpacing {
  baseUnit: number
  controlHeight: number
  menuGutter: number
}

interface Theme {
  borderRadius: number
  colors: { [key: string]: string }
  spacing: ThemeSpacing
}

const options = Object.keys(NETWORK_NAMES).map((key) => ({
  value: key as NetworkId,
  label: NETWORK_NAMES[key],
}))

const Network = ({ onChange }: Props) => {
  const theme = (theme: Theme) => ({
    ...theme,
    borderRadius: 10,
    colors: {
      ...theme.colors,
      neutral0: '#430086',
      neutral5: '#561A93',
      neutral10: '#69339E',
      neutral20: '#7240A4',
      neutral30: '#8559B0',
      neutral40: '#9873BD',
      neutral50: '#AA8CC8',
      neutral60: '#BDA6D5',
      neutral70: '#C7B3DB',
      neutral80: '#D0BFE0',
      neutral90: '#E3D9ED',
      primary: 'white',
      primary75: '#AA8CC8',
      primary50: '#7240A4',
      primary25: '#561A93',
    },
  })

  return (
    <>
      <label htmlFor="network-select-input">Network</label>
      <Select
        defaultValue={options[0]}
        theme={theme}
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
