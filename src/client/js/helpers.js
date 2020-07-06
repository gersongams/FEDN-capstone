// Helper function to handle a post request
const postData = async (url = "", data = {}) => {
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  try {
    return await response.json();
  } catch (error) {
    console.error("error", error);
  }
};

// Helper function to handle a get request
const getData = async (url = "") => {
  const response = await fetch(url, {
    method: "GET",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
  });

  try {
    return await response.json();
  } catch (error) {
    console.error("error", error);
  }
};

// Helper function to transform the dates
const transformDate = (date) => {
  return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`
}

// Helper function to get the remaining dates until the selected date
const getDiffDays = (date) => {
  let today = new Date()
  let selectedDate = new Date(date);

  const diffTime = Math.abs(selectedDate - today);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}


export {
  postData,
  transformDate,
  getDiffDays,
  getData,
}