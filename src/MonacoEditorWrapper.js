import React, { useState, useRef, useEffect } from 'react'
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
  
  const getOptions = () => canPublish ? {readOnly: false} : {readOnly: true}

  const editorRef = useRef(null)

  const [options, setOptions] = useState(getOptions(canPublish))
  
  const color =
    theme === 'vs' ? '#ffffff' : theme === 'vs-dark' ? '#1e1e1e' : '#000000'
  const colorStyle = { backgroundColor: color }

  const editorDidMount = (editor, monaco) => {
    editorRef.current = editor
  }

  useEffect(() => {
    setOptions(getOptions(canPublish))
  }, [canPublish])

  useEffect(() => {

    let interval = setInterval(() => {

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
          theme: theme,
          ...options
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
        <div style={{ display: 'flex', flexDirection: 'row', gap: '1em'}}>
          <Button
            variant='contained'
            color='primary'
            onClick={() => {
              setCode(editorRef.current.getValue())
            }}
            fullWidth
            disabled={canSubmit.beforeStart}
          >
            Submit
          </Button>
          <Button
            variant='contained'
            color='primary'
            onClick={takeControl}
            style={{width: '20em'}}
            disabled={canSubmit.beforeStart || canPublish}
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
