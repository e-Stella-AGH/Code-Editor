import React, { useEffect, useState } from 'react'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import './styles.css'
import { Button } from '@material-ui/core'

const secondsInMinute = 60
const secondsInHour = 3600
const secondsInDay = 86400

const timerProps = (isPlaying) => {
  return {
    isPlaying,
    size: 150,
    strokeWidth: 6
  }
}

const renderTime = (dimension, time) => {
  return (
    <div
      style={{
        fontFamily: 'sans-serif',
        fontSize: '24px',
        textAlign: 'center'
      }}
    >
      <div>{time}</div>
      <div>{dimension}</div>
    </div>
  )
}

const getTimeSeconds = (time) => (secondsInMinute - time) | 0
const getTimeMinutes = (time) => ((time % secondsInHour) / secondsInMinute) | 0
const getTimeHours = (time) => ((time % secondsInDay) / secondsInHour) | 0

export const Timers = ({ timeLimit, isRunning, onStart, onEnd, canSubmit, startButtonRef }) => {
  const [time, setTime] = useState({
    isPlaying: isRunning,
    remainingTime: timeLimit / 1000
  })

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '1em' }}>
        <Button
          color='primary'
          variant='contained'
          disabled={time.isPlaying || canSubmit.overDeadline}
          size='large'
          onClick={() => {
            setTime({ ...time, isPlaying: true })
            onStart()
          }}
          ref={startButtonRef}
        >
          Start
        </Button>
      </div>
      <div
        style={{
          display: 'flex',
          marginLeft: '32%',
          marginRight: '32%',
          justifyContent: 'space-between'
        }}
      >
        <CountdownCircleTimer
          {...timerProps(time.isPlaying)}
          duration={secondsInDay}
          colors={[['#D14081']]}
          initialRemainingTime={time.remainingTime % secondsInDay}
          onComplete={(totalElapsedTime) => [
            time.remainingTime - totalElapsedTime > secondsInHour
          ]}
        >
          {({ elapsedTime }) =>
            renderTime('hours', getTimeHours(secondsInDay - elapsedTime))
          }
        </CountdownCircleTimer>
        <CountdownCircleTimer
          {...timerProps(time.isPlaying)}
          colors={[['#EF798A']]}
          duration={secondsInHour}
          initialRemainingTime={time.remainingTime % secondsInHour}
          onComplete={(totalElapsedTime) => {
            onEnd()
            return [time.remainingTime - totalElapsedTime > secondsInMinute]
          }}
        >
          {({ elapsedTime }) =>
            renderTime('minutes', getTimeMinutes(secondsInHour - elapsedTime))
          }
        </CountdownCircleTimer>
        <CountdownCircleTimer
          {...timerProps(time.isPlaying)}
          colors={[['#218380']]}
          duration={secondsInMinute}
          initialRemainingTime={time.remainingTime % secondsInMinute}
          onComplete={(totalElapsedTime) => [
            time.remainingTime - totalElapsedTime > 0
          ]}
        >
          {({ elapsedTime }) =>
            renderTime('seconds', getTimeSeconds(elapsedTime))
          }
        </CountdownCircleTimer>
      </div>
    </div>
  )
}
