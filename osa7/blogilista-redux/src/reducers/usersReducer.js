import userService from '../services/users'

const usersReducer = (state = [], action) => {
  switch (action.type) {
  case 'SET_USERS':
    return action.user
  case 'INIT_USERS':
    return action.data
  default:
    return state
  }
}

export const setUsers = ( users ) => {
  return async dispatch => {
    dispatch({
      type: 'SET_USERS',
      users,
    })
  }
}

export const initializeUsers = () => {
  return async dispatch => {
    const users = await userService.getAll()
    dispatch({
      type: 'INIT_USERS',
      data: users,
    })
  }
}

export default usersReducer