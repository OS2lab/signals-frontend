// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import type { FunctionComponent } from 'react'
import { Fragment } from 'react'
import styled from 'styled-components'
import { themeSpacing, themeColor } from '@amsterdam/asc-ui'
import Label from 'components/Label'
import ErrorMessage, { ErrorWrapper } from 'components/ErrorMessage'
import type {
  ReactiveFormMeta,
  FormMeta,
  FormOptions,
} from 'types/reactive-form'

const StyledErrorWrapper = styled(ErrorWrapper)<{ invalid: boolean }>`
  display: flex;
  flex-direction: column;

  & > :last-child:not(& > :first-child) {
    margin-top: ${themeSpacing(3)};
  }
`

const StyledLabel = styled(Label)`
  width: 100%;
  margin-bottom: 0;
`

const FieldSet = styled.fieldset`
  border: 0;
  padding: 0;
  margin-bottom: 0;

  & > :last-child {
    margin-top: ${themeSpacing(3)};
  }
`

const Optional = styled.span`
  font-weight: 400;
  margin-left: ${themeSpacing(2)};
  font-weight: 400;
`

const SubTitle = styled.p`
  color: ${themeColor('tint', 'level5')};
  margin-top: 0;
  margin-bottom: 0;
`

const InputWrapper = styled.div<{ width?: string }>`
  width: ${({ width }) => width || '100%'};
`

type PickedProps = 'touched' | 'hasError' | 'getError'
export interface FormFieldProps extends Pick<ReactiveFormMeta, PickedProps> {
  className?: string
  meta: FormMeta
  options?: FormOptions
  isFieldSet?: boolean
}

const FormField: FunctionComponent<FormFieldProps> = ({
  isFieldSet,
  className,
  meta,
  options,
  touched,
  hasError,
  getError,
  children,
}) => {
  const containsErrors: boolean =
    touched &&
    (hasError('required') ||
      hasError('email') ||
      hasError('maxLength') ||
      hasError('custom'))
  const isOptional = !options?.validators?.some(
    (validator) => validator.name === 'required'
  )
  const FieldSetWrapper = isFieldSet ? FieldSet : Fragment

  const requiredError =
    getError('required') === true
      ? 'Dit is een verplicht veld'
      : (getError('required') as string)

  return (
    <StyledErrorWrapper className={className} invalid={containsErrors}>
      <FieldSetWrapper>
        {meta?.label && (
          <StyledLabel
            {...(isFieldSet ? { as: 'legend' } : { htmlFor: meta.name })}
          >
            <>
              {meta.label}
              {isOptional && <Optional>(niet verplicht)</Optional>}
            </>
          </StyledLabel>
        )}

        {meta?.subtitle && (
          <SubTitle id={`subtitle-${meta.name}`}>{meta.subtitle}</SubTitle>
        )}
        <div role="status">
          <ErrorMessage
            data-testid={`${meta.name}-required`}
            message={touched && hasError('required') ? requiredError : ''}
          />

          <ErrorMessage
            data-testid="invalid-mail"
            message={
              hasError('email')
                ? 'Vul een geldig e-mailadres in, met een @ en een domeinnaam. Bijvoorbeeld: naam@domein.nl'
                : ''
            }
          />

          <ErrorMessage
            data-testid="maxLengthError"
            message={
              hasError('maxLength')
                ? `U heeft meer dan de maximale ${String(
                    (getError('maxLength') as { requiredLength: number })
                      .requiredLength
                  )} tekens ingevoerd`
                : ''
            }
          />

          <ErrorMessage
            data-testid="customError"
            message={hasError('custom') ? getError('custom') : ''}
          />
        </div>
        <InputWrapper width={meta?.width}>{children}</InputWrapper>
      </FieldSetWrapper>
    </StyledErrorWrapper>
  )
}

export default FormField
