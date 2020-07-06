import {getDiffDays, postData} from "./helpers";

// Function to save the searched trip
const saveTrip = async (data) => {
  try {
    const res = await postData('/trips', {
      ...data
    })
    const newTripContainer = document.getElementById('newTripContainer')
    newTripContainer.style.display = 'none'
    document.getElementById("location").value = '';
    document.getElementById("departing").value = '';
    renderTrips(res)
  } catch (e) {
    console.log(e)
  }
}

// Function that renders a template card for each trip saved
const TripComponent = (trip) => `
  <div id=${trip.id} class="trip-card trip-card--saved">
     <div class="trip-card__image">
       <img src=${trip.image} alt="location-picture">
     </div>
     <div class="trip-card__information">
       <h3>My trip to: <span>${trip.cityName}, ${trip.countryName}</span></h3>
       <h4>Departing: <span>${trip.departing}</span></h4>
       <div class="trip-card__actions">
         <button data-id=${trip.id} class="btn btn--red">remove trip</button>
       </div>
       <div class="trip-card__wait">${trip.cityName}, ${trip.countryName} is ${getDiffDays(trip.departing)} days away</div>
       <div>
         <div class="trip-card__weather-title">Typical weather for the is</div>
         <div>High - ${trip.highTemperature} , Low - ${trip.lowerTemperature}</div>
         <div>${trip.weather}</div>
       </div>
     </div>
   </div>
`

// Function to remove a trip
const removeTrip = async (id) => {
  try {
    const res = await postData('/deleteTrip', {
      id
    })
    renderTrips(res)
  } catch (e) {
    console.log(e)
  }
};

// Function to render each trip from our database
const renderTrips = (data) => {
  const savedTrips = document.getElementById('savedTrips')
  savedTrips.innerHTML = ''

  savedTrips.addEventListener("click", (e) => {
    e.preventDefault();
    const parent = e.target.hasAttribute("data-id") && e.target
    if (parent) {
      removeTrip(parent.dataset.id)
    }
  });

  data.map(trip => {
    const newTrip = document.createElement('div')
    newTrip.innerHTML = TripComponent(trip)
    savedTrips.appendChild(newTrip)
  })
}

export {
  saveTrip,
  TripComponent,
  removeTrip,
  renderTrips
}