import * as React from 'react'
import Select, { Props } from 'react-select'
import { CSSObject } from '@emotion/serialize'

const StyledSelect: React.FC<Props> = (props) => {
  const customStyles: Props['styles'] = {
    control: (provided: CSSObject, state: any) => ({
      ...provided,
      borderRadius: 0,
      background: 'rgba(217, 212, 173, 0.01)',
      borderColor: state.isFocused ? 'rgba(217, 212, 173, 1)' : 'white',
      boxShadow: 'none',
      cursor: 'pointer',
      '&:hover': {
        borderColor: 'rgba(217, 212, 173, 1)',
      },
    }),
    input: (provided: CSSObject) => ({
      ...provided,
      color: 'white',
      fontSize: '0.85em',
    }),
    option: (provided: CSSObject, state: any) => ({
      ...provided,
      background: state.isSelected ? 'rgba(217, 212, 173, 0.5)' : 'none',
      color: 'white',
      cursor: 'pointer',
      '&:hover': {
        background: 'rgba(217, 212, 173, 0.2)',
      },
    }),
    menu: (provided: CSSObject) => ({
      ...provided,
      zIndex: 10,
      borderRadius: 0,
      background: 'black',
    }),
    singleValue: (provided: CSSObject) => ({
      ...provided,
      color: 'white',
    }),
  }

  return <Select {...props} styles={customStyles} />
}

export default StyledSelect
