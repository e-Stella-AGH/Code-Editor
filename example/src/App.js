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
      />
    </div>
  )
}

export default App
