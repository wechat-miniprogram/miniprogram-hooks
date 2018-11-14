# miniprogram-hooks

小程序自定义组件 hooks 实现。

> PS：注意，这是一个试验性的作品，并不是一个成熟的工具，除非你很了解它会带来的问题，不然请**不要**在生产环境中直接使用。

## 使用方法

1. 安装 miniprogram-hooks：

```
npm install --save miniprogram-hooks
```

2. 在定义自定义组件时使用

```js
const {useState, useEffect, FunctionalComponent} = require('miniprogram-hooks')

// 使用函数式的方式声明组件
FunctionalComponent(function() {
  // hooks 只能在最顶层或其他 hooks 内使用，不能在条件、循环中使用
  const [count, setCount] = useState(1)

  useEffect(() => {
    console.log('count update: ', count)
  }, [count])

  const [title, setTitle] = useState('click')

  // 返回变量和 updater
  return {
    count,
    title,
    setCount,
    setTitle,
  }
})
```

```xml
<view>{{count}}</view>
<!-- 参数必须得通过 data-arg 来传入 -->
<button bindtap="setCount" data-arg="{{count + 1}}">{{title}}</button>
<button bindtap="setTitle" data-arg="{{title + '(' + count + ')'}}">update btn text</button>
```
