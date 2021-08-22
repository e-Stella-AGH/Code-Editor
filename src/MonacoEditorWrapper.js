import React, { useRef } from 'react'
import MonacoEditor from '@uiw/react-monacoeditor'
import PropTypes from 'prop-types'
import { Button } from '@material-ui/core'

export const MonacoEditorWrapper = ({
  language,
  code,
  theme,
  setCode,
  outerDivStyle
}) => {
  const editorRef = useRef(null)

  const color =
    theme === 'vs' ? '#ffffff' : theme === 'vs-dark' ? '#1e1e1e' : '#000000'
  const colorStyle = { backgroundColor: color }

  const editorDidMount = (editor, monaco) => {
    editorRef.current = editor
  }

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
          left: '1em',
          top: '1em'
        }}
      >
        <Button
          variant='contained'
          color='primary'
          onClick={() => {
            setCode(editorRef.current.getValue())
          }}
          fullWidth
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
