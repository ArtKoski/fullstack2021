import anecdoteService from '../services/anecdotes'


const reducer = (state = [], action) => {
  switch(action.type) {
    case 'LIKE':
      const id = action.data
      const doteToChange = state.find(n => n.id === id)
      const changedDote = {
        ...doteToChange, votes: ( doteToChange.votes + 1 ) 
      }
      return state.map(dote => dote.id !== id ? dote : changedDote)
    
    case 'NEW_DOTE':
      const updatedState = state.concat(action.data)
      return updatedState

    case 'INIT_ANECDOTES':
      return action.data  
    
    default:
      return state
  }
}

export const likeAnecdote = (id) => {
  
  return async dispatch => {
  const anecdote = await anecdoteService.getOne(id)
  const updatedAnecdote = {...anecdote, votes: (anecdote.votes + 1)}
  const response = await anecdoteService.update(updatedAnecdote.id, updatedAnecdote) 
  dispatch ({
    type: 'LIKE',
    data: response.id 
  })
}
}

export const createAnecdote = (content) => {
  return async dispatch => {
    
  const newAnecdote = await anecdoteService.createNew(content) 
  dispatch ({
    type: 'NEW_DOTE',
    data: {
      content: newAnecdote.content,
      votes: newAnecdote.votes,
      id: newAnecdote.id
    }
  })
}
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'INIT_ANECDOTES',
      data: anecdotes,
  })
}
}

export default reducer