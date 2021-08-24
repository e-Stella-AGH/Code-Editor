import React from 'react'
import { SingleTestResult } from './SingleTestResult'

export const TestsResults = ({ testResults, state }) => {
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
