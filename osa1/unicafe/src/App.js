import React, { useState } from 'react'

const StatisticLine = props => <tr><td>{props.text}</td><td>{props.value}</td></tr>

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const Total = (x, y, z) => {
  return (x+y+z)
}

const Avg = (x, y, z) => {
  return ( (x-z) / Total(x,y,z) )
}

const PosPercentage = (x, y, z) => {
  return ( (x / Total(x,y,z)) + " %")
}

const Statistics = ({good, neutral, bad}) => {
if(Total(good, neutral, bad) === 0) {
  return (
    <div>
      Give feedback above!  
    </div>
  )
}

  return (
  <div>
    <table>
      <tbody>
        <StatisticLine value={good} text="good" />
        <StatisticLine value={neutral} text="neutral" />
        <StatisticLine value={bad} text="bad" />

        <StatisticLine value={Total(good,neutral,bad)} text="all" />
        <StatisticLine value={Avg(good, neutral, bad)} text="avg" />
        <StatisticLine value={PosPercentage(good, neutral, bad)} text="positive" />
      </tbody>
    </table>
  </div>
  )
}


const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const increment = (setVariable, current) => {
    setVariable(current + 1)
  }

  return (
    <div>
      <Button handleClick={() => increment(setGood, good)} text="gud" />
      <Button handleClick={() => increment(setNeutral, neutral)} text="neutral" />
      <Button handleClick={() => increment(setBad, bad)} text="bad" />


      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App