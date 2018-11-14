let currentCompInst = null
let callIndex = 0

/**
 * 分离 data 和 methods
 */
function splitDef(def) {
  const data = {}
  const methods = {}
  Object.keys(def).forEach(key => {
    const value = def[key]
    if (typeof value === 'function' && value._isUpdater) {
      methods[key] = value.bind(null)
    } else {
      data[key] = value
    }
  })

  return {data, methods}
}

function useState(initValue) {
  if (!currentCompInst) throw new Error('component instance not found!')

  const index = callIndex++
  const compInst = currentCompInst

  if (compInst._$state[index] === undefined) compInst._$state[index] = initValue

  const updater = function (evt) {
    let value = evt

    // wxml 事件回调
    if (typeof evt === 'object' && evt.target && evt.currentTarget) {
      const dataset = evt.currentTarget.dataset
      value = dataset && dataset.arg
    }

    // 存入缓存
    compInst._$state[index] = value
    compInst._$func()
  }
  updater._isUpdater = true

  return [compInst._$state[index], updater]
}

function useEffect(effectFunc, deps) {
  if (!currentCompInst) throw new Error('component instance not found!')

  const index = callIndex++
  const compInst = currentCompInst
  const effect = compInst._$effect[index]

  if (effect === undefined) {
    // 初次渲染
    compInst._$effect[index] = {
      unload: effectFunc.call(null),
      lastDeps: deps,
    }
  } else if (!effect.lastDeps && !deps) {
    // 后续渲染，没有带依赖列表
    effect.unload = effectFunc.call(null)
  } else {
    // 后续渲染，带依赖列表
    for (let i = 0, len = deps.length; i < len; i++) {
      if (effect.lastDeps[i] !== deps[i]) {
        effect.unload = effectFunc.call(null)
        effect.lastDeps = deps
        break
      }
    }
  }
}

function FunctionalComponent(func) {
  func = typeof func === 'function' ? func : function () {}

  // 定义自定义组件
  return Component({
    attached() {
      this._$state = {}
      this._$effect = {}
      this._$func = () => {
        currentCompInst = this
        callIndex = 0
        const newDef = func.call(null) || {}
        currentCompInst = null

        const {data, methods} = splitDef(newDef)

        // 设置 methods
        Object.keys(methods).forEach(key => {
          this[key] = methods[key]
        })

        // 设置 data
        this.setData(data)
      }

      this._$func()
    },
    detached() {
      Object.keys(this._$effect).forEach(key => {
        const effect = this._$effect[key]
        const unload = effect.unload

        if (typeof unload === 'function') unload.call(null)
      })

      this._$state = null
      this._$effect = null
      this._$func = null
    }
  })
}

module.exports = {
  useState,
  useEffect,
  FunctionalComponent,
}
