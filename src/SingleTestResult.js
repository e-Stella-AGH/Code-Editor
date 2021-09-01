import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  CircularProgress
} from '@material-ui/core'
import PropTypes from 'prop-types'
import {
  CircularProgressbar,
  CircularProgressbarWithChildren,
  buildStyles
} from 'react-circular-progressbar'
import CheckIcon from '@material-ui/icons/Check'
import CloseIcon from '@material-ui/icons/Close'

export const SingleTestResult = ({ testResult, testState }) => {
  const getTestIcon = () => {
    switch (testState) {
      case 'Unchecked':
        return (
          <CircularProgressbar
            value={100}
            styles={buildStyles({
              pathColor: '#3f3f3f'
            })}
          />
        )
      case 'Pending':
        return <CircularProgress />
      case 'Passed':
        return (
          <CircularProgressbarWithChildren
            value={100}
            styles={buildStyles({
              pathColor: '#249225'
            })}
          >
            <div style={{ marginTop: -5 }}>
              <CheckIcon fontSize='large' />
            </div>
          </CircularProgressbarWithChildren>
        )
      case 'Failed':
        return (
          <CircularProgressbarWithChildren
            value={100}
            styles={buildStyles({
              pathColor: '#b01030'
            })}
          >
            <div style={{ marginTop: -5 }}>
              <CloseIcon fontSize='large' />
            </div>
          </CircularProgressbarWithChildren>
        )
    }
  }

  return (
    <Card>
      <CardContent
        style={{
          backgroundColor: '#DFE4E3',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: '1em',
          paddingRight: '1em',
          width: '20em'
        }}
      >
        <Typography variant='h6'>Test {testResult?.testCaseId}</Typography>
        <div style={{ width: '40px', height: '40px' }}>{getTestIcon()}</div>
      </CardContent>
    </Card>
  )
}

SingleTestResult.propTypes = {
  testState: PropTypes.oneOf(['Passed', 'Failed', 'Pending', 'Unchecked'])
}
