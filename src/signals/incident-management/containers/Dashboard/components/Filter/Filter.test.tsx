// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as reactRouterDom from 'react-router-dom'

import departmentsCategoriesFixture from 'utils/__tests__/fixtures/departmentsCategories.json'

import { Filter } from './Filter'
import history from '../../../../../../utils/history'
import { IncidentManagementProvider } from '../../../../provider'

const mockSetQueryString = jest.fn()

window.HTMLElement.prototype.scrollIntoView = jest.fn()

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/',
    referrer: '/manage/incidents',
  }),
}))

jest.mock('../../hooks/useDepartments')

const mockDashboardFilter = {
  status: {
    display: '',
    value: '',
  },
  department: {
    display: '',
    value: '',
  },
  category_slug: {
    display: '',
    value: '',
  },
  priority: {
    display: 'Hoge urgentie',
    value: 'high',
  },
  punctuality: {
    display: '',
    value: '',
  },
  stadsdeel: {
    display: '',
    value: '',
  },
}

const mockSetDashboardFilter = jest.fn()
const renderWithContext = (
  dashboardFilter = null,
  isLoading = false,
  departmentsCustom?: any
) => (
  <IncidentManagementProvider
    value={{
      setDashboardFilter: mockSetDashboardFilter,
      dashboardFilter,
      departmentsWithResponsibleCategories: {
        departments: departmentsCustom || departmentsCategoriesFixture,
        isLoading,
      },
    }}
  >
    <Filter setQueryString={mockSetQueryString} />
  </IncidentManagementProvider>
)

describe('FilterComponent', () => {
  beforeEach(() => {
    mockSetQueryString.mockReset()
  })

  it('should render properly and select the first option', () => {
    render(renderWithContext())

    expect(
      screen.queryByRole('combobox', {
        name: 'Parkeren',
      })
    ).not.toBeInTheDocument()

    expect(
      screen.getByRole('combobox', { name: 'Actie Service Centr...' })
    ).toBeInTheDocument()
  })

  it('should clear filterActiveName when clicking outside Filter', () => {
    render(
      <>
        <button>outside filter</button>
        {renderWithContext()}
      </>
    )

    userEvent.click(
      screen.getByRole('combobox', {
        name: 'Actie Service Centr...',
      })
    )

    userEvent.click(
      screen.getByRole('button', {
        name: 'outside filter',
      })
    )

    expect(
      screen.queryByRole('option', { name: 'Amsterdamse Bos' })
    ).not.toBeInTheDocument()
  })

  it('should select a department and thus change selectable categories', () => {
    render(renderWithContext())

    expect(
      screen.getByRole('combobox', {
        name: 'Actie Service Centr...',
      })
    ).toBeInTheDocument()

    userEvent.click(
      screen.getByRole('combobox', {
        name: 'Categorie',
      })
    )

    expect(
      screen.queryByRole('option', { name: 'Grofvuil' })
    ).toBeInTheDocument()

    userEvent.click(
      screen.getByRole('combobox', {
        name: 'Actie Service Centr...',
      })
    )

    userEvent.click(
      screen.getByRole('option', {
        name: 'Parkeren',
      })
    )

    expect(
      screen.queryByRole('combobox', { name: 'Grofvuil' })
    ).not.toBeInTheDocument()

    expect(
      screen.queryByRole('combobox', { name: 'Categorie' })
    ).toBeInTheDocument()
  })

  it('should select a department and reset form by using keyboard', () => {
    render(renderWithContext())

    expect(
      screen.getByRole('combobox', {
        name: 'Actie Service Centr...',
      })
    ).toBeInTheDocument()

    screen
      .getByRole('combobox', {
        name: 'Categorie',
      })
      .focus()

    act(() => {
      fireEvent.keyDown(
        screen.getByRole('combobox', {
          name: 'Categorie',
        }),
        { code: 'Space' }
      )
    })

    screen
      .getByRole('option', {
        name: 'Grofvuil',
      })
      .focus()

    expect(
      screen.getByRole('option', {
        name: 'Grofvuil',
      })
    ).toBeInTheDocument()

    act(() => {
      fireEvent.keyDown(
        screen.getByRole('option', {
          name: 'Grofvuil',
        }),
        { code: 'Space' }
      )
    })

    expect(
      screen.getByRole('combobox', {
        name: 'Grofvuil',
      })
    ).toBeInTheDocument()

    screen
      .getByRole('button', {
        name: 'Wis filters',
      })
      .focus()

    act(() => {
      fireEvent.keyDown(
        screen.getByRole('button', {
          name: 'Wis filters',
        }),
        { code: 'Space' }
      )
    })

    expect(
      screen.queryByRole('combobox', {
        name: 'Grofvuil',
      })
    ).not.toBeInTheDocument()
  })

  it('should select a department, a custom category and reset back and call setQueryString each time', () => {
    render(renderWithContext())

    expect(mockSetQueryString).toBeCalledTimes(1)

    userEvent.click(
      screen.getByRole('combobox', {
        name: 'Actie Service Centr...',
      })
    )

    userEvent.click(
      screen.getByRole('option', {
        name: 'Afval en Grondstoffen',
      })
    )

    expect(mockSetQueryString).toBeCalledTimes(2)

    // Department is not a filter for the endpoint
    expect(mockSetQueryString).toBeCalledWith('')

    userEvent.click(
      screen.getByRole('combobox', {
        name: 'Categorie',
      })
    )

    userEvent.click(
      screen.getByRole('option', {
        name: 'Huisafval',
      })
    )

    expect(mockSetQueryString).toBeCalledWith('category_slug=huisafval')

    expect(mockSetQueryString).toBeCalledTimes(3)

    userEvent.click(screen.getByText('Wis filters'))

    expect(mockSetQueryString).toBeCalledTimes(4)
    expect(mockSetQueryString).toBeCalledWith('')
  })

  it('should hide department button when there is only one', () => {
    const { rerender } = render(
      renderWithContext(null, false, [departmentsCategoriesFixture[0]])
    )

    expect(
      screen.queryByRole('combobox', {
        name: 'Actie Service Centr...',
      })
    ).not.toBeInTheDocument()

    rerender(renderWithContext())

    expect(
      screen.queryByRole('combobox', {
        name: 'Actie Service Centr...',
      })
    ).toBeInTheDocument()
  })

  it('should tab over the comboboxes back and forth, select an option and return to last focussed combobox again', () => {
    render(renderWithContext())

    screen
      .queryByRole('combobox', {
        name: 'Actie Service Centr...',
      })
      ?.focus()

    userEvent.tab()

    userEvent.tab()

    userEvent.tab({ shift: true })

    expect(
      screen.queryByRole('combobox', {
        name: 'Categorie',
      })
    ).toHaveFocus()

    act(() => {
      fireEvent.keyDown(
        screen.getByRole('combobox', {
          name: 'Categorie',
        }),
        { code: 'Space' }
      )
    })

    expect(
      screen.queryByRole('option', {
        name: 'Auto- / scooter- / bromfiets(wrak)',
      })
    ).toHaveFocus()

    act(() => {
      fireEvent.keyDown(
        screen.getByRole('option', {
          name: 'Grofvuil',
        }),
        { code: 'ArrowDown' }
      )
    })

    expect(
      screen.queryByRole('option', {
        name: 'Blokkade van de vaarweg',
      })
    ).toHaveFocus()

    act(() => {
      fireEvent.keyDown(
        screen.getByRole('option', {
          name: 'Auto- / scooter- / bromfiets(wrak)',
        }),
        { code: 'Space' }
      )
    })
  })

  it('should open a dropdown and close it by enter Esc', () => {
    render(renderWithContext())

    act(() => {
      fireEvent.keyDown(
        screen.getByRole('combobox', {
          name: 'Actie Service Centr...',
        }),
        { code: 'Space' }
      )
    })

    expect(
      screen.queryByRole('option', { name: 'Afval en Grondstoffen' })
    ).toBeInTheDocument()

    userEvent.keyboard('{Escape}')

    expect(
      screen.queryByRole('option', { name: 'Afval en Grondstoffen' })
    ).not.toBeInTheDocument()
  })

  it('should focus on reset button, shift back and forth to end with focus on reset button', () => {
    render(renderWithContext())

    screen
      .getByRole('button', {
        name: 'Wis filters',
      })
      .focus()

    userEvent.tab({ shift: true })

    userEvent.tab()

    expect(
      screen.getByRole('button', {
        name: 'Wis filters',
      })
    ).toHaveFocus()
  })

  it('should use defaultValues from incident contexts dashboardFilter', () => {
    const mockSetDashboardFilter = jest.fn()
    render(
      <IncidentManagementProvider
        value={{
          setDashboardFilter: mockSetDashboardFilter,
          dashboardFilter: {
            ...mockDashboardFilter,
            priority: { value: 'normal', display: 'Normaal' },
          },
        }}
      >
        <Filter setQueryString={mockSetQueryString} />
      </IncidentManagementProvider>
    )

    expect(
      screen.getByRole('combobox', {
        name: 'Normaal',
      })
    ).toBeInTheDocument()
  })

  it('should not use defaultValues from incident contexts dashboardFilter', () => {
    jest.spyOn(reactRouterDom, 'useLocation').mockImplementation(() => ({
      hash: '',
      key: '',
      pathname: '',
      referrer: '/manage/standaard/teksten',
      search: '',
      state: null,
    }))

    render(renderWithContext(null, false, [departmentsCategoriesFixture[0]]))

    expect(
      screen.queryByRole('combobox', {
        name: 'Normaal',
      })
    ).not.toBeInTheDocument()

    act(() => {
      history.push({
        pathname: '/manage/incidents',
        state: {
          useDashboardFilters: true,
        },
      })
    })

    expect(mockSetDashboardFilter).toHaveBeenLastCalledWith({
      category_slug: { display: '', value: '' },
      department: { display: 'Actie Service Centrum', value: 'ASC' },
      stadsdeel: { display: '', value: '' },
      priority: { display: '', value: '' },
      punctuality: { display: '', value: '' },
    })

    act(() => {
      history.push({
        pathname: '/manage/incidents',
      })
    })

    expect(mockSetDashboardFilter.mock.calls[1]).toEqual([{}])
  })

  it('should show a spinner', () => {
    render(renderWithContext(null, true))

    expect(
      screen.getByRole('combobox', {
        name: 'Actie Service Centr...',
      })
    ).toBeInTheDocument()

    expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument()

    userEvent.click(
      screen.getByRole('combobox', {
        name: 'Categorie',
      })
    )

    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument()
  })
})
