const dotenv = require("dotenv");
dotenv.config();

const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 8080;
const hostname = process.env.HOST || "localhost";

const geoNameApiUserName = process.env.username;
const pixabayApiKey = process.env.pixabaykey;
const weatherbitApi = process.env.weatherbit_api;

let tripData = [
  {
    countryName: "France",
    cityName: "Paris",
    departing: "2020-07-29",
    image:
      "https://pixabay.com/get/5ee4d641485bb108f5d084609629307f163ddae3514c704c7c2c72d69e4cc15e_1280.jpg",
    highTemperature: 25.3,
    lowerTemperature: 15.3,
    weather: "",
    daysRemaining: 24,
    id: "096290ca-9ff6-47b3-9613-d2d5d05b49b1",
  },
];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());
app.use(express.static("dist"));

const dateTransform = (startDate, endDate, diffDays) => {
  const startSplitted = startDate.split("-");
  const endSplitted = endDate.split("-");
  startSplitted[0] = "2019";
  endSplitted[0] = "2019";

  return diffDays < 16
    ? [startDate, endDate]
    : [startSplitted.join("-"), endSplitted.join("-")];
};

app.post("/geoName", (req, res) => {
  const params = {
    maxRows: 10,
    username: geoNameApiUserName,
    q: req.body.location,
  };

  axios
    .get("http://api.geonames.org/searchJSON", {
      params: { ...params },
    })
    .then((resp) => {
      res.send({ success: true, data: resp.data });
    })
    .catch((e) => {
      console.log(e);
      res.send({ success: false, error: JSON.stringify(e) });
    });
});

app.post("/pixabay", (req, res) => {
  axios
    .get("https://pixabay.com/api/", {
      params: {
        q: req.body.location,
        key: pixabayApiKey,
        image_type: "photo",
        category: "travel",
      },
    })
    .then((resp) => {
      res.send({ success: true, data: resp.data });
    })
    .catch((e) => {
      console.log(e);
      res.send({ success: false, error: JSON.stringify(e) });
    });
});

app.post("/weatherbit", (req, res) => {
  const { diffDays, lat, lng, startDate, endDate } = req.body;
  let url;
  if (diffDays < 16) {
    url = `https://api.weatherbit.io/v2.0/forecast/daily`;
  } else {
    url = `https://api.weatherbit.io/v2.0/history/daily`;
  }

  const [start, end] = dateTransform(startDate, endDate, diffDays);

  axios
    .get(url, {
      params: {
        lat: lat,
        lon: lng,
        start_date: start,
        end_date: end,
        units: "M",
        key: weatherbitApi,
      },
    })
    .then((resp) => {
      res.send({ success: true, data: resp.data });
    })
    .catch((e) => {
      console.log(e);
      res.send({ success: false, error: JSON.stringify(e) });
    });
});

// Get all trips
app.get("/trips", (req, res) => {
  const sortedTrips = tripData
    .slice()
    .sort((a, b) => new Date(a.departing) - new Date(b.departing));

  res.status(200).send(sortedTrips);
});

// Add a new trip
app.post("/trips", (req, res) => {
  tripData.push({
    ...req.body,
    id: uuidv4(),
  });
  res.status(200).send(tripData);
});

// Add a new trip
app.post("/deleteTrip", (req, res) => {
  const { id } = req.body;
  tripData = tripData.filter((trip) => trip.id !== id);
  res.status(200).send(tripData);
});

app.get("/", function (req, res) {
  res.sendFile("dist/index.html");
  // res.sendFile(path.resolve("src/client/views/index.html"));
});

// designates what port the app will listen to for incoming requests
app.listen(PORT, function () {
  console.log(`Server running at http://${hostname}:${PORT}/`);
});
