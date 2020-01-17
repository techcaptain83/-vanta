# Vanta JS

## [View demo gallery & customize effects at www.vantajs.com &rarr;](https://www.vantajs.com)

[![alt text](https://www.vantajs.com/gallery/vanta-preview.gif "Vanta JS")](https://www.vantajs.com)



## What is Vanta? / FAQs

- **Add 3D animated digital art to any webpage with just a few lines of code.**
- Think of it as wrapper around a digital artwork that allows it to be inserted into an HTML element as a background.
- Effects can interact with mouse/touch inputs.
- Effect parameters (e.g. color) can be easily modified to match your brand.
- Effects are powered by [three.js](https://github.com/mrdoob/three.js/) (using WebGL) or [p5.js](https://github.com/processing/p5.js).
- Total additional filesize is ~120kb minified and gzipped (mostly three.js), which is smaller than comparable background images/videos.
- Vanta includes many pre-defined effects to try out. *More effects will be added soon!*

## [View demo gallery & customize effects at www.vantajs.com &rarr;](https://www.vantajs.com)

## Basic usage:

```html
<script src="three.min.js"></script>
<script src="vanta.waves.min.js"></script>
<script>
  VANTA.WAVES('#my-background')
</script>
```

[View fiddle &rarr;](https://jsfiddle.net/xb74q5h1/)

## More options:

```js
VANTA.WAVES({
  el: '#my-background', // element selector string or DOM object reference
  color: 0x000000,
  waveHeight: 20,
  shininess: 50,
  waveSpeed: 1.5,
  zoom: 0.75
})
```

## Options documentation:

**el:** The container element. The Vanta canvas will be appended as a child of this element, and will assume the width and height of this element. If you want a fullscreen canvas, make sure this container element is fullscreen. Note: This container *can* have other children. The other children will appear as foreground content, in front of the Vanta canvas.

**mouseControls:** (defaults to *true*) Set to false to disable mouse controls. Only applies to certain effects.

**touchControls:** (defaults to *true*) Set to false to disable touch controls. Only applies to certain effects.

**Other params:** Each effect has different parameters. Explore them all!

## Updating options after init:

```js
const effect = VANTA.WAVES({
  el: '#my-background',
  color: 0x000000
})

// Later, when you want to update an animation in progress
effect.update({
  color: 0xff88cc
})
```

## Cleanup:

```js
const effect = VANTA.WAVES('#my-background')
effect.destroy() // e.g. call this in React's componentWillUnmount
```

## Usage with React Hooks (requires React 16.8):

Import `vanta.xxxxx.min.js` as follows. Make sure `three.js` or `p5.js` has already been included via <script> tag.

```js
import React, { useState, useEffect, useRef } from 'react'
import BIRDS from './vanta.birds.min.js'
// Make sure window.THREE is defined, e.g. by including three.min.js in the document head using a <script> tag

const MyComponent = (props) => {
  const [vantaEffect, setVantaEffect] = useState(0)
  const myRef = useRef(null)
  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(BIRDS({
        el: myRef.current
      }))
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [vantaEffect])
  return <div ref={myRef}>
    Foreground content goes here
  </div>
}
```

## Usage with React Classes:

```js
import React from 'react'
import BIRDS from './vanta.birds.min.js'
// Make sure window.THREE is defined, e.g. by including three.min.js in the document head using a <script> tag

class MyComponent extends React.Component {
  constructor() {
    super()
    this.vantaRef = React.createRef()
  }
  componentDidMount() {
    this.vantaEffect = BIRDS({
      el: this.vantaRef.current
    })
  }
  componentWillUnmount() {
    if (this.vantaEffect) this.vantaEffect.destroy()
  }
  render() {
    return <div ref={this.vantaRef}>
      Foreground content goes here
    </div>
  }
}
```
[View fiddle &rarr;](https://jsfiddle.net/tsrwxzyL/2/)

## Using THREE from npm

You can also import `three` from npm, and pass it into the effect constructor.

```js
import React from 'react'
import * as THREE from 'three'
import BIRDS from './vanta.birds.min.js'

...
  componentDidMount() {
    this.vantaEffect = BIRDS({
      el: this.vantaRef.current,
      THREE: THREE // use a custom THREE when initializing
    })
  }

```

## Local dev:

Clone the repo, run `npm install` and `npm run dev`, and go to localhost:8080.

## Credits

- General inspiration from [shadertoy.com](https://www.shadertoy.com), [#generative](https://www.twitter.com/hashtag/generative), [/r/generative](https://www.reddit.com/r/generative/), [/r/creativecoding](https://www.reddit.com/r/creativecoding/), etc

- Birds effect from https://threejs.org/examples/?q=birds#webgl_gpgpu_birds by @zz85
- Fog effect from https://thebookofshaders.com/13/ by @patriciogonzalezvivo
- Clouds effect from https://www.shadertoy.com/view/XslGRr by Inigo Quilez
- Clouds2 effect from https://www.shadertoy.com/view/lsBfDz by Rune Stubbe
- Trunk, Topology effects from http://generated.space/ by Kjetil Midtgarden Golid @kgolid
