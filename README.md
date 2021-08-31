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

const App = () => {
  return (
    <div style={{overflowX: 'hidden', overflowY: 'hidden'}}>
      <CodeEditor
        fetchFiles={
          () => fetch("https://recruitment-service-estella.herokuapp.com/api/tasks?process=16").then(response => response.json())
        }
        codeCheckerBaseLink="https://e-stella-code-executor.herokuapp.com"
        absoluteOffset={{settings: {top: 1, right: 1}, submit: { top: 2, right: 3 }}}
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
| `codeCheckerBaseLink`  | string  | "https://e-stella-code-executor.herokuapp.com"  | false  | Link to REST Api that should execute tests. See below to see what endpoints it must have  |
| `outerOnSubmit`  | function  | None  | false  | Function that will be called when Submit button is clicked (aside of checking tests). It will be called with object `{ code, language, task }`  |
| `absoluteOffset`  | object  | None  | false  | Offset of absolute position of settings and submit buttons. Check example to see how it must be shaped.  |


### Fetch Tasks
TODO

### CodeCheckerBaseLink
TODO


## License

MIT © [e-Stella-AGH](https://github.com/e-Stella-AGH)
