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
  shareCodeUtils,
  takeControl,
  canPublish
}) => {
  const editorRef = useRef(null)

  const color =
    theme === 'vs' ? '#ffffff' : theme === 'vs-dark' ? '#1e1e1e' : '#000000'
  const colorStyle = { backgroundColor: color }

  const editorDidMount = (editor, monaco) => {
    editorRef.current = editor
  }

  useEffect(() => {

    let interval = setInterval(() => {

      console.log(canPublish)
      if(canPublish) {
        shareCodeUtils?.pub(JSON.stringify({ id: shareCodeUtils?.id, message: editorRef?.current?.getValue() }))
      }
      
    }, shareCodeUtils?.codeSharingInterval || 2000)

    return () => clearInterval(interval)
  }, [canPublish])

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
          top: `${1 + absoluteOffset.submit.top}em`,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'row'}}>
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
          <Button
            variant='contained'
            color='primary'
            onClick={takeControl}
            style={{width: '20em'}}
            disabled={canSubmit.beforeStart || canSubmit.overDeadline}
          >
            Take Control
          </Button>
        </div>
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
