import React, { useEffect, useState } from 'react'
import { IconButton, Drawer } from '@material-ui/core'
import { MonacoEditorWrapper } from './MonacoEditorWrapper'
import PropTypes from 'prop-types'
import { OptionsDrawer } from './OptionsDrawer'
import SettingsIcon from '@material-ui/icons/Settings'
import { submit } from './utils'

export const CodeEditor = ({
  outerMonacoWrapperStyle,
  fetchFiles,
  codeCheckerBaseLink
}) => {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [theme, setTheme] = useState('vs-dark')
  const [open, setOpen] = useState(false)
  const [task, setTask] = useState(null)

  useEffect(() => {
    fetchFiles().then((data) => setTask(data[0]))
  }, [])

  const submitCode = (code) => {
    submit(codeCheckerBaseLink, code, language, task.testsBase64).then((data) =>
      console.log(data)
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
        outerDivStyle={outerMonacoWrapperStyle || { height: '300px' }}
        theme={theme}
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
      <div style={{ marginTop: '2em' }}>{/* Timer */}</div>
      <div style={{ marginTop: '2em' }}>{/* Tests */}</div>
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
        />
      </Drawer>
    </div>
  )
}

MonacoEditorWrapper.propTypes = {
  outerMonacoWrapperStyle: PropTypes.object
}
