// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { FunctionComponent } from 'react'
import { List, themeSpacing, ListItem } from '@amsterdam/asc-ui'
import styled from 'styled-components'

const StyledListItem = styled(ListItem)`
  display: flex;
  align-items: center;
`

const StyledImg = styled.img`
  margin-right: ${themeSpacing(2)};
  flex-shrink: 0;
`

const StatusIcon = styled.img`
  margin-left: -20px;
  margin-top: -30px;
`

export interface IconListItemProps {
  iconUrl?: string
  id?: string
  className?: string
  iconSize?: number
  isChecked?: boolean
  isReported?: boolean
}

export const IconListItem: FunctionComponent<IconListItemProps> = ({
  iconUrl,
  children,
  className,
  iconSize = 40,
  id,
  isChecked,
  isReported,
}) => (
  <StyledListItem data-testid={id} className={className}>
    {iconUrl && (
      <StyledImg alt="" height={iconSize} src={iconUrl} width={iconSize} />
    )}
    {isChecked && (
      <StatusIcon
        alt=""
        height={20}
        src="/assets/images/icon-checked-marker.svg"
        width={20}
      />
    )}
    {!isChecked && isReported && (
      <StatusIcon
        alt=""
        height={20}
        src="/assets/images/icon-reported-marker.svg"
        width={20}
      />
    )}
    {children}
  </StyledListItem>
)

export default List
