import React from 'react'
import ReactMarkdown from 'react-markdown'
import { AutocompleteWrapper } from './AutocompleteWrapper'
import { decodeFile } from './utils'

export const OptionsDrawer = ({ task, language, setLanguage, setTheme, theme }) => {
  const languageOptions = [
    'python',
    'javascript',
    'cpp',
    'kotlin',
    'java',
    'c',
    'plaintext'
  ]

  const themeOptions = ['vs', 'vs-dark', 'hc-black']

  const checkIfMarkdown = (fileName) => {
    return fileName?.indexOf('.md') !== -1
  }

  return (
    <div
      style={{
        marginTop: '2em',
        width: '700px',
        padding: '5%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <div
        style={{
          backgroundColor: '#F5F5F5',
          textAlign: 'left',
          padding: '1em',
          width: '80%'
        }}
      >
        {checkIfMarkdown(task.descriptionFileName) ? (
          <ReactMarkdown>{decodeFile(task.descriptionBase64)}</ReactMarkdown>
        ) : (
          decodeFile(task.descriptionBase64)
        )}
      </div>
      <AutocompleteWrapper
        defaultValue={language}
        label='Language'
        options={languageOptions}
        onSelect={(value) => {
          if (value) setLanguage(value)
        }}
      />
      <AutocompleteWrapper
        defaultValue={theme}
        label='Theme'
        options={themeOptions}
        onSelect={(value) => {
          if (value) setTheme(value)
        }}
      />
    </div>
  )
}
