/**
 *
 * NProgress
 *
 */

import Router from 'next/router';
import * as NProgress from 'nprogress';
import * as PropTypes from 'prop-types';
import * as React from 'react';

interface RouteProps {
  shallow: boolean;
}

export interface NextProgressProps {
  /**
   * The color of the bar.
   * @default "#29D"
   */
  color?: string;
  /**
   * The start position of the bar.
   * @default 0.3
   */
  startPosition?: number;
  /**
   * The stop delay in milliseconds.
   * @default 200
   */
  stopDelayMs?: number;
  /**
   * The height of the bar.
   * @default 3
   */
  height?: number;
  /**
   * Whether to show the bar on shallow routes.
   * @default true
   */
  showOnShallow?: boolean;
  /**
   * The other NProgress configuration options to pass to NProgress.
   * @default null
   */
  options?: Partial<NProgress.NProgressOptions>;
  /**
   * The nonce attribute to use for the `style` tag.
   * @default undefined
   */
  nonce?: string;
  /**
   * Debounce the progress bar so it only shows up after a delay.
   * Useful for fast navigations.
   */
  debounce?: number;

  /**
   * Use your custom CSS tag instead of the default one.
   * This is useful if you want to use a different style or minify the CSS.
   * @default (css) => <style nonce={nonce}>{css}</style>
   */
  transformCSS?: (css: string) => JSX.Element;
}

const NextProgress = ({
  color = '#29D',
  startPosition = 0.3,
  stopDelayMs = 200,
  height = 3,
  showOnShallow = true,
  options,
  nonce,
  debounce = 300,
  transformCSS = (css) => <style nonce={nonce}>{css}</style>,
}: NextProgressProps) => {
  let timer: NodeJS.Timeout | null = null;
  let debounceTimer: NodeJS.Timeout | null = null;

  React.useEffect(() => {
    if (options) {
      NProgress.configure(options);
    }
    Router.events.on('routeChangeStart', routeChangeStart);
    Router.events.on('routeChangeComplete', routeChangeEnd);
    Router.events.on('routeChangeError', routeChangeError);
    return () => {
      Router.events.off('routeChangeStart', routeChangeStart);
      Router.events.off('routeChangeComplete', routeChangeEnd);
      Router.events.off('routeChangeError', routeChangeError);
    };
  }, []);

  const routeChangeStart = (
    _: string,
    cfg: RouteProps
  ) => {
    if (cfg?.shallow && !showOnShallow) return;

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(() => {
      NProgress.set(startPosition);
      NProgress.start();

    }, debounce);
  };

  const routeChangeEnd = (
    _: string
  ) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      NProgress.done();
      }, stopDelayMs);
  };

  const routeChangeError = (
    _err: Error,
    _url: string
  ) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      NProgress.done();
      }, stopDelayMs);
  };

  return transformCSS(`
    #nprogress {
      pointer-events: none;
    }
    #nprogress .bar {
      background: ${color};
      position: fixed;
      z-index: 9999;
      top: 0;
      left: 0;
      width: 100%;
      height: ${height}px;
    }
    #nprogress .peg {
      display: block;
      position: absolute;
      right: 0px;
      width: 100px;
      height: 100%;
      box-shadow: 0 0 10px ${color}, 0 0 5px ${color};
      opacity: 1;
      -webkit-transform: rotate(3deg) translate(0px, -4px);
      -ms-transform: rotate(3deg) translate(0px, -4px);
      transform: rotate(3deg) translate(0px, -4px);
    }
    #nprogress .spinner {
      display: block;
      position: fixed;
      z-index: 1031;
      top: 15px;
      right: 15px;
    }
    #nprogress .spinner-icon {
      width: 18px;
      height: 18px;
      box-sizing: border-box;
      border: solid 2px transparent;
      border-top-color: ${color};
      border-left-color: ${color};
      border-radius: 50%;
      -webkit-animation: nprogresss-spinner 400ms linear infinite;
      animation: nprogress-spinner 400ms linear infinite;
    }
    .nprogress-custom-parent {
      overflow: hidden;
      position: relative;
    }
    .nprogress-custom-parent #nprogress .spinner,
    .nprogress-custom-parent #nprogress .bar {
      position: absolute;
    }
    @-webkit-keyframes nprogress-spinner {
      0% {
        -webkit-transform: rotate(0deg);
      }
      100% {
        -webkit-transform: rotate(360deg);
      }
    }
    @keyframes nprogress-spinner {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `);
};

NextProgress.propTypes = {
  color: PropTypes.string,
  startPosition: PropTypes.number,
  stopDelayMs: PropTypes.number,
  height: PropTypes.number,
  showOnShallow: PropTypes.bool,
  options: PropTypes.object,
  nonce: PropTypes.string,
  transformCSS: PropTypes.func,
};

export default React.memo(NextProgress);
