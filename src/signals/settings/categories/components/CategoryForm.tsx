// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import type { FormEventHandler } from 'react'
import { useRef } from 'react'

import { Column, Row } from '@amsterdam/asc-ui'
import type { UseFormReturn } from 'react-hook-form'
import { Controller, FormProvider } from 'react-hook-form'

import Checkbox from 'components/Checkbox'
import Input from 'components/Input'
import RadioButtonList from 'components/RadioButtonList'
import TextArea from 'components/TextArea'
import type { History as HistoryType } from 'types/history'

import { IconChooser } from './IconChooser'
import {
  CombinedFields,
  FieldGroup,
  Form,
  FormContainer,
  StyledAlert,
  StyledColumn,
  StyledDefinitionTerm,
  StyledFormFooter,
  StyledHeading,
  StyledHistory,
  StyledLabel,
  StyledSelect,
} from './styled'
import { UploadIconExplanation } from './UploadIconExplanation'
import type { CategoryFormValues } from '../types'

interface StatusOption {
  key: string
  value: string
}

export const statusOptions: StatusOption[] = [
  { key: 'true', value: 'Actief' },
  { key: 'false', value: 'Niet actief' },
]

export interface Props {
  formMethods: UseFormReturn<CategoryFormValues>
  formValues: CategoryFormValues
  history: HistoryType[]
  onCancel: () => void
  onSubmit: FormEventHandler<HTMLFormElement>
  readOnly: boolean
  responsibleDepartments: string[]
  isMainCategory: boolean
  isPublicAccessibleLabel: string
}

