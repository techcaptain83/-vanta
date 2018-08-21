import {mobileCheck} from './helpers.js'

var effectName = null
var effect = null
var gui = null
var fps = null

const GALLERY = [
  "birds",
  "fog",
  "waves",
  "clouds",
  "clouds2",
  "net",
  "cells",
  // "ripple",
  "trunk",
  "topology",
  "dots",
  "rings"
]

var debounce = function(func, wait, immediate) {
  var timeout
  timeout = void 0
  return function() {
    var args, callNow, context, later
    context = this
    args = arguments
    later = function() {
      timeout = null
      if (!immediate) { func.apply(context, args) }
    }
    callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) { func.apply(context, args) }
  }
}

jQuery.extend(jQuery.easing, {
  easeInOutQuart: function(x, t, b, c, d) {
    if ((t /= d / 2) < 1) {
      return c / 2 * t * t * t * t + b
    }
    return -c / 2 * ((t -= 2) * t * t * t - 2) + b
  },
  easeInOutQuint: function(x, t, b, c, d) {
    if ((t /= d / 2) < 1) {
      return c / 2 * t * t * t * t * t + b
    }
    return c / 2 * ((t -= 2) * t * t * t * t + 2) + b
  }
})

THREE.Color.prototype.getBrightness = function() {
  // https://www.w3.org/TR/AERT#color-contrast
  return 0.299 * this.r + 0.587 * this.g + 0.114 * this.b
}

