import React, { useEffect, useState } from 'react'
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

export const CodeEditor = ({
  outerMonacoWrapperStyle,
  fetchFiles,
  codeCheckerBaseLink,
  outerOnSubmit
}) => {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [theme, setTheme] = useState('vs-dark')
  const [open, setOpen] = useState(false)
  const [task, setTask] = useState(null)
  const [timerView, setTimerView] = useState(null)
  const [canSubmit, setCanSubmit] = useState({
    ability: true,
    lastChance: false
  })
  const [tests, setTests] = useState({ testResults: [], state: 'Unchecked' })

  useEffect(() => {
    fetchFiles().then((data) => {
      setTask(data[0])
      setTimerView(
        <Timers
          timeLimit={data[0]?.timeLimit}
          onEnd={() => {
            setCanSubmit({ ...canSubmit, ability: false })
          }}
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
  }, [])

  const submitCode = (code) => {
    if (canSubmit.ability) {
      safeSubmit(code)
    } else {
      if (!canSubmit.lastChance) {
        safeSubmit(code)
        setCanSubmit({ ...canSubmit, lastChance: true })
      }
    }
  }

  const safeSubmit = (code) => {
    setTests({ ...tests, state: 'Pending' })
    submit(codeCheckerBaseLink, code, language, task.testsBase64).then(
      (data) => {
        console.log(data)
        setTests({ testResults: data, state: 'Collected' })
      }
    )
    if(outerOnSubmit) {
      outerOnSubmit({ code, language })
    }
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
        outerDivStyle={outerMonacoWrapperStyle || { height: '300px' }}
        theme={theme}
        canSubmit={canSubmit}
      />
      <div
        style={{
          position: 'absolute',
          right: '1em',
          top: '1em'
        }}
      >
        <IconButton onClick={() => setOpen(true)}>
          <SettingsIcon color='primary' fontSize='large' />
        </IconButton>
      </div>
      <div style={{ marginTop: '2em' }}>{timerView}</div>
      <div style={{ marginTop: '2em' }}>
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

MonacoEditorWrapper.propTypes = {
  outerMonacoWrapperStyle: PropTypes.object
}