export const CategoryForm = ({
  formMethods,
  formValues,
  history,
  onCancel,
  onSubmit,
  readOnly,
  responsibleDepartments,
  isMainCategory,
  isPublicAccessibleLabel,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <FormProvider {...formMethods}>
      <FormContainer>
        <Form onSubmit={onSubmit} data-testid="detail-category-form">
          <Row>
            <StyledColumn
              span={{ small: 1, medium: 2, big: 4, large: 5, xLarge: 5 }}
            >
              <div>
                <FieldGroup>
                  {!isMainCategory ? (
                    <Input
                      {...formMethods.register('name')}
                      disabled={readOnly}
                      hint="Het wijzigen van de naam heeft geen invloed op het type melding"
                      id="name"
                      label="Naam"
                      name="name"
                      readOnly={readOnly}
                      type="text"
                    />
                  ) : (
                    <>
                      <StyledDefinitionTerm>
                        <strong>Naam</strong>
                      </StyledDefinitionTerm>
                      <dd data-testid="name">{formValues.name}</dd>
                    </>
                  )}
                </FieldGroup>

                {!isMainCategory && (
                  <Controller
                    name="description"
                    render={({ field: { name, value, onChange } }) => (
                      <FieldGroup>
                        <TextArea
                          disabled={readOnly}
                          id={name}
                          label={<strong>Omschrijving</strong>}
                          name={name}
                          onChange={onChange}
                          readOnly={readOnly}
                          rows={6}
                          value={value}
                        />
                      </FieldGroup>
                    )}
                  />
                )}

                {responsibleDepartments.length > 0 && (
                  <FieldGroup as="dl">
                    <StyledDefinitionTerm>
                      <strong>Verantwoordelijke afdeling</strong>
                    </StyledDefinitionTerm>
                    <dd data-testid="responsible_departments">
                      {responsibleDepartments.join(', ')}
                    </dd>
                  </FieldGroup>
                )}

                <FieldGroup>
                  <StyledHeading>Openbaar tonen</StyledHeading>
                  <Controller
                    name="is_public_accessible"
                    control={formMethods.control}
                    render={({ field: { name, value, onChange } }) => (
                      <FieldGroup>
                        <StyledLabel
                          htmlFor={name}
                          label={isPublicAccessibleLabel}
                          data-testid="category-is-public-accessible"
                          disabled={readOnly}
                        >
                          <Checkbox
                            checked={value}
                            name={name}
                            id={name}
                            onChange={onChange}
                          />
                        </StyledLabel>
                      </FieldGroup>
                    )}
                  />
                  {isMainCategory && (
                    <Controller
                      name="show_children_in_filter"
                      control={formMethods.control}
                      render={({ field: { name, value, onChange } }) => (
                        <StyledLabel
                          htmlFor={name}
                          label="Toon alle subcategorieën in het filter op de meldingenkaart die openbaar getoond mogen worden"
                          data-testid="show_children_in_filter"
                          disabled={readOnly}
                        >
                          <Checkbox
                            checked={value}
                            name={name}
                            id={name}
                            onChange={onChange}
                          />
                        </StyledLabel>
                      )}
                    />
                  )}
                </FieldGroup>

                <Controller
                  name="icon"
                  render={({
                    field: { name, value, onChange },
                    fieldState,
                  }) => {
                    const IconButtonText = value
                      ? 'Icoon wijzigen'
                      : 'Icoon toevoegen'
                    return (
                      <FieldGroup>
                        <UploadIconExplanation />
                        <IconChooser
                          iconButtonText={IconButtonText}
                          name={name}
                          value={value}
                          onChange={onChange}
                          inputRef={inputRef}
                          $hasError={!!fieldState.error?.message}
                        />
                        {fieldState.error?.message && (
                          <StyledAlert>{fieldState.error?.message}</StyledAlert>
                        )}
                      </FieldGroup>
                    )
                  }}
                />

                {formValues.is_public_accessible && (
                  <FieldGroup>
                    <Input
                      {...formMethods.register('public_name')}
                      id="public_name"
                      label="Naam openbaar"
                      name="public_name"
                      type="text"
                      readOnly={readOnly}
                    />
                  </FieldGroup>
                )}

                {!isMainCategory && (
                  <>
                    <FieldGroup>
                      <StyledHeading>Afhandeltermijn</StyledHeading>
                      <CombinedFields>
                        <Input
                          {...formMethods.register('n_days')}
                          disabled={readOnly}
                          id="n_days"
                          name="n_days"
                          readOnly={readOnly}
                          type="number"
                          size={50}
                        />

                        <StyledSelect
                          {...formMethods.register('use_calendar_days')}
                          disabled={readOnly}
                          id="use_calendar_days"
                        >
                          <option value="1">Dagen</option>
                          <option value="0">Werkdagen</option>
                        </StyledSelect>
                      </CombinedFields>
                    </FieldGroup>

                    <Controller
                      name="handling_message"
                      render={({ field: { name, value, onChange } }) => (
                        <FieldGroup>
                          <TextArea
                            disabled={readOnly}
                            id={name}
                            label={<strong>Servicebelofte</strong>}
                            name={name}
                            onChange={onChange}
                            readOnly={readOnly}
                            rows={6}
                            value={value}
                          />
                        </FieldGroup>
                      )}
                    />

                    <Controller
                      name="is_active"
                      control={formMethods.control}
                      render={({ field: { name, value, onChange } }) => {
                        const handleOnChange = (
                          _groupName: string,
                          option: StatusOption
                        ) => {
                          /* istanbul ignore next */
                          const value = statusOptions.find(
                            (status) => status.value === option.value
                          )?.key
                          onChange(value)
                        }

                        return (
                          <FieldGroup>
                            <StyledHeading>Status</StyledHeading>
                            <RadioButtonList
                              defaultValue={value}
                              disabled={readOnly}
                              groupName={name}
                              hasEmptySelectionButton={false}
                              onChange={handleOnChange}
                              options={statusOptions}
                            />
                          </FieldGroup>
                        )
                      }}
                    />
                  </>
                )}
              </div>
            </StyledColumn>

            <StyledColumn
              span={{ small: 1, medium: 2, big: 6, large: 7, xLarge: 6 }}
            >
              <Column
                span={{ small: 1, medium: 2, big: 4, large: 5, xLarge: 5 }}
              >
                <Controller
                  name="note"
                  render={({ field: { name, value, onChange } }) => (
                    <TextArea
                      disabled={readOnly}
                      id={name}
                      label={<strong>Notitie</strong>}
                      name={name}
                      onChange={onChange}
                      readOnly={readOnly}
                      rows={6}
                      value={value}
                    />
                  )}
                />
              </Column>

              {history && <StyledHistory list={history} />}
            </StyledColumn>

            {!readOnly && (
              <StyledFormFooter
                cancelBtnLabel="Annuleer"
                onCancel={onCancel}
                submitBtnLabel="Opslaan"
              />
            )}
          </Row>
        </Form>
      </FormContainer>
    </FormProvider>
  )
}
