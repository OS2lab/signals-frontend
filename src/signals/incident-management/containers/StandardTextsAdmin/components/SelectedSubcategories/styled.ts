// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import ErrorMessage from 'components/ErrorMessage'

export const StyledErrorMessage = styled(ErrorMessage)`
  margin-bottom: ${themeSpacing(2)};
`
