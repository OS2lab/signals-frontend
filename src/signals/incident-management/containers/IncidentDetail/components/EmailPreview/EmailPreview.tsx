// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 - 2023 Gemeente Amsterdam, Vereniging van Nederlandse Gemeenten
import LoadingIndicator from 'components/LoadingIndicator'
import ModalDialog from 'components/ModelDialog/ModalDialog'

import { StyledFormFooter, StyledIframe, styling } from './styled'

interface EmailPreviewProps {
  onClose: () => void
  onUpdate: () => void
  title: string
  isLoading: boolean
  emailBody?: string
}

export const fontSrc =
  '<link rel="stylesheet" href="https://static.amsterdam.nl/fonts/fonts.css"/>'
const EmailPreview = ({
  emailBody,
  onUpdate,
  onClose,
  title,
  isLoading,
}: EmailPreviewProps) => {
  const styledHtml = emailBody?.replace(
    '</head>',
    `${fontSrc}${styling}</head>`
  )

  return (
    <ModalDialog
      data-testid="email-preview-modal"
      title={title}
      onClose={onClose}
      isConfirmation={false}
    >
      {isLoading && <LoadingIndicator />}
      {emailBody && (
        <>
          <StyledIframe data-testid="email-body-iframe" srcDoc={styledHtml} />
          <StyledFormFooter
            cancelBtnLabel="Wijzig"
            onCancel={onClose}
            submitBtnLabel="Verstuur"
            onSubmitForm={onUpdate}
          />
        </>
      )}
    </ModalDialog>
  )
}

export default EmailPreview
