import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { likeAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const Anecdotes = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter)

  const sortAnecdotes = (anecdotes) => {
      return anecdotes.sort((a, b) => (b.votes - a.votes))
  }

  const filterAnecdotes = (anecdotes) => {
    return filter===undefined 
    ? anecdotes 
    : anecdotes.filter(dote => dote.content 
      .toLowerCase()
      .includes(filter.toLowerCase()))
  }

  const voteAnecdote = (anecdote) => {
    dispatch(likeAnecdote(anecdote.id))
    dispatch(setNotification(`you voted '${anecdote.content}'`, 3))
  }

  return(
      <div>
      {sortAnecdotes(filterAnecdotes(anecdotes)).map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => voteAnecdote(anecdote)}>vote</button>
          </div>
        </div>
      )}
      </div>
  )
}

export default Anecdotes