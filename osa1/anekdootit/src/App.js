import React, { useState } from 'react'

const Button = (props) => (
  <button onClick={props.handleClick}>
     {props.text}
  </button>
)

const Headline = props => <h4>{props.text}</h4>

const Display = props => <div>{props.text}</div>

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]
  
  const [votes, setVotes] = useState([0, 0, 0, 0, 0, 0, 0])

  const [selected, setSelected] = useState(0)

  const incrementVote = index => {
    const copy = [...votes]
    copy[index] += 1 
    setVotes(copy)    
  }

  return (
    <div>
      <Headline text="Anecdote of the day" />
      
      <Display text={anecdotes[selected]}/>
      <Display text={'votes: ' + votes[selected]} />
      
      <Button handleClick={() => incrementVote(selected)} text="upvote" />
      <Button handleClick={() => setSelected(Math.floor(Math.random()*anecdotes.length))} text="next anecdote" />
    
      <Headline text="Anecdote with most votes" />
      <Display text={anecdotes[votes.indexOf(Math.max(...votes))]} />
      <Display text={'has ' + votes[votes.indexOf(Math.max(...votes))] + ' votes'} />
    
    </div>
  )
}

export default App