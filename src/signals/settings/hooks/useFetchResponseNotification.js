// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import { useCallback, useEffect } from 'react'

import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { showGlobalNotification } from 'containers/App/actions'
import {
  TYPE_LOCAL,
  VARIANT_ERROR,
  VARIANT_SUCCESS,
} from 'containers/Notification/constants'
// eslint-disable-next-line no-unused-vars
import { State } from 'hooks/useFetch'

/**
 * Custom hook useConfirmedCancel
 *
 * Will take a URL and can be used as onCancel callback for forms
 *
 * @param {Object} options
 * @param {String} options.entityName - Name by which the stored/patched data should be labeled (eg. 'Afdeling')
 * @param {State['error']} options.error - Exception object
 * @param {Boolean} options.isLoading - Flag indicating if data is still loading
 * @param {State['error']} options.isSuccess - Flag indicating if data has been stored/patched successfully
 * @param {String} options.redirectURL - URL to which the push should be directed when isSuccess is truthy
 * @returns {void}
 */
const useFetchResponseNotification = ({
  entityName,
  error,
  isLoading,
  isSuccess,
  redirectURL,
}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const showNotification = useCallback(
    (variant, title) =>
      dispatch(
        showGlobalNotification({
          variant,
          title,
          type: TYPE_LOCAL,
        })
      ),
    [dispatch]
  )

  useEffect(() => {
    if (isLoading || !(error || isSuccess)) return

    let message
    let variant = VARIANT_SUCCESS

    if (error) {
      ;({ message } = error)
      variant = VARIANT_ERROR
    }

    if (isSuccess) {
      const entityLabel = entityName || 'Gegevens'
      message = `${entityLabel} bijgewerkt`
    }

    showNotification(variant, message)
  }, [entityName, error, isLoading, isSuccess, showNotification])

  useEffect(() => {
    if (isLoading) return

    if (isSuccess && redirectURL) {
      navigate(redirectURL)
    }
  }, [navigate, isSuccess, redirectURL, isLoading])
}

export default useFetchResponseNotification
