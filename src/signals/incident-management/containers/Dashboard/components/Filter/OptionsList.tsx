// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { Dispatch, SetStateAction } from 'react'
import { useContext, useEffect } from 'react'

import { useFormContext } from 'react-hook-form'

import { Option } from './Option'
import { OptionUl } from './styled'
import type { Filter } from './types'
import IncidentManagementContext from '../../../../context'
import { StyledLoadingIndicator } from '../../../IncidentDetail/components/Attachments/styles'
import { useRoveFocus } from '../../hooks/useRoveFocus'

type Props = {
  setFilterNameActive: Dispatch<SetStateAction<string>>
  activeFilter: Filter
  optionsOffsetLeft?: number
}

const OptionsList = ({
  setFilterNameActive,
  activeFilter,
  optionsOffsetLeft,
}: Props) => {
  const { currentFocus, setCurrentFocus } = useRoveFocus(
    activeFilter.options.length
  )

  const { departmentsWithResponsibleCategories } = useContext(
    IncidentManagementContext
  )

  const { getValues } = useFormContext()

  useEffect(() => {
    const index = activeFilter.options.findIndex(
      (option) => option.value === getValues(activeFilter.name)?.value
    )
    index > -1 && setCurrentFocus(index)
  }, [activeFilter, getValues, setCurrentFocus])

  if (
    ['category', 'department'].includes(activeFilter.name) &&
    departmentsWithResponsibleCategories?.isLoading
  ) {
    return <StyledLoadingIndicator />
  }

  return (
    <OptionUl
      role="listbox"
      optionsOffsetLeft={optionsOffsetLeft}
      optionsTotal={activeFilter.options.length}
    >
      {activeFilter.options.map((option, index) => (
        <Option
          key={index}
          focus={currentFocus}
          setFocus={setCurrentFocus}
          activeFilter={activeFilter}
          option={option}
          index={index}
          setFilterNameActive={setFilterNameActive}
        />
      ))}
    </OptionUl>
  )
}

export default OptionsList