var loadEffect = function(_effectName, loadOptions) {
  _effectName = _effectName.toUpperCase()
  // Instantiate
  loadOptions || (loadOptions = {})
  loadOptions.el = 'section'
  loadOptions.backgroundAlpha = 1

  console.log('[VANTA] Loading effect: ', _effectName)
  if (typeof VANTA == "undefined" || typeof VANTA[_effectName] !== "function") {
    console.error("[VANTA] Effect " + _effectName + ' not found!')
    return false
  }

  // Cleanup & reset preview dom
  if (typeof effect !== "undefined" && effect !== null) {
    effect.destroy()
  }

  // Init
  window.effect = effect = VANTA[_effectName](loadOptions)
  effect.name = effectName = _effectName

  var inner = $('.wm .inner')
  inner.find('.restart').hide()
  $('.wm').removeClass('dark-text')
  $('.dg').remove()
  // Set options

  var options = effect.options
  effect.fps = fps
  // Initialize controller
  gui = new dat.GUI({
    autoPlace: false,
    width: '100%'
  })
  $(gui.domElement).appendTo($('.gui-cont'))
  generateCode(effect, effectName)
  $('body, html').animate({
    scrollTop: 0
  })
  // Set controllers
  if (effectName === 'WAVES') {
    gui.addColor(options, 'color')
    gui.add(options, 'shininess', 0, 150).step(1)
    gui.add(options, 'waveHeight', 0, 40).step(0.5)
    gui.add(options, 'waveSpeed', 0, 2).step(0.05)
    gui.add(options, 'zoom', 0.65, 1.75)
  } else if (effectName === "RINGS") {
    gui.addColor(options, 'color')
    gui.addColor(options, 'backgroundColor')
    gui.add(options, 'backgroundAlpha', 0, 1)
    inner.find('.restart').show()
  } else if (effectName === "STRUCT") {
    gui.addColor(options, 'color').onFinishChange(effect.restart)
    // controller.onChange(function(value) {
    //   # Fires on every change, drag, keypress, etc.
    // })
    gui.addColor(options, 'backgroundColor')
    inner.find('.restart').show()
  } else if (effectName === "BIRDS") {
    gui.addColor(options, 'backgroundColor')
    gui.add(options, 'backgroundAlpha', 0, 1)
    gui.addColor(options, 'color1').onFinishChange(effect.restart)
    gui.addColor(options, 'color2').onFinishChange(effect.restart)
    gui.add(options, 'wingSpan', 10, 40).step(1).onFinishChange(effect.restart)
    gui.add(options, 'speedLimit', 1, 10).step(1).onFinishChange(effect.valuesChanger)
    gui.add(options, 'separation', 1, 100).step(1).onFinishChange(effect.valuesChanger)
    gui.add(options, 'alignment', 1, 100).step(1).onFinishChange(effect.valuesChanger)
    gui.add(options, 'cohesion', 1, 100).step(1).onFinishChange(effect.valuesChanger)
  // gui.add( options, 'freedom', 0, 10 ).step(0.1).onFinishChange(effect.valuesChanger)
  } else if (effectName === "NET") {
    gui.addColor(options, 'color').onFinishChange(effect.restart)
    gui.addColor(options, 'backgroundColor')
    gui.add(options, 'points', 1, 20).step(1).onFinishChange(effect.restart)
    gui.add(options, 'maxDistance', 10, 40).step(1)
    gui.add(options, 'spacing', 10, 20).step(1).onFinishChange(effect.restart)
    gui.add(options, 'showDots').onFinishChange(effect.restart)
  } else if (effectName === "FOG") {
    gui.addColor(options, 'highlightColor').onFinishChange(effect.updateUniforms)
    gui.addColor(options, 'midtoneColor').onFinishChange(effect.updateUniforms)
    gui.addColor(options, 'lowlightColor').onFinishChange(effect.updateUniforms)
    gui.addColor(options, 'baseColor').onFinishChange(effect.updateUniforms)
    gui.add(options, 'blurFactor', 0.1, 0.9).step(0.01).onFinishChange(effect.updateUniforms)
    gui.add(options, 'zoom', 0.1, 3.0).step(0.1).onFinishChange(effect.updateUniforms)
    gui.add(options, 'speed', 0.0, 5.0).step(0.1)
  } else if (effectName === "RIPPLE") {
    gui.addColor(options, 'color1').onFinishChange(effect.updateUniforms)
    gui.addColor(options, 'color2').onFinishChange(effect.updateUniforms)
    gui.addColor(options, 'backgroundColor').onFinishChange(effect.updateUniforms)
    gui.add(options, 'amplitudeFactor', 0.1, 3.0).step(0.1).onFinishChange(effect.updateUniforms)
    gui.add(options, 'ringFactor', 0.1, 20.0).step(0.1).onFinishChange(effect.updateUniforms)
    gui.add(options, 'rotationFactor', 0.0, 2.0).step(0.1).onFinishChange(effect.updateUniforms)
    gui.add(options, 'speed', 0.0, 5.0).step(0.1)
  } else if (effectName === "CELLS") {
    gui.addColor(options, 'color1').onFinishChange(effect.updateUniforms)
    gui.addColor(options, 'color2').onFinishChange(effect.updateUniforms)
    gui.add(options, 'size', 0.2, 5.0).step(0.1).onFinishChange(effect.updateUniforms)
    gui.add(options, 'speed', 0.0, 5.0).step(0.1)
  } else if (effectName === "CLOUDS") {
    gui.addColor(options, 'backgroundColor').onFinishChange(effect.updateUniforms)
    gui.addColor(options, 'skyColor').onFinishChange(effect.updateUniforms)
    gui.addColor(options, 'cloudColor').onFinishChange(effect.updateUniforms)
    gui.addColor(options, 'cloudShadowColor').onFinishChange(effect.updateUniforms)
    gui.addColor(options, 'sunColor').onFinishChange(effect.updateUniforms)
    gui.addColor(options, 'sunGlareColor').onFinishChange(effect.updateUniforms)
    gui.addColor(options, 'sunlightColor').onFinishChange(effect.updateUniforms)
  } else if (effectName === "CLOUDS2") {
    gui.addColor(options, 'backgroundColor').onFinishChange(effect.updateUniforms)
    gui.addColor(options, 'skyColor').onFinishChange(effect.updateUniforms)
    gui.addColor(options, 'cloudColor').onFinishChange(effect.updateUniforms)
    gui.addColor(options, 'lightColor').onFinishChange(effect.updateUniforms)
    gui.add(options, 'speed', 0.0, 5.0).step(0.1)
  } else if (effectName === "TRUNK") {
    gui.addColor(options, 'backgroundColor').onFinishChange(effect.restart)
    gui.addColor(options, 'color').onFinishChange(effect.restart)
  } else if (effectName === "TOPOLOGY") {
    gui.addColor(options, 'backgroundColor').onFinishChange(effect.restart)
    gui.addColor(options, 'color').onFinishChange(effect.restart)
  } else if (effectName === "DOTS") {
    gui.addColor(options, 'backgroundColor').onFinishChange(effect.restart)
    gui.addColor(options, 'color').onFinishChange(effect.restart)
    gui.add(options, 'size', 0.5, 10).step(0.1).onFinishChange(effect.restart)
    gui.add(options, 'spacing', 5, 100).step(1).onFinishChange(effect.restart)
  }
  // Regenerate code!
  gui.__controllers.forEach(c=>{
    var updateBackgroundColorHelper
    updateBackgroundColorHelper = function() {
      if (c.property === 'backgroundColor' || c.property === 'baseColor') {
        updateBackgroundColor(c.getValue())
      }
    }
    c.onChange(function(value) {
      generateCode(effect, effectName)
      updateHashDebounced()
      updateBackgroundColorHelper()
    })
    updateBackgroundColorHelper()
  })
}

