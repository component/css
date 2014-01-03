
# css

  jQuery's [css()](http://api.jquery.com/css/) method.

## Installation

  Install with [component(1)](http://component.io):

    $ component install matthewmueller/css

## API

### css(el, prop)

Get the computed value of the `prop` on `el`.

```js
css(p, 'color')
```

### css(el, prop, value)

Set the CSS `value` on the `prop` on `el`

```js
css(p, 'color', 'red')
```

### css(el, styles)

Set a `styles` object to `el`

```js
css(p, {
  color: 'red',
  background: 'blue'
})
```

## TODO

- Finish porting jQuery tests over

## License

  MIT
