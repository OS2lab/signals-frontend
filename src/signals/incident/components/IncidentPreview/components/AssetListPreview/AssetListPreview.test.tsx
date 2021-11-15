// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { render } from '@testing-library/react'
import AssetList from 'signals/incident/components/form/MapSelectors/Asset/AssetList'
import type { FeatureType } from 'signals/incident/components/form/MapSelectors/Container/types'

import AssetListPreview from './AssetListPreview'
import type { AssetListPreviewProps } from './AssetListPreview'

jest.mock('signals/incident/components/form/MapSelectors/Asset/AssetList', () =>
  jest.fn().mockImplementation(() => null)
)

describe('AssetListPreview', () => {
  it('should render AssetList with props', () => {
    const props: AssetListPreviewProps = {
      value: [{ id: 'id', type: 'type', description: 'description' }],
      featureTypes: [
        {
          typeField: 'type',
          typeValue: 'type',
          icon: {
            iconSvg: 'svg',
          },
        } as FeatureType,
      ],
    }

    render(
      <AssetListPreview value={props.value} featureTypes={props.featureTypes} />
    )
    expect(AssetList).toHaveBeenCalledWith(
      expect.objectContaining({
        selection: props.value,
        featureTypes: props.featureTypes,
      }),
      {}
    )
  })
})