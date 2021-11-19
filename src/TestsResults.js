import React from 'react'
import { SingleTestResult } from './SingleTestResult'
import Swal from 'sweetalert2'

export const TestsResults = ({ testResults, state, shouldShowCompilationError, setShouldShowCompilationError }) => {

  const getTestState = (testResult) => {
    if (state === 'Unchecked' || state === 'Pending') {
      return state
    } else {
      return testResult.passed ? 'Passed' : 'Failed'
    }
  }

  const getTestsView = () =>
    testResults.map((testResult) => (
      <SingleTestResult
        testResult={testResult}
        testState={getTestState(testResult)}
        key={testResult.testCaseId}
      />
    ))

  if (testResults.length > 0 && testResults[0].err && shouldShowCompilationError) {
    Swal.fire({
      title: 'Compilation error!',
      text: testResults[0].err,
      icon: 'error',
      allowOutsideClick: false
    }).then(() => setShouldShowCompilationError(false))
  }

  return (
    <div
      style={{
        marginLeft: '5%',
        marginRight: '5%',
        display: 'flex',
        justifyContent: 'space-between'
      }}
    >
      {getTestsView()}
    </div>
  )
}
