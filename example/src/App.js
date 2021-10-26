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

  const ably = new Realtime({ key: process.env.REACT_APP_ABLY_API_KEY })
  const channel = ably.channels.get('code')

  const sub = (func) => channel.subscribe(func)
  const pub = (data) => channel.publish('codeChanged', data, (err) => err ? console.log(err) : console.log(''))

  return (
    <div style={{overflowX: 'hidden', overflowY: 'hidden'}}>
      <CodeEditor
        fetchTasks={
          () => new Promise(resolve => resolve([fallbackTask]))
        }
        solverId="d0fd33a1-bef1-4bbf-9b70-9f153cf721b3"
        codeCheckerBaseLink="https://e-stella-code-executor.herokuapp.com"
        sharingCodeFunctions={{ sub, pub, id }}
      />
    </div>
  )
}

const fallbackTask = { id: 41, descriptionBase64: 'IyBBbHBoYWJldA0KDQojIyBEZXNjcmlwdGlvbg0KR2l2ZW4gYSBwb3NpdGl2ZSBudW1iZXIgX19uX18sIHByaW50IF9fbl9fIGZpcnN0IGxldHRlcnMgb2YgYWxwaGFiZXQuDQoNCiMjIEV4YW1wbGUNCmBgYA0KaW5wdXQ6IDUNCg0Kb3V0cHV0OiAiYWJjZGUiDQpgYGA=', descriptionFileName: 'fakeTaskDescription.md', testsBase64: 'Ww0KICB7DQogICAgInRlc3RDYXNlSWQiOiAxLA0KICAgICJ0ZXN0RGF0YSI6IDEsDQogICAgImV4cGVjdGVkUmVzdWx0IjogImEiDQogIH0sDQogIHsNCiAgICAidGVzdENhc2VJZCI6IDIsDQogICAgInRlc3REYXRhIjogMiwNCiAgICAiZXhwZWN0ZWRSZXN1bHQiOiAiYWIiDQogIH0sDQogIHsNCiAgICAidGVzdENhc2VJZCI6IDMsDQogICAgInRlc3REYXRhIjogNSwNCiAgICAiZXhwZWN0ZWRSZXN1bHQiOiAiYWJjZGUiDQogIH0NCl0=', timeLimit: 30 }

export default App
