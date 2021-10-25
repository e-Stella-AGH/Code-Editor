# e-stella-code-editor

> Code Editor component for E-Stella project (and not only)

[![NPM](https://img.shields.io/npm/v/e-stella-code-editor.svg)](https://www.npmjs.com/package/e-stella-code-editor) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save e-stella-code-editor
```

## Usage

```jsx
import React from 'react'

import { CodeEditor } from 'e-stella-code-editor'
import { Realtime } from "ably/browser/static/ably-commonjs.js"


const App = () => {

  const id = Math.floor(Math.random() * 100)

  const ably = new Realtime({ key: process.env.REACT_APP_ABLY_API_KEY })
  const channel = ably.channels.get('code')

  const sub = (func) => channel.subscribe(func)
  const pub = (data) => channel.publish('codeChanged', data, (err) => err ? console.log(err) : console.log(''))

  return (
    <div style={{overflowX: 'hidden', overflowY: 'hidden'}}>
      <CodeEditor
        fetchTasks={
          () => fetch("https://recruitment-service-estella.herokuapp.com/api/tasks?process=16").then(response => response.json())
        }
        solverId="f0dee915-9291-449f-9b37-33ef547adeb0"
        codeCheckerBaseLink="https://e-stella-code-executor.herokuapp.com"
        sharingCodeFunctions={{ sub, pub, id }}
      />
    </div>
  )
}

export default App
```

To use `Code Editor` it's enough to just install it. Follow table of props to see more advanced usage.

### Table of props
outerMonacoWrapperStyle,
  fetchFiles,
  codeCheckerBaseLink,
  outerOnSubmit,
  absoluteOffset
| Prop  | Type  | Deafult | IsRequired  | Meaning |
|---|---|---|---|---|
| `outerMonacoWrapperStyle`  | object  | `{height: '300px'}`  | false  | Style of monaco editor (big black rectangle in which you write code)  |
| `fetchTasks`  | function  | None  | true  | Function that gets tasks. See below to see what task object should return  |
| `solverId`  | string  | None  | true  | Task solver identification string  |
| `codeCheckerBaseLink`  | string  | "https://e-stella-code-executor.herokuapp.com"  | false  | Link to REST Api that should execute tests. See below to see what endpoints it must have  |
| `outerOnSubmit`  | function  | None  | false  | Function that will be called when Submit button is clicked (aside of checking tests). It will be called with object `{ code, language, task }`  |
| `absoluteOffset`  | object  | None  | false  | Offset of absolute position of settings and submit buttons. Check example to see how it must be shaped.  |
| `sharingCodeFunctions`  | object  | None  | false  | Functions and utils we'll use to share your code in realtime. If you don't want to use them, leave this prop empty. |


### Fetch Tasks
TODO

### CodeCheckerBaseLink
TODO

### sharingCodeFunctions
Utils that we need to share your code in real time. As we don't want to set technology in stone, we didn't provide them by default. Check out
out example to see how we implemented them with Ably.
Utils we need:
* `pub` - publish function
* `sub` - subscribe function - should receive one argument - callback that will be called when message comes. We'll use it to set a code message.
* `id` - unique identifier that we'll use to determine who sent the code
* `codeSharingInterval` - interval of sharing code in ms (if not set, will fallback to default 2000)


## License

MIT © [e-Stella-AGH](https://github.com/e-Stella-AGH)
