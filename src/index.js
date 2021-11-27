import React, { useEffect, useState, useRef } from 'react'
import { IconButton, Drawer } from '@material-ui/core'
import { MonacoEditorWrapper } from './MonacoEditorWrapper'
import PropTypes from 'prop-types'
import { OptionsDrawer } from './OptionsDrawer'
import SettingsIcon from '@material-ui/icons/Settings'
import { submit } from './utils'
import { Timers } from './Timers'
import { TestsResults } from './TestsResults'

const getNumberOfTestsFromFile = (base64File) =>
  JSON.parse(Buffer.from(base64File, 'base64').toString('ascii')).length

function getTimeLimit(data) {
  return data.startTime ? new Date(data.startTime).getTime() + data.timeLimit * 60 * 1000 - new Date() : data.timeLimit * 60 * 1000;
}

const isTaskStarted = (data) => !!data.startTime

export const CodeEditor = ({
  outerMonacoWrapperStyle,
  fetchTasks,
  codeCheckerBaseLink,
  solverId,
  taskStartedCallback,
  outerOnSubmit,
  absoluteOffset,
  sharingCodeFunctions
}) => {
  if (!codeCheckerBaseLink)
    codeCheckerBaseLink = 'https://e-stella-code-executor.herokuapp.com'

  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('python')
  const [theme, setTheme] = useState('vs-dark')
  const [open, setOpen] = useState(false)
  const [task, setTask] = useState(null)
  const [canSubmit, setCanSubmit] = useState({
    beforeStart: true,
    ability: true,
    overDeadline: false
  })
  const [tests, setTests] = useState({ testResults: [], state: 'Unchecked' })
  const [areTestsDisplayedFirstTime, setAreTestsDisplayedFirstTime] = useState(true)

  const [canPublish, setCanPublish] = useState(false)

  const takeControl = () => {
    sharingCodeFunctions?.pub(
      JSON.stringify({ id: sharingCodeFunctions?.id, message: 'takeControl' })
    )
    setCanPublish(true)
    setAreTestsDisplayedFirstTime(false)
  }

  const onTimerStart = () => {
    sharingCodeFunctions?.pub(
      JSON.stringify({ id: sharingCodeFunctions?.id, message: 'start' })
    )
    if (taskStartedCallback && !isTaskStarted(task)) taskStartedCallback()

    setCanSubmit({ ...canSubmit, beforeStart: false })
  }

  const startButtonRef = useRef(null)

  useEffect(() => {
    fetchTasks().then((data) => {
      setTask(data[0])
      if (isTaskStarted(data[0]) && data[0]) {
        const currentCode = Buffer.from(data[0].code || '', 'base64').toString()
        setCode(currentCode)
        onTimerStart()
      }
      setTests({
        ...tests,
        testResults: new Array(getNumberOfTestsFromFile(data[0].testsBase64))
          .fill(0)
          .map((item, idx) => {
            return { testCaseId: idx + 1 }
          })
      })
    })

    sharingCodeFunctions?.sub?.((message) => {
      const parsed = JSON.parse(message.data)
      const id = parsed.id
      const mes = parsed.message

      if (mes === 'takeControl') {
        setCanPublish(id === sharingCodeFunctions?.id)
      } else if (mes === 'start') {
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
    submit(
      codeCheckerBaseLink,
      code,
      language,
      task.testsBase64,
      solverId,
      task.id
    ).then((data) => {
      setTests({ testResults: data.results, state: 'Collected' })
      setAreTestsDisplayedFirstTime(true)
      if (outerOnSubmit) {
        outerOnSubmit({ code, language, task, testResults: data })
      }
    })
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
        <IconButton disabled={!task} onClick={() => setOpen(true)}>
          <SettingsIcon color='primary' fontSize='large' />
        </IconButton>
      </div>
      <div style={{ marginTop: '2em' }}>
        {task && (
          <Timers
            timeLimit={getTimeLimit(task)}
            isRunning={isTaskStarted(task)}
            canSubmit={{ ...canSubmit, overDeadline: false }}
            onStart={onTimerStart}
            onEnd={() => {
              setCanSubmit({ ...canSubmit, ability: false })
            }}
            startButtonRef={startButtonRef}
          />
        )}
      </div>
      <div style={{ marginTop: '2em', marginBottom: '1em' }}>
        <TestsResults
          testResults={tests.testResults}
          state={tests.state}
          shouldShowCompilationError={areTestsDisplayedFirstTime}
          setShouldShowCompilationError={setAreTestsDisplayedFirstTime}
        />
      </div>
      {task && (
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
      )}
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
