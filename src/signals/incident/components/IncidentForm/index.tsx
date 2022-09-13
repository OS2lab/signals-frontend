// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
// eslint-disable-next-line no-restricted-imports
import type { BaseSyntheticEvent, ForwardedRef } from 'react'
import { useState, useRef, useEffect, useCallback, forwardRef } from 'react'

import isEqual from 'lodash/isEqual'
import { Controller } from 'react-hook-form'

import formatConditionalForm from '../../services/format-conditional-form'
import constructYupResolver from '../../services/yup-resolver'
import { Form, Fieldset, ProgressContainer } from './styled'

const IncidentForm = forwardRef<any, any>(
  (
    {
      incidentContainer,
      reactHookFormProps,
      updateIncident,
      createIncident,
      wizard,
      addToSelection,
      removeFromSelection,
      getClassification,
      fieldConfig,
    },
    controlsRef: ForwardedRef<any>
  ) => {
    const [submitting, setSubmitting] = useState(false)
    /**
     *   When refactoring react-albus, remove this state. Currently its needed to set next to trigger
     *   onNext's method of react albus.
     */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const [, setNext] = useState(null)

    const prevState = useRef<{ isMounted: boolean; loading: boolean }>({
      isMounted: true,
      loading: false,
    })

    useEffect(() => {
      return () => {
        prevState.current.isMounted = false
      }
    }, [])

    useEffect(() => {
      if (prevState.current.loading !== incidentContainer.loadingData) {
        prevState.current.loading = incidentContainer.loadingData
      }
    }, [prevState.current.loading, incidentContainer.loadingData])

    /**
     * setValues makes sure values from the incident, like dateTime, are added
     * to react hook form.
     */
    const setValues = useCallback(
      (incident) => {
        Object.entries(reactHookFormProps.getValues()).map(([key, value]) => {
          if (!isEqual(incident[key], value)) {
            reactHookFormProps.setValue(key, incident[key])
          }
        })
      },
      [reactHookFormProps]
    )

    useEffect(() => {
      if (!reactHookFormProps.getValues()) return
      setValues(incidentContainer.incident)
    }, [incidentContainer.incident, reactHookFormProps, setValues])

    const setIncident = useCallback(
      (formAction) => {
        switch (
          formAction // eslint-disable-line default-case
        ) {
          case 'UPDATE_INCIDENT':
            updateIncident(reactHookFormProps.getValues())
            break

          case 'CREATE_INCIDENT':
            createIncident({
              incident: incidentContainer.incident,
              wizard,
            })
            break

          default:
        }
      },
      [
        createIncident,
        incidentContainer.incident,
        reactHookFormProps,
        updateIncident,
        wizard,
      ]
    )

    const handleSubmit = useCallback(
      async (e, next, formAction) => {
        e.preventDefault()
        if (next) {
          if (prevState.current.loading) {
            /**
            Next needs to be part of the local state to rerender.
            When Sia will phase out react albus, this needs to be removed
          */
            setNext(next)
            return
          }

          if (!submitting) {
            setSubmitting(true)
          }
          /**
           * Trigger the form before before calling handle submit,
           * to make sure useForm takes the latest yupResolver defined right
           * above the return jsx statement.
           */
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          await reactHookFormProps.trigger()
          reactHookFormProps.handleSubmit(() => {
            /**
            To prevent memory leaks, make sure to call the functions at
            the button only when this component is mounted.
          */
            if (prevState.current.isMounted) {
              setIncident(formAction)
              setSubmitting(false)
              next()
            }
          })()
        }
      },
      [
        reactHookFormProps,
        setIncident,
        submitting,
        reactHookFormProps.formState,
      ]
    )

    /**
    FormatConditionalForm mutates fieldconfig, thereby setting fields visible/inVisible.
    This should be changed in the future.
  */
    const fieldConfigModified = formatConditionalForm(
      fieldConfig,
      incidentContainer.incident
    )
    const isSummary =
      fieldConfigModified &&
      Object.keys(fieldConfigModified).includes('page_summary')

    const parent = {
      meta: {
        wizard,
        incidentContainer,
        handleSubmit,
        getClassification,
        updateIncident,
        addToSelection,
        removeFromSelection,
      },
    }

    const getControls = (controls: any) =>
      Object.fromEntries(
        Object.entries(controls).filter(
          ([key, value]: any) => value.meta?.isVisible || key === '$field_0'
        )
      )

    const controls: any = getControls(fieldConfigModified.controls)

    /**
    Set the yupresolver for the current step of the incident wizard
  */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    controlsRef.current = constructYupResolver(controls)

    return (
      <div data-testid="incidentForm">
        <ProgressContainer />
        <Form>
          <Fieldset isSummary={isSummary}>
            {Object.entries(controls).map(([key, value]: any) => {
              return (
                (value.render && parent && reactHookFormProps?.control && (
                  <Controller
                    key={key}
                    name={value.meta?.name || 'hidden'}
                    control={reactHookFormProps.control}
                    defaultValue={null}
                    render={({ field: { value: v, onChange } }) => {
                      return (
                        <value.render
                          parent={parent}
                          handler={() => ({
                            onChange: (e: BaseSyntheticEvent) => {
                              value.meta && onChange(e.target.value)
                            },
                            onBlur: (e: BaseSyntheticEvent) => {
                              value.meta && onChange(e.target.value)
                              if (submitting) {
                                reactHookFormProps.trigger()
                              }
                            },
                            value: v || '',
                          })}
                          getError={() => {
                            return reactHookFormProps.formState?.errors[key]
                              ?.message
                          }}
                          meta={value.meta || parent.meta}
                          hasError={(errorCode: any) => {
                            return (
                              errorCode ===
                              reactHookFormProps.formState?.errors[key]?.type
                            )
                          }}
                          value={v}
                          validatorsOrOpts={value.options}
                        />
                      )
                    }}
                  />
                )) ||
                null
              )
            })}
          </Fieldset>
        </Form>
      </div>
    )
  }
)

export default IncidentForm