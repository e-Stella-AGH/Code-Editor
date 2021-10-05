import React from 'react'

import { CodeEditor } from 'e-stella-code-editor'
import { Realtime } from "ably/browser/static/ably-commonjs.js"

const App = () => {

  const id = Math.floor(Math.random()*100)

  const ably = new Realtime({ key: process.env.REACT_APP_ABLY_KEY })
  const channel = ably.channels.get('code')

  const sub = (func) => channel.subscribe(func)
  const pub = (data) => channel.publish('codeChanged', data, (err) => err ? console.log(err) : console.log('ok'))

  return (
    <div style={{overflowX: 'hidden', overflowY: 'hidden'}}>
      <CodeEditor
        fetchTasks={
          () => fetch("https://recruitment-service-estella.herokuapp.com/api/tasks?process=16").then(response => response.json())
        }
        codeCheckerBaseLink="https://e-stella-code-executor.herokuapp.com"
        sharingCodeFunctions={{ sub, pub, id }}
      />
    </div>
  )
}

export default App
