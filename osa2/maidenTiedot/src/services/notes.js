import axios from 'axios'

const api_key = process.env.REACT_APP_API_KEY
const baseUrl = 'https://restcountries.eu/rest/v2/all'
const weatherUrl = 'http://api.weatherstack.com/current'

const getWeather = country => {
  return axios.get(`${weatherUrl}?access_key=${api_key}&query=${country}`)
}

const getAll = () => {
  return axios.get(baseUrl)
}

const create = newObject => {
  return axios.post(baseUrl, newObject)
}

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject)
}

const remove = id => {
    return axios.delete(`${baseUrl}/${id}`)
}

export default { getWeather, getAll, create, update, remove }