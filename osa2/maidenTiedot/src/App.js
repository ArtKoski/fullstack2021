import React, { useState, useEffect } from 'react'
import noteService from './services/notes'

const Filter = ( {filter, handleFilterChange} ) => {
  return (
    <div>
        <form>
          <p> find countries  
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

const CountryLanguages = ( {list} ) => {
  return (
  <ul>
    {list.map(country => country.languages)[0].map(languages => <li>{languages.name}</li>)}
  </ul>
)
}

const Countries = ( {countries, filter, setFilter, setWeather, weather} ) => {

      const list = (filter===undefined) 
      ? countries 
      : countries.filter(country => country.name 
        .toLowerCase()
        .includes(filter.toLowerCase())
      )
      
      if(list.length>10) {
      return (
        <div>too many matches, be more specific </div>
      )
    } else if(list.length === 1) {
      return(
        <div>
          {list.map(country => 
          <div>
          <h4>{country.name}</h4>
          <p> capital {country.capital} </p>
          <p> population {country.population} </p>
          <h3>languages</h3>
          <CountryLanguages list={list} />
          <div>
          <img src={`${country.flag}`} width='10%' />
          </div>
          </div>

          )}

        </div>
        )}
      
    else {
      return(
      <ul>
        {list.map(country =><li key={country.name}> {country.name} <Button handleClick={() => setFilter(country.name)} text='show'/></li>)}   
      </ul>
      )
    }
}


const App = () => {
  const [ country, setCountries] = useState([
  ]) 

  //const [ newWeather, setNewWeather ] = useState([])
  const [ newFilter, setNewFilter ] = useState('')

  useEffect(() => {
    noteService
      .getAll()
      .then(response => {
        setCountries(response.data)
      })
  }, [])
/*
  useEffect(country => {
    noteService
      .getWeather(country)
      .then(response => {
        setNewWeather(response.data)
      })
  }, [])

const handleWeatherChange = (event) => {
  setNewWeather(event.target.value)
}*/
const handleFilterChange = (event) => {
  setNewFilter(event.target.value)
}

  return (
    <div>
      <h2>Search</h2>
      <Filter filter={newFilter} handleFilterChange={handleFilterChange} />
      
      <h2>Countries</h2>
      <Countries countries={country} filter={newFilter} setFilter={setNewFilter}/* setWeather={setNewWeather} weather={newWeather}*/ />

    </div>
  )

}

export default App