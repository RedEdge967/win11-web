function getWeather() {
  let temperature = document.getElementById("temperature");
  let description = document.getElementById("description");
  let location = document.getElementById("location");

  let api = "https://api.openweathermap.org/data/2.5/weather";
  let apiKey = "a80bb1050b3413a6b7fee1468c6b3e86";

  location.innerHTML = "Locating...";

  navigator.geolocation.getCurrentPosition(success, error);

  function success(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    let url =
      api +
      "?lat=" +
      latitude +
      "&lon=" +
      longitude +
      "&appid=" +
      apiKey +
      "&units=imperial";

    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        let temp = data.main.temp;
        temperature.innerHTML = temp + "° F";
        location.innerHTML =
          data.name;
        description.innerHTML = data.weather[0].main;
      });
  }

  function error() {
    location.innerHTML = "Unable to retrieve your location";
  }
}

getWeather();
