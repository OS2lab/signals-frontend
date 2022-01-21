// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { useMemo, useState, useLayoutEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Zoom, Map as MapComponent } from '@amsterdam/arm-core'
import styled from 'styled-components'
import { TileLayer } from '@amsterdam/react-maps'
import { useDispatch } from 'react-redux'

import ViewerContainer from 'components/ViewerContainer'
import { TYPE_LOCAL, VARIANT_NOTICE } from 'containers/Notification/constants'
import { showGlobalNotification } from 'containers/App/actions'
import configuration from 'shared/services/configuration/configuration'
import GPSButton from '../GPSButton'
import LocationMarker from '../LocationMarker'

const StyledMap = styled(MapComponent)`
  cursor: default;

  &:focus {
    outline: 5px auto Highlight !important; // Firefox outline
    outline: 5px auto -webkit-focus-ring-color !important; // Safari / Chrome outline
  }

  &.leaflet-drag-target {
    cursor: all-scroll;
  }
`

const StyledGPSButton = styled(GPSButton)`
  margin-bottom: 8px;
`

const Map = ({
  children,
  className = '',
  'data-testid': dataTestId = 'map-base',
  events,
  hasGPSControl = false,
  hasZoomControls = false,
  fullScreen = false,
  mapOptions,
  setInstance,
}) => {
  const dispatch = useDispatch()
  const [mapInstance, setMapInstance] = useState()
  const [geolocation, setGeolocation] = useState()
  const hasTouchCapabilities = 'ontouchstart' in window
  const showZoom = hasZoomControls && !hasTouchCapabilities
  const maxZoom = mapOptions.maxZoom || configuration.map.options.maxZoom
  const minZoom = mapOptions.minZoom || configuration.map.options.minZoom
  const options = useMemo(() => {
    const center = geolocation
      ? [geolocation.latitude, geolocation.longitude]
      : mapOptions.center

    return {
      maxZoom,
      minZoom,
      tap: false,
      scrollWheelZoom: false,
      center,
      ...{ ...mapOptions },
    }
  }, [mapOptions, geolocation, maxZoom, minZoom])

  useLayoutEffect(() => {
    if (!mapInstance || !geolocation || !geolocation.toggled) return

    mapInstance.flyTo([geolocation.latitude, geolocation.longitude], maxZoom, {
      animate: true,
      noMoveStart: true,
    })
  }, [geolocation, mapInstance, maxZoom])

  const captureInstance = useCallback(
    (instance) => {
      setMapInstance(instance)

      if (typeof setInstance === 'function') {
        setInstance(instance)
      }
    },
    [setInstance]
  )

  return (
    <StyledMap
      className={className}
      data-testid={dataTestId}
      data-max-zoom={maxZoom}
      data-min-zoom={minZoom}
      events={events}
      options={options}
      setInstance={captureInstance}
      fullScreen={fullScreen}
    >
      {children}

      {/* Render GPS and zoom buttons after children to maintain correct focus order */}
      <ViewerContainer
        topLeft={
          hasGPSControl &&
          global.navigator.geolocation && (
            <StyledGPSButton
              onLocationSuccess={(location) => {
                setGeolocation(location)
              }}
              onLocationError={() => {
                dispatch(
                  showGlobalNotification({
                    variant: VARIANT_NOTICE,
                    title: `${configuration.language.siteAddress} heeft geen toestemming om uw locatie te gebruiken.`,
                    message:
                      'Dit kunt u wijzigen in de voorkeuren of instellingen van uw browser of systeem.',
                    type: TYPE_LOCAL,
                  })
                )
              }}
              onLocationOutOfBounds={() => {
                dispatch(
                  showGlobalNotification({
                    variant: VARIANT_NOTICE,
                    title:
                      'Uw locatie valt buiten de kaart en is daardoor niet te zien',
                    type: TYPE_LOCAL,
                  })
                )
              }}
            />
          )
        }
        bottomRight={
          showZoom && (
            <div data-testid="mapZoom">
              <Zoom />
            </div>
          )
        }
      />

      {geolocation?.toggled && <LocationMarker geolocation={geolocation} />}

      <TileLayer
        args={configuration.map.tiles.args}
        options={configuration.map.tiles.options}
      />
    </StyledMap>
  )
}

Map.defaultProps = {
  children: null,
  events: undefined,
  setInstance: undefined,
}

Map.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  /** @ignore */
  className: PropTypes.string,
  'data-testid': PropTypes.string,
  /**
   * Map events
   * @see {@link https://leafletjs.com/reference-1.6.0.html#map-event}
   */
  events: PropTypes.shape({}),
  hasGPSControl: PropTypes.bool,
  hasZoomControls: PropTypes.bool,
  /**
   * Leaflet configuration options
   * @see {@link https://leafletjs.com/reference-1.6.0.html#map-option}
   */
  mapOptions: PropTypes.shape({
    attributionControl: PropTypes.bool,
    center: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.number),
      PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired,
      }),
    ]),
    maxZoom: PropTypes.number,
    minZoom: PropTypes.number,
  }).isRequired,
  fullScreen: PropTypes.bool,
  /**
   * useState function that sets a reference to the map instance
   */
  setInstance: PropTypes.func,
}

export default Map
