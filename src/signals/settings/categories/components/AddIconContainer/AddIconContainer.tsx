// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam

import { Fragment, useState } from 'react'

import { FileInput } from './FileInput'
import {
  InvisibleButton,
  StyledImg,
  StyledInfo,
  StyledInstructions,
  WrapperInfo,
} from './styled'
import { StyledHeading } from '../styled'

export interface Props {
  updateErrorUploadIcon: (arg: boolean) => void
}
export const AddIconContainer = ({ updateErrorUploadIcon }: Props) => {
  const [showSubsection, setShowSubsection] = useState<boolean>(true)

  const icon = '/assets/images/afval/rest.svg'
  const iconChevronDownBlue = '/assets/images/chevron-down-blue.svg'
  return (
    <Fragment>
      <StyledHeading>Icoon</StyledHeading>
      <WrapperInfo>
        <StyledInfo>
          Het icoon wordt getoond op de openbare meldingenkaart
        </StyledInfo>

        <InvisibleButton
          title={`Toon ${showSubsection ? 'minder' : 'meer'} filter opties`}
          aria-expanded={showSubsection}
          toggle={showSubsection}
          onClick={(event) => {
            event.preventDefault()
            setShowSubsection(!showSubsection)
          }}
        >
          <StyledImg alt={'icon chevrondown blue'} src={iconChevronDownBlue} />
        </InvisibleButton>
      </WrapperInfo>
      {showSubsection && (
        <>
          <StyledInstructions>
            Zorg voor een circel van 32px bij 32px en exporteer als SVG.
          </StyledInstructions>
          <StyledInstructions>Voorbeeld van een icoon:</StyledInstructions>
          <StyledImg alt={'example of an icon'} src={icon} />
        </>
      )}
      <FileInput updateErrorUploadIcon={updateErrorUploadIcon} />
    </Fragment>
  )
}
