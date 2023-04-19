# Next.js progress bar with debounce

> **Note**
> This is a fork of [nextjs-progressbar](https://github.com/apal21/nextjs-progressbar) by [apal21](https://github.com/apal21). It adds an optional debounce to the progress bar to prevent it from flickering when the page loads quickly.

A simple Next.js progressbar component using [NProgress](http://ricostacruz.com/nprogress/).


## Usage

After installing the package, import `NextProgress` in your `pages/_app.tsx` file and add `<NextProgress />` to the render function in `App`:

```js
import NextProgress from '@approximant/next-progress';

export default function App({ Component, pageProps }) {
  return (
    <>
      <NextProgress />
      <Component {...pageProps} />;
    </>
  );
}
```

### Default config

If no props are passed to `<NextProgress />`, the default configuration is applied.

```jsx
// Default config
<NextProgress 
  debounce={300}
  color="#29D"
  startPosition={0.3}
  stopDelayMs={200}
  height={3}
  showOnShallow={true}  
  />
```

- **`debounce`: Debounce time in `ms`. The progress bar will not be shown if the page loads in less than this time.**
- `color`: to change the default color of progressbar. You can also use `rgb(,,)` or `rgba(,,,)`.
- `startPosition`: to set the default starting position : `0.3 = 30%`.
- `stopDelayMs`: time for delay to stop progressbar in `ms`.
- `height`: height of progressbar in `px`.
- `showOnShallow`: You can choose whether you want the progressbar to be displayed if you're using shallow routing. It takes a boolean. Learn more about shallow routing [in Next.js docs](https://nextjs.org/docs/routing/shallow-routing).

### Advanced config

#### Adding nonce

We use internal css in this package. If you are using csp, you can add nonce to the `<style>` tag by providing `nonce` prop to `<NextProgress />` component.

```jsx
<NextProgress nonce="my-nonce" />
```

#### Custom CSS

You can use `transformCSS` prop to pass custom css.
**Note:** You must return a `JSX.Element` from the function.

```jsx
NextProgress<
  transformCSS={(css) => {
    // css is the default css string. You can modify it and return it or return your own css.
    return <style>{css}</style>;
  }}
/>
```

#### Other config

You can use [other configurations](https://github.com/rstacruz/nprogress#configuration) which NProgress provides by adding a JSON in `options` props.

```jsx
<NextProgress options={{ easing: 'ease', speed: 500 }} />
```
