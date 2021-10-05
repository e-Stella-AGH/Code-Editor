import React from 'react'

import { CodeEditor } from 'e-stella-code-editor'
import { Realtime } from "ably/browser/static/ably-commonjs.js"


function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
}


const App = () => {

  const id = makeid(10)

  const ably = new Realtime({ key: 'vVogsQ.TIFtUw:VOMpWmEg9kv7tR7K' })
  const channel = ably.channels.get('code')

  const sub = (func) => channel.subscribe(func)
  const pub = (data) => channel.publish('codeChanged', data, (err) => err ? console.log(err) : console.log(''))

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