var updateBackgroundColor = function(color) {
  if ((new THREE.Color(color)).getBrightness() > 0.65) {
    return $('.wm').addClass('dark-text')
  } else {
    return $('.wm').removeClass('dark-text')
  }
}

var generateCode = function(effect, effectName) {
  var clone, code, k, original, ref, v, vString
  code = `VANTA.${effectName}({\n`
  code += '  el: "<strong>#your-element-selector</strong>",\n'
  ref = effect.options
  for (k in ref) {
    v = ref[k]
    vString = v
    if (k === 'el') {
      continue
    } else if (k === 'texturePath') {
      code += `  texturePath: "<a target='_blank' href='${v}'>${v}</a>",\n`
    } else if (k.toLowerCase().indexOf('color') !== -1) {
      vString = "0x" + v.toString(16)
    } else if (typeof v === 'number') {
      vString = v.toFixed(2)
    }
    if (v !== effect.defaultOptions[k]) {
      code += "  " + k + ': ' + vString + ',\n'
    }
  }
  code = code.replace(/,\n$/, '\n') // remove last comma
  code += "})"
  $('.usage.applied').remove()
  original = $('.usage-cont .usage').first().hide()
  clone = original.clone().addClass('applied').insertAfter(original)
  clone.html(clone.html().replace('{{CODE}}', code))
  let includeCode = document.getElementById('include-three').innerHTML
  if (effect.mode == 'p5') includeCode = document.getElementById('include-p5').innerHTML
  clone.html(clone.html().replace('{{INCLUDE}}', includeCode))
  clone.html(clone.html().replace(/{{EFFECTNAME}}/g, effectName.toLowerCase()))
  return clone.show()
}

var updateHash = function() {
  var optionsToStore
  optionsToStore = $.extend({}, effect.options)
  delete optionsToStore.el
  return history.replaceState(void 0, void 0, "#" + rison.encode(optionsToStore))
}

var updateHashDebounced = debounce(updateHash, 750)

var openCloseUsage = function() {
  return $('.usage-cont').slideToggle({
    duration: 300,
    easing: 'easeInOutQuart'
  })
}

var loadEffectFromUrl = function() {
  var _effectName, e, loadOptions, u
  u = new URLSearchParams(document.location.search)
  _effectName = u.get('effect') || (mobileCheck() ? 'waves' : 'birds')
  loadOptions = null
  if (window.location.hash.length) {
    try {
      loadOptions = rison.decode(window.location.hash.substr(1))
    } catch (error) {
      e = error
      console.log('[VANTA] Invalid hash: ' + e)
    }
  }
  return loadEffect(_effectName, loadOptions)
}

class FPS {
  constructor() {
    var fpsOut
    this.filterStrength = 20
    this.frameTime = 0
    this.lastLoop = new Date
    this.fps = 0
    fpsOut = document.getElementById('fps')
    setInterval(() => {
      this.fps = 1000 / this.frameTime
      return fpsOut != null ? fpsOut.innerHTML = this.fps.toFixed(1) + " fps" : void 0
    }, 250)
  }

  update() {
    var thisFrameTime, thisLoop
    thisFrameTime = (thisLoop = new Date) - this.lastLoop
    this.frameTime += (thisFrameTime - this.frameTime) / this.filterStrength
    this.lastLoop = thisLoop
  }
}

document.addEventListener("DOMContentLoaded", function(event) {
  var _effectName, i, len
  fps = new FPS()
  loadEffectFromUrl()
  // Render gallery
  GALLERY.forEach(_effectName => {
    var itemTemplate, newItem
    itemTemplate = $('.item').first().hide()
    newItem = itemTemplate.clone().show().appendTo(itemTemplate.parent())
    newItem.find('.label').text(_effectName)
    newItem.addClass(_effectName).css({
      backgroundImage: `url(gallery/${_effectName}.jpg)`
    })
    newItem.click(function() {
      var url
      $('.item').removeClass('selected')
      $(this).addClass('selected')
      url = "?effect=" + _effectName
      window.history.pushState({
        effect: _effectName
      }, "", url)
      loadEffect(_effectName)
    })
  })

  // Refresh code
  $('.customize, .usage-cont .close-btn').click(function() {
    generateCode(effect, effectName)
    openCloseUsage()
  })
  // Restart/randomize
  $('.restart').click(function() {
    effect.restart()
  })
  // Mobile optimization
  if ($(window).width() > 727) {
    setTimeout(openCloseUsage, 600)
  }
  // Back button
  window.onpopstate = function(event) {
    loadEffectFromUrl()
  }
})