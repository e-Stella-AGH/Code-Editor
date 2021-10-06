import React, { useEffect, useState, useRef } from 'react'
import { IconButton, Drawer } from '@material-ui/core'
import { MonacoEditorWrapper } from './MonacoEditorWrapper'
import PropTypes from 'prop-types'
import { OptionsDrawer } from './OptionsDrawer'
import SettingsIcon from '@material-ui/icons/Settings'
import { submit } from './utils'
import { Timers } from './Timers'
import { TestsResults } from './TestsResults'
import Swal from 'sweetalert2'

const getNumberOfTestsFromFile = (base64File) =>
  JSON.parse(Buffer.from(base64File, 'base64').toString('ascii')).length

export const CodeEditor = ({
  outerMonacoWrapperStyle,
  fetchTasks,
  codeCheckerBaseLink,
  outerOnSubmit,
  absoluteOffset,
  sharingCodeFunctions
}) => {

  if(!codeCheckerBaseLink) codeCheckerBaseLink = "https://e-stella-code-executor.herokuapp.com"

  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('python')
  const [theme, setTheme] = useState('vs-dark')
  const [open, setOpen] = useState(false)
  const [task, setTask] = useState(null)
  const [timerView, setTimerView] = useState(null)
  const [canSubmit, setCanSubmit] = useState({
    beforeStart: true,
    ability: true,
    overDeadline: false
  })
  const [tests, setTests] = useState({ testResults: [], state: 'Unchecked' })

  const [canPublish, setCanPublish] = useState(false)

  const takeControl = () => {
    sharingCodeFunctions?.pub(JSON.stringify({ id: sharingCodeFunctions?.id, message: "takeControl" }))
    setCanPublish(true)
  }

  const onTimerStart = () => {
    sharingCodeFunctions?.pub(JSON.stringify({ id: sharingCodeFunctions?.id, message: "start" }))
    setCanSubmit({ ...canSubmit, beforeStart: false }) 
  }

  const startButtonRef = useRef(null)

  useEffect(() => {
    let overDeadline = false
    fetchTasks().then((data) => {

      setTask(data[0])
      setTimerView(
        <Timers
          timeLimit={data[0].timeLimit}
          canSubmit={{ ...canSubmit, overDeadline }}
          onStart={onTimerStart}
          onEnd={() => {
            setCanSubmit({ ...canSubmit, ability: false })
          }}
          startButtonRef={startButtonRef}
        />
      )
      setTests({
        ...tests,
        testResults: new Array(getNumberOfTestsFromFile(data[0].testsBase64))
          .fill(0)
          .map((item, idx) => {
            return { testCaseId: idx + 1 }
          })
      })
    })

    sharingCodeFunctions?.sub?.(message => {
      const parsed = JSON.parse(message.data)
      const id = parsed.id
      const mes = parsed.message
  
      if (mes === "takeControl") {
        setCanPublish(id === sharingCodeFunctions?.id)
      } else if (mes === "start") {
        startButtonRef?.current?.click()
      } else if (id !== sharingCodeFunctions?.id) {
        setCode(mes)
      }
  
    })
  

  }, [])

  const submitCode = (code) => {
    if (canSubmit.ability) {
      safeSubmit(code)
    }
  }

  const safeSubmit = (code) => {
    setTests({ ...tests, state: 'Pending' })
    submit(codeCheckerBaseLink, code, language, task.testsBase64).then(
      (data) => {
        setTests({ testResults: data, state: 'Collected' })
        if (outerOnSubmit) {
          outerOnSubmit({ code, language, task, testResults: data })
        }
      }
    )
  }

  return (
    <div>
      <MonacoEditorWrapper
        setCode={(code) => {
          setCode(code)
          submitCode(code)
        }}
        language={language}
        code={code}
        outerDivStyle={outerMonacoWrapperStyle || { height: '200px' }}
        theme={theme}
        canSubmit={canSubmit}
        absoluteOffset={absoluteOffset}
        shareCodeUtils={sharingCodeFunctions}
        takeControl={takeControl}
        canPublish={canPublish}
      />
      <div
        style={{
          position: 'absolute',
          right: `${1 + absoluteOffset.settings.right}em`,
          top: `${1 + absoluteOffset.settings.top}em`
        }}
      >
        <IconButton onClick={() => setOpen(true)}>
          <SettingsIcon color='primary' fontSize='large' />
        </IconButton>
      </div>
      <div style={{ marginTop: '2em' }}>{timerView}</div>
      <div style={{ marginTop: '2em', marginBottom: '1em' }}>
        <TestsResults testResults={tests.testResults} state={tests.state} />
      </div>
      <Drawer
        anchor='right'
        open={open}
        transitionDuration={700}
        ModalProps={{ onBackdropClick: () => setOpen(false) }}
      >
        <OptionsDrawer
          language={language}
          setLanguage={setLanguage}
          setTheme={setTheme}
          task={task}
          theme={theme}
        />
      </Drawer>
    </div>
  )
}

CodeEditor.propTypes = {
  outerMonacoWrapperStyle: PropTypes.object,
  absoluteOffset: PropTypes.exact({
    settings: PropTypes.exact({
      right: PropTypes.number,
      top: PropTypes.number
    }),
    submit: PropTypes.exact({
      left: PropTypes.number,
      top: PropTypes.number
    })
  }),
  fetchTasks: PropTypes.func.isRequired,
  codeCheckerBaseLink: PropTypes.string.isRequired,
  outerOnSubmit: PropTypes.func
}

CodeEditor.defaultProps = {
  absoluteOffset: {
    settings: {
      right: 0,
      top: 0
    },
    submit: {
      left: 0,
      top: 0
    }
  }
}
