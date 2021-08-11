let timer

const notificationReducer = (state = '', action) => {
    switch (action.type) {
      case 'SET_NOTIF':
        return action.notification  
      case 'EMPTY':
          return ''
      default:
        return state
    }
  }

  export const setNotification = ( notification, time) => {
      
    return async dispatch => {
        
        dispatch({
            type: 'SET_NOTIF',
            notification,
            })
        
        clearTimeout(timer)
        timer = setTimeout(() => {
                dispatch(empty(''))
        }, time*1000) 
    } 
} 

  export const empty = notification => {
    return {
      type: 'EMPTY',
      notification,
    }
  }
  
  export default notificationReducer