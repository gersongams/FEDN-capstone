import {getData} from "./helpers";
import {renderTrips} from "./trips";

// Function is to disable all the past dates of the calendar
const setCalendar = () => {
  document.getElementById('departing').min = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0];
};

// Function to debounce the input
const debounced = (delay, fn) => {
  let timerId;
  return function (...args) {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      fn(...args);
      timerId = null;
    }, delay);
  }
};

// Function to get all the trips from the backend
const getTrips = async () => {
  try {
    const res = await getData('/trips')
    renderTrips(res)
  } catch (e) {
    console.log(e)
  }
};

// Function that shows the form to add a new trip
const showNewTripForm = () => {
  document.getElementById('newTripBtn').addEventListener('click', () => {
    document.getElementById('newTripContainer').style.display = 'flex';
    document.getElementById('newTrip').style.display = 'none'
  })

  document.getElementById('closeNewTrip').addEventListener('click', () => {
    document.getElementById('newTrip').style.display = 'none'
    document.getElementById('newTripContainer').style.display = 'none';
    document.getElementById("location").value = '';
    document.getElementById("departing").value = '';
  })
}

// Function to get a list of countries from the restcountries API
const getCountries = async (name) => {
  const countriesEndpoint = `https://restcountries.eu/rest/v2/name/${name}`
  try {
    const res = await fetch(countriesEndpoint)
    const response = await res.json()
    if(response.status === 404) {
      return []
    }
    return response
  } catch (e) {
    return []
  }
}

// Function that sets a listener for the search of countries
const onSearchCountries = () => {
  document.getElementById('location').addEventListener('input', debounced(300, async (e) => {
    const countries = await getCountries(e.target.value)
    const countriesOptions = document.getElementById('countries')
    countriesOptions.innerHTML = ""
    countries.forEach(country => {
      const option = document.createElement('option')
      option.value = country.name;
      countriesOptions.appendChild(option)
    })
  }))
}

export {setCalendar, getTrips, showNewTripForm, onSearchCountries,getCountries};
