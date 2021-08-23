import React, {useState, useEffect} from 'react'
import axios from "axios";

const Filter = ({countryFilter, handleCountryFilterChange}) => {
    return (
        <div>
            Find countries: <input value={countryFilter} onChange={handleCountryFilterChange}/>
        </div>

    )
}

const Countries = ({countries, countryFilter}) => {
    if (countries.length === 1){
        return (
            <CountryDetails country={countries[0]}/>
        )
    }
    else if (countries.length < 10){
        return (
            <div>
                {countries.map(country => <CountryListElement  country={country}/>)}
            </div>
        )
    }
    else{
        return (
            <div>
                <p>Too many matches, specify another filter</p>
            </div>
        )
    }
}

const CountryListElement = ({country}) => {
    const [countryShowingState, setCountryShowState] = useState(false)
    if (countryShowingState){
        return (
            <div>
                {country.name} <button onClick={() => setCountryShowState(!countryShowingState)}>Hide</button>
                <CountryDetails country={country}/>
            </div>
        )
    }
    else{
        return (
            <div>
                <p key={country.name}>{country.name}</p>
                <button onClick={() => setCountryShowState(!countryShowingState)}>Show</button>
            </div>
        )
    }
}

const CountryDetails = ({country}) => {
    console.log(country.languages)
    return (
        <div>
            <h1>{country.name}</h1>
            <p>Capital: {country.capital}</p>
            <p>Population: {country.population}</p>
            <h2>Languages:</h2>
            <ul>
                {country.languages.map(language => <li key={language.name}>{language.name}</li>)}
            </ul>
            <img src={country.flag} alt= {`${country.name} 's flag`} width={100} border="1"/>
            <WeatherDetails capitalName={country.capital}/>
        </div>
    )
}

const WeatherDetails = ({capitalName}) => {
    const weather_api_key = process.env.REACT_APP_API_KEY.toString().replaceAll("'","").trim()
    const url = `http://api.weatherstack.com/current?access_key=${weather_api_key}&query=${capitalName}&units=m`
    console.log(url)
    const [weatherData,setWeatherData] = useState([])
    useEffect(() => {
        axios
            .get(url)
            .then((promise) => {
                setWeatherData(promise.data)
            })
    },[])

    console.log(weatherData)
    if (weatherData.length !== 0){
        return (
            <div>
                <h2>Weather in {capitalName}</h2>
                <h3>Temperature: {weatherData.current.temperature} Celsius</h3>
                <img src={weatherData.current.weather_icons[0]} alt="Current weather icon"/><br/>
                <h3>Wind:</h3>
                    Speed: {weatherData.current.wind_speed} km/h<br/>
                    Direction: {weatherData.current.wind_dir}
            </div>
        )
    }
    else{
        return (
            <div>
                <h2>Weather in </h2>
                <h3>Temperature:  Celsius</h3>
                <h3>Wind:</h3>
                Speed:  km/h<br/>
                Direction: 
            </div>
        )
    }

}

function App() {
    const [countries,setCountries] = useState([])
    const [countryFilter,setCountryFilter] = useState("")


    useEffect(() => {
        axios
            .get("https://restcountries.eu/rest/v2/all")
            .then((promise) =>{
                setCountries(promise.data)
            })
    },[])



    const handleCountryFilterChange = (event) => {
        console.log(event.target.value)
        setCountryFilter(event.target.value)
    }

    return (
        <div>
            <Filter countryFilter={countryFilter} handleCountryFilterChange={handleCountryFilterChange}/>
            <Countries countries={countries.filter(country => country.name.toLowerCase().includes(countryFilter.toLowerCase()))} countryFilter={countryFilter}/>
        </div>
    )
}

export default App;
