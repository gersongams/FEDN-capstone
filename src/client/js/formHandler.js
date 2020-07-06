import {getGeoNameData, getImageLocation, getWeatherInfo} from "./DAL";
import {saveTrip} from "./trips";

// Function to render the result of search trip
const renderTripCard = (data) => {
  const newTripCard = document.getElementById('newTrip')
  newTripCard.style.display = 'flex'

  const photo = document.getElementById('tripPhoto')
  photo.src = data.image;

  const place = document.getElementById('place')
  place.innerText = `${data.cityName}, ${data.countryName}`;

  const departingDate = document.getElementById('departingDate')
  departingDate.innerText = `${data.departing}`;

  const remainingDays = document.getElementById('remainingDays')
  remainingDays.innerText = `${data.cityName}, ${data.countryName} is ${data.daysRemaining} days away`;

  const weatherMinMax = document.getElementById('weatherMinMax');
  weatherMinMax.innerText = `High - ${data.highTemperature} , Low - ${data.lowerTemperature}`;

  const saveTripButton = document.getElementById('saveTrip');
  saveTripButton.addEventListener('click', function addTrip(event) {
    saveTrip(data)
    saveTripButton.removeEventListener('click', addTrip);
  })

  const removeTripButton = document.getElementById('removeTrip');
  removeTripButton.addEventListener('click', () => {
    newTripCard.style.display = 'none'
  })

  const weatherDescription = document.getElementById('weatherDescription')
  if (!data.weather) {
    weatherDescription.style.display = 'none'
  } else {
    weatherDescription.innerText = `${data.weather}`;
  }
}

// Function to handle the search of the new trip
const formHandler = async event => {
  event.preventDefault();
  let location = document.getElementById("location").value;
  let departing = document.getElementById("departing").value;

  const geoNameData = await getGeoNameData(location);
  if (!geoNameData) {
    alert("Can't find the place");
    return;
  }
  const {countryName, lat, lng, name} = geoNameData.geonames[0];
  const [weatherData, diffDays] = await getWeatherInfo(lat, lng, departing);
  const temperatures = weatherData.data
  const weatherDate = temperatures.find(i => i.datetime === departing);
  const weather = weatherDate ? weatherDate : temperatures[0]
  const {hits} = await getImageLocation(location);
  const bestPhoto = hits.reduce((prev, current) => (+prev.downloads > +current.downloads) ? prev : current)
  const data = {
    countryName,
    cityName: name,
    departing: departing,
    image: bestPhoto.largeImageURL,
    highTemperature: weather.max_temp,
    lowerTemperature: weather.min_temp,
    weather: weather.weather ? weather.weather.description : '',
    daysRemaining: diffDays
  }

  renderTripCard(data)
};

export default formHandler;