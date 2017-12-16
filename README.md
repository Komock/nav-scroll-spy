# nav-scroll-spy

Simple ES6 Scroll Spy Class

Example: [komock.github.io/nav-scroll-spy](https://komock.github.io/nav-scroll-spy)

## Install

Npm

```sh
npm i --save-dev nav-scroll-spy
```

Yarn

```sh
yarn add nav-scroll-spy
```

## Usage

### JavaScript API

```js
// Absolute path to module 'node_modules/nav-scroll-spy/src/js/nav-scroll-spy.js'
import NavScrollSpy from 'nav-scroll-spy';
const spy = new NavScrollSpy();
spy.init();

// Destroy scroll spy if needed
spy.destroy();
```

### Markup

```html
<nav>
	<ul>
		<li><a href="#section-1">section-1</a></li>
		<li><a href="#section-2">section-2</a></li>
	</ul>
</nav>
```

## Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| offset | number | 0 | Scroll offset |
| currentClass | string | 'active' | Element class for current navigation item (or items). Class will be applied to link parent. |
| selector | string (html) | 'nav a[href*="#"]' | Selector for navigation links |
| throttle | number | 100 | Throttling window events (scroll and resize) to improve performance |

## Features

1. Fast and lightweight
2. No jQuery
3. ES6 ready
