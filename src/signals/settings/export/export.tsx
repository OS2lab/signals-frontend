import { Button, Column, ErrorMessage, Label, Row } from '@amsterdam/asc-ui'
import PageHeader from 'signals/settings/components/PageHeader'
import { Fragment, useCallback, useEffect } from 'react'
import { useFetch } from 'hooks'

const EXPORT_URL = 'http://localhost:8000/signals/v1/private/csv'

const ExportContainer = () => {
  const { get, data, error, isLoading } = useFetch<Blob>()

  const download = useCallback(() => {
    get(EXPORT_URL, {}, { responseType: 'blob' })
  }, [get])

  useEffect(() => {
    if (data) {
      window.location.assign(window.URL.createObjectURL(data))
    }
  }, [data])

  return (
    <Fragment>
      <PageHeader title="Export" />
      <Row>
        <Column span={12} wrap>
          <Button variant="primary" onClick={download} disabled={isLoading}>
            Download export
          </Button>
        </Column>
      </Row>
      <Row>
        <Column span={12} wrap>
          {isLoading && <Label label="Downloading..." />}
          {error && (
            <ErrorMessage
              message={`Er ging iets mis: ${(error as any).name} ${
                (error as any).message
              }`}
            />
          )}
        </Column>
      </Row>
    </Fragment>
  )
}

export default ExportContainer
