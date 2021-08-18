/* eslint-disable no-unused-vars */

import React from 'react'
import { useSelector } from 'react-redux'
import { Alert } from 'react-bootstrap'

const Notification = ( { classType } ) => {

  let notification = useSelector(state => state.notification)

  if(notification === '') {
    return null
  }

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  return (
    <Alert variant={classType}>
      {notification}
    </Alert>
  )
}

export default Notification