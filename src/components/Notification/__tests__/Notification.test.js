import React from 'react';
import { render } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import { act } from 'react-dom/test-utils';
import 'jest-styled-components';

import { isAuthenticated } from 'shared/services/auth/auth';

import {
  ONCLOSE_TIMEOUT,
  SLIDEUP_TIMEOUT,
  VARIANT_ERROR,
  VARIANT_NOTICE,
  VARIANT_DEFAULT,
  VARIANT_SUCCESS,
} from 'containers/Notification/constants';
import {
  SITE_HEADER_HEIGHT_SHORT,
  SITE_HEADER_HEIGHT_TALL,
} from 'containers/SiteHeader/constants';

import Notification, {
  BG_COLOR_ERROR,
  BG_COLOR_NOTICE,
  BG_COLOR_SUCCESS,
} from '..';

jest.useFakeTimers();

jest.mock('shared/services/auth/auth');

// The test renderer uses setTimeout which gives false positives when checking for the amount of calls
// in global.setTimeout. We need to remove the first item off the list of calls to get the actual
// list of calls to global.setTimeout
const getCalls = fn =>
  global[fn].mock.calls.filter(([call]) => call.name !== '_flushCallback');

const getSetTimeoutCalls = () => getCalls('setTimeout');
const getClearTimeoutCalls = () => getCalls('clearTimeout');

describe('components/Notification', () => {
  afterEach(() => {
    // jest.runOnlyPendingTimers();
  });

  beforeEach(() => {
    global.setTimeout.mock.calls = [];
    global.clearTimeout.mock.calls = [];
    jest.clearAllTimers();
  });

  it('renders correctly when not logged in', () => {
    isAuthenticated.mockImplementation(() => false);

    const title = 'Here be dragons';
    const { container, getByText } = render(
      withAppContext(<Notification title={title} />)
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(getByText(title)).toBeInTheDocument();
    expect(container.firstChild).toHaveStyleRule('top', `${SITE_HEADER_HEIGHT_TALL}px`);
    expect(container.firstChild).toHaveStyleRule('position', 'absolute');
    expect(container.firstChild).toHaveStyleRule(
      'transition',
      expect.stringContaining('ease-out')
    );
  });

  it('renders correctly when logged in', () => {
    isAuthenticated.mockImplementation(() => true);

    const { container } = render(
      withAppContext(<Notification title="Foo bar" />)
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(container.firstChild).toHaveStyleRule('top', `${SITE_HEADER_HEIGHT_SHORT}px`);
    expect(container.firstChild).toHaveStyleRule('position', 'fixed');
  });

  it('renders its variants', () => {
    const { container, rerender } = render(
      withAppContext(<Notification title="Foo bar" />)
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(container.firstChild).toHaveStyleRule(
      'background-color',
      BG_COLOR_NOTICE
    );

    rerender(
      withAppContext(
        <Notification title="Foo bar" variant={VARIANT_NOTICE} />
      )
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(container.firstChild).toHaveStyleRule(
      'background-color',
      BG_COLOR_NOTICE
    );

    rerender(
      withAppContext(
        <Notification title="Foo bar" variant={VARIANT_DEFAULT} />
      )
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(container.firstChild).toHaveStyleRule(
      'background-color',
      BG_COLOR_NOTICE
    );

    rerender(
      withAppContext(
        <Notification title="Foo bar" variant={VARIANT_ERROR} />
      )
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(container.firstChild).toHaveStyleRule(
      'background-color',
      BG_COLOR_ERROR
    );

    rerender(
      withAppContext(
        <Notification title="Foo bar" variant={VARIANT_SUCCESS} />
      )
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(container.firstChild).toHaveStyleRule(
      'background-color',
      BG_COLOR_SUCCESS
    );
  });

  it('does not use timeouts to time navigation actions for VARIANT_ERROR', () => {
    expect(getSetTimeoutCalls()).toHaveLength(0);

    render(
      withAppContext(
        <Notification title="Foo bar" variant={VARIANT_ERROR} />
      )
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(getSetTimeoutCalls()).toHaveLength(0);
  });

  it('uses timeouts to time navigation actions for VARIANT_NOTICE', () => {
    expect(getSetTimeoutCalls()).toHaveLength(0);

    render(
      withAppContext(<Notification title="Foo bar" variant={VARIANT_NOTICE} />)
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(getSetTimeoutCalls()).toHaveLength(2);
  });

  it('uses timeouts to time navigation actions for VARIANT_SUCCESS', () => {
    expect(getSetTimeoutCalls()).toHaveLength(0);

    render(
      withAppContext(<Notification title="Foo bar" variant={VARIANT_SUCCESS} />)
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(getSetTimeoutCalls()).toHaveLength(2);
  });

  it('hides the component after a specific amount of time and executes callback function', () => {
    expect(getSetTimeoutCalls()).toHaveLength(0);
    expect(getClearTimeoutCalls()).toHaveLength(0);

    const onClose = jest.fn();

    const { container } = render(
      withAppContext(<Notification title="Foo bar" variant={VARIANT_SUCCESS} onClose={onClose} />)
    );

    expect(getSetTimeoutCalls()).toHaveLength(2);
    expect(getClearTimeoutCalls()).toHaveLength(0);

    expect(onClose).not.toHaveBeenCalled();

    expect(container.firstChild.classList.contains('slideup')).toEqual(false);

    act(() => {
      jest.advanceTimersByTime(ONCLOSE_TIMEOUT);
    });

    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(SLIDEUP_TIMEOUT);
    });

    expect(onClose).toHaveBeenCalled();

    expect(getSetTimeoutCalls()).toHaveLength(2);
    expect(getClearTimeoutCalls()).toHaveLength(2);

    expect(container.firstChild.classList.contains('slideup')).toEqual(true);
  });

  it('clears timeouts on unmount', () => {
    expect(getSetTimeoutCalls()).toHaveLength(0);

    const { unmount } = render(
      withAppContext(<Notification title="Foo bar" variant={VARIANT_SUCCESS} />)
    );

    act(() => {
      jest.runAllTimers();
    });

    act(() => {
      unmount();
    });

    expect(getClearTimeoutCalls()).toHaveLength(4);
  });

  it('resets the times when the component receives a mouse enter event', () => {});

  it('hides when the close button is clicked', () => {});
});
