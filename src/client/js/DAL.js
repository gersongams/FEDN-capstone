import {getDiffDays, postData, transformDate} from "./helpers";

// Function to get data from the /geoName endpoint
const getGeoNameData = async (location) => {
  try {
    const {data} = await postData('/geoName', {
      location
    })
    return data;
  } catch (e) {
    return null
  }
}

// Function to get data from the /pixabay endpoint
const getImageLocation = async (location) => {
  try {
    const {data} = await postData('/pixabay', {
      location
    })
    return data;
  } catch (e) {
    return null
  }
}

// Function to get data from the /weatherbit endpoint
const getWeatherInfo = async (lat, lng, departing) => {
  let firstDate = new Date(departing);
  const diffDays = getDiffDays(firstDate)
  let lastDate = new Date(departing);
  lastDate.setDate(lastDate.getDate() + 1);

  const startDate = transformDate(firstDate)
  const endDate = transformDate(lastDate)

  try {
    const {data} = await postData('/weatherbit', {
      startDate,
      endDate,
      lat,
      lng,
      diffDays
    })
    return [data, diffDays]
  } catch (e) {
    return null
  }
}

export {
  getGeoNameData,
  getImageLocation,
  getWeatherInfo
}