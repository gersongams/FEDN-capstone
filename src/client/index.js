import {getTrips, onSearchCountries, setCalendar, showNewTripForm} from "./js/app";
import formHandler from "./js/formHandler";

import "./styles/main.scss";

// Log message to console
getTrips();
showNewTripForm();
setCalendar();
onSearchCountries();


export {setCalendar, formHandler};
