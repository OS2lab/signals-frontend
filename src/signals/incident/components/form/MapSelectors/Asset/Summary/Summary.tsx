// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { useContext, useCallback } from 'react'
import styled from 'styled-components'
import { Link, themeSpacing } from '@amsterdam/asc-ui'

import type { FC, KeyboardEvent } from 'react'

import MapStatic from 'components/MapStatic'

import AssetSelectContext from 'signals/incident/components/form/MapSelectors/Asset/context'
import { formatAddress } from 'shared/services/format-address'

const mapWidth = 640
const mapHeight = 180

const Wrapper = styled.div`
  position: relative;
  margin: ${themeSpacing(0, 0, 0, 0)};
`

const StyledLink = styled(Link)`
  text-decoration: underline;
  font-size: 16px;
  cursor: pointer;
`

const StyledMapStatic = styled(MapStatic)`
  margin: ${themeSpacing(0, 0, 2, 0)};
`

const Summary: FC = () => {
  const { address, coordinates, selection, edit, meta } =
    useContext(AssetSelectContext)
  const { id, type } = selection || {}
  const { description } =
    meta.featureTypes.find(({ typeValue }) => typeValue === type) ?? {}

  const summaryDescription = `${description}${id ? ` - ${id}` : ''}`
  let summaryAddress = coordinates ? 'Locatie is gepind op de kaart' : ''
  if (address) summaryAddress = formatAddress(address)

  const onKeyUp = useCallback(
    (event: KeyboardEvent<HTMLAnchorElement>) => {
      if (event?.key === 'Enter') {
        edit(event)
      }
    },
    [edit]
  )

  return (
    <Wrapper data-testid="assetSelectSummary">
      {coordinates && (
        <StyledMapStatic
          height={mapHeight}
          width={mapWidth}
          lat={coordinates.lat}
          lng={coordinates.lng}
        />
      )}

      {selection && (
        <div data-testid="assetSelectSummaryDescription">
          {summaryDescription}
        </div>
      )}
      <div data-testid="assetSelectSummaryAddress">{summaryAddress}</div>
      <StyledLink
        onClick={edit}
        onKeyUp={onKeyUp}
        variant="inline"
        tabIndex={0}
      >
        Wijzigen
      </StyledLink>
    </Wrapper>
  )
}

export default Summary
