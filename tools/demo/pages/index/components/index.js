const {useState, useEffect, FunctionalComponent} = require('../../../components/index.js') 

FunctionalComponent(function() {
  const [count, setCount] = useState(1)

  useEffect(() => {
    console.log('count update: ', count)
  }, [count])

  const [title, setTitle] = useState('click')

  return {
    count,
    title,
    setCount,
    setTitle,
  }
})
