import React, { useState, useEffect } from 'react'
import noteService from './services/notes'
import './index.css'

const Notification = ({ message, classType }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={classType}>
      {message}
    </div>
  )
}

const Note = ( {person} ) => { 
  return (
    person.name + ' ' + person.number
  )}

const Filter = ( {filter, handleFilterChange} ) => {
  return (
    <div>
        <form>
          <p> filter shown with  
            <input value={filter} 
            onChange={handleFilterChange} />
          </p>
        </form>
      </div>
  )

}

const Button = ( {handleClick, text} ) => {
  return (
    <button onClick={handleClick}>
    {text}
    </button>
  )
}

const RemovePerson = ({person, setPersons, persons, setErrorMessage, setSuccessMessage}) => {
  if(window.confirm(`Do you really want to delete ${person.name}?`)) {
  return (
  noteService
  .remove(person.id)
  .then(response => {
      setPersons(persons.filter(unit => unit.id !== person.id))

  setSuccessMessage(
    `Person ${person.name} removed succesfully`
  )
  setTimeout(() => {
    setSuccessMessage(null)
  }, 3000)
  })
    
  .catch(error => {
    setErrorMessage(
      `Note '${person.name}' was already removed from server`
    )
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  })
  )}
} 

const Persons = ( {persons, filter, setPersons, setErrorMessage, setSuccessMessage} ) => {
    return(
      <ul>
      {(filter===undefined) 
      ? persons 
      : persons.filter(person => person.name 
        .toLowerCase()
        .includes(filter.toLowerCase())
      ).map(person => 
        <li key={person.name}>
          <Note person={person} />
          <Button text="delete" handleClick={() => RemovePerson({person, setPersons, persons, setErrorMessage, setSuccessMessage})} />
        </li>
        )}
      </ul>
      )}

const PersonForm = ( {onSubmit, handleNameChange, handleNumberChange, name, number} ) => {
  return (
  <form onSubmit={onSubmit}>
  <div>
    name: <input 
    value={name}
    onChange={handleNameChange} />
  </div>
  <div>
  number: <input 
    value={number}
    onChange={handleNumberChange} />
    </div>
  <div>
    <button type="submit">add</button>
  </div>
  </form>
  )
}

const App = () => {
  const [ persons, setPersons] = useState([
    { name: 'Arto Hellas', 
      number: '045135133'
    }
  ]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter] = useState('')
  const [ errorMessage, setErrorMessage] = useState(null)
  const [ successMessage, setSuccessMessage] = useState(null)


  useEffect(() => {
    noteService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

const handleNameChange = (event) => {
  setNewName(event.target.value)
}
const handleNumberChange = (event) => {
  setNewNumber(event.target.value)
}
const handleFilterChange = (event) => {
  setNewFilter(event.target.value)
}

const nameTaken = () => {
  return(
    persons.map(person => person.name).includes(newName)
  )
}

const addPerson = (event) => {
  event.preventDefault()
  
  const personObject = {
    name: newName,
    number: newNumber
  }
  if(nameTaken()) {
    if(window.confirm(
      `${newName} is already added to the phonebook. Replace the old number with new one?`)) {
        
        const oldPerson = persons.find(person => person.name===newName)
        const changedPerson = { ...oldPerson, number: personObject.number}

        noteService
        .update(oldPerson.id, changedPerson)
        .then(response => {
          setPersons(persons.map(person => person.name !== newName ? person : response.data))
          setNewName('')
          setNewNumber('')
          setSuccessMessage(
            `Person ${personObject.name} updated!`
         )
          setTimeout(() => {
            setSuccessMessage(null)
          }, 3000)  
        })
        .catch(error => {
          setErrorMessage(
            `Person '${personObject.name}' has already been removed from server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  } else {
    noteService
    .create(personObject)
    .then(response => {
      setPersons(persons.concat(response.data))
      setNewName('')
      setNewNumber('')
    })
    setSuccessMessage(
      `Person ${personObject.name} added!`
    )
    setTimeout(() => {
      setSuccessMessage(null)
    }, 3000)
  }
}

  return (
    <div>
      <Notification message={errorMessage} classType="error" />
      <Notification message={successMessage} classType="success" />
      <h1>Phonebook</h1>
      <Filter filter={newFilter} handleFilterChange={handleFilterChange} />
      
      <h1>add a new </h1>
      <PersonForm onSubmit={addPerson} handleNameChange={handleNameChange}
       handleNumberChange={handleNumberChange} name={newName} number={newNumber} />
     
      <h1>Numbers</h1>
      <Persons persons={persons} filter={newFilter} setPersons={setPersons} setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage} />

    </div>
  )

}

export default App