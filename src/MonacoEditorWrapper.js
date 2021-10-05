import React, { useRef, useEffect } from 'react'
import MonacoEditor from '@uiw/react-monacoeditor'
import PropTypes from 'prop-types'
import { Button } from '@material-ui/core'

export const MonacoEditorWrapper = ({
  language,
  code,
  theme,
  setCode,
  outerDivStyle,
  canSubmit,
  absoluteOffset,
  shareCodeUtils
}) => {
  const editorRef = useRef(null)

  const color =
    theme === 'vs' ? '#ffffff' : theme === 'vs-dark' ? '#1e1e1e' : '#000000'
  const colorStyle = { backgroundColor: color }

  const editorDidMount = (editor, monaco) => {
    editorRef.current = editor
  }

  console.log("code:", code)

  useEffect(() => {

    let interval = setInterval(() => {
      
      shareCodeUtils?.pub(JSON.stringify({ id: shareCodeUtils?.id, code: editorRef?.current?.getValue() }))
      
    }, shareCodeUtils?.codeSharingInterval || 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ ...outerDivStyle, padding: '4em', ...colorStyle }}>
      <MonacoEditor
        language={language}
        value={code}
        options={{
          theme: theme
        }}
        editorDidMount={editorDidMount}
      />
      <div
        style={{
          position: 'absolute',
          left: `${1 + absoluteOffset.submit.left}em`,
          top: `${1 + absoluteOffset.submit.top}em`
        }}
      >
        <Button
          variant='contained'
          color='primary'
          onClick={() => {
            setCode(editorRef.current.getValue())
          }}
          fullWidth
          disabled={canSubmit.beforeStart || canSubmit.overDeadline}
        >
          Submit
        </Button>
      </div>
    </div>
  )
}

MonacoEditorWrapper.propTypes = {
  code: PropTypes.string,
  language: PropTypes.string.isRequired,
  setCode: PropTypes.func.isRequired,
  theme: PropTypes.string.isRequired,
  outerDivStyle: PropTypes.object
}
