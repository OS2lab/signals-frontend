// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import L from 'leaflet'
import './style.css'

import type { FC } from 'react'
import type {
  Feature,
  FeatureType,
} from 'signals/incident/components/form/MapSelectors/types'
import { Marker } from '@amsterdam/arm-core'
import { featureToCoordinates } from 'shared/services/map-location'
import type { Geometrie } from 'types/incident'
import reportedIconUrl from 'shared/images/icon-reported-marker.svg?url'
import checkedIconUrl from 'shared/images/icon-checked-marker.svg?url'

const STATUS_CLASS_MODIFIER = 'marker-status'

export interface StatusLayerProps {
  statusFeatures: Feature[]
  reportedFeatureType: FeatureType
  checkedFeatureType: FeatureType
}

const StatusLayer: FC<StatusLayerProps> = ({
  statusFeatures,
  reportedFeatureType,
  checkedFeatureType,
}) => {
  const getMarker = (feat: any, index: number) => {
    const feature = feat as Feature
    const latLng = featureToCoordinates(feature?.geometry as Geometrie)

    if (!feature || !reportedFeatureType || !checkedFeatureType) return

    const isReported = Boolean(
      reportedFeatureType.statusField && reportedFeatureType.statusValues?.includes(
        feature.properties[reportedFeatureType.statusField]
      )
    )


    const icon = L.icon({
      iconSize: [20, 20],
      iconUrl: isReported ? reportedIconUrl: checkedIconUrl,
      className: STATUS_CLASS_MODIFIER,
    })

    const featureId = feature.properties[reportedFeatureType.idField] || index
    const altText = isReported ? `Is gemeld - ${featureId}` : `Is opgelost - ${featureId}`

    return (
      <Marker
        key={featureId}
        latLng={latLng}
        options={{
          zIndexOffset: 1000,
          icon,
          alt: altText,
        }}
      />
    )
  }
  return <>{statusFeatures.map(getMarker)}</>
}

export default StatusLayer
