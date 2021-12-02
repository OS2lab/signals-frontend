// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { FunctionComponent } from 'react'
import { createContext } from 'react'
import { SelectValue } from '../types'

export const initialValue: SelectValue = {
  selection: [],
  location: [0, 0],
  meta: {
    name: '',
    endpoint: '',
    featureTypes: [],
    wfsFilter: '',
    icons: [],
    extraProperties: [],
  },
  message: undefined,
  update: /* istanbul ignore next */ () => {},
  edit: /* istanbul ignore next */ () => {},
  close: /* istanbul ignore next */ () => {},
  setMessage: /* istanbul ignore next */ () => {},
}

const SelectContext = createContext(initialValue)

interface SelectProviderProps {
  value: SelectValue
}

export const SelectProvider: FunctionComponent<SelectProviderProps> = ({
  value,
  children,
}) => <SelectContext.Provider value={value}>{children}</SelectContext.Provider>

export default SelectContext
