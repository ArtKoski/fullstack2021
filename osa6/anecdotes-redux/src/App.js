import React, { useEffect } from 'react'
import AnecdoteList from './components/AnecdoteList'
import NewAnecdote from './components/AnecdoteForm'
import Notification from './components/Notification'
import Filter from './components/Filter'

import { initializeAnecdotes } from './reducers/anecdoteReducer'
import { useDispatch } from 'react-redux'


const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeAnecdotes())
  }, [dispatch])

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <Filter />
      <NewAnecdote />
      <AnecdoteList />
    </div>
  )
}

export default App