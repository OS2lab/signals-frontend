// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam

import MAP_OPTIONS from 'shared/services/configuration/map-options'
import type { FeatureCollection } from 'geojson'
import type { LatLngTuple } from 'leaflet'
import type { Bbox } from 'signals/incident/components/form/MapSelectors/hooks/useBoundingBox'

import { useEffect, useState } from 'react'
import { useFetch } from 'hooks'
import configuration from 'shared/services/configuration/configuration'
import { ViewerContainer } from '@amsterdam/arm-core'
import { MapMessage } from 'signals/incident/components/form/MapSelectors/components/MapMessage'

import { IncidentLayer } from '../IncidentLayer'
import { FilterPanel } from '../FilterPanel'
import type { Filter } from '../FilterPanel'

import { Wrapper, Container, StyledMap } from './styled'

export type Point = {
  type: 'Point'
  coordinates: LatLngTuple
}

export type Properties = {
  category: {
    name: string
  }
  created_at: string
}

export const IncidentMap = () => {
  const [bbox, setBbox] = useState<Bbox | undefined>(undefined)
  const [mapMessage, setMapMessage] = useState<string>('')
  const [filters, setFilters] = useState<Filter[]>([])
  const [showIncidentLayer, setShowIncidentLayer] = useState<boolean>(true)
  const [showPanel, setShowPanel] = useState<boolean>(true)
  const { get, data, error } = useFetch<FeatureCollection<Point, Properties>>()

  useEffect(() => {
    if (!bbox) return

    const { west, south, east, north } = bbox
    const searchParams = new URLSearchParams({
      bbox: `${west},${south},${east},${north}`,
    })

    get(`${configuration.GEOGRAPHY_PUBLIC_ENDPOINT}?${searchParams.toString()}`)

    setShowIncidentLayer(true)
  }, [get, bbox, setShowIncidentLayer])

  useEffect(() => {
    /**
     * TODO: Filter data based on selected filters
     * and pass them to the incident layer
     */
  }, [data])

  useEffect(() => {
    if (error) {
      setMapMessage('Er konden geen meldingen worden opgehaald.')
      return
    }
  }, [error])

  useEffect(() => {
    window.dispatchEvent(new Event('resize'))
  }, [showPanel])

  return (
    <Wrapper>
      <Container>
        <StyledMap
          data-testid="incidentMap"
          hasZoomControls
          fullScreen
          mapOptions={{ ...MAP_OPTIONS, zoom: 9, attributionControl: false }}
        >
          {showIncidentLayer && (
            <IncidentLayer passBbox={setBbox} incidents={data?.features} />
          )}

          <FilterPanel
            isOpen={showPanel}
            filters={filters}
            setFilters={setFilters}
            setShowPanel={setShowPanel}
            setMapMessage={setMapMessage}
          />

          {mapMessage && (
            <ViewerContainer
              topLeft={
                <MapMessage onClick={() => setMapMessage('')}>
                  {mapMessage}
                </MapMessage>
              }
            />
          )}
        </StyledMap>
      </Container>
    </Wrapper>
  )
}

export default IncidentMap
