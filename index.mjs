import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.API_KEY;
const url = "https://api.weatherbit.io/v2.0/current";

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/weather", async (req, res) => {
  const city = req.query.city;
  const action = req.query.action;

  if (action === "Current") {
    try {
      const respones = await axios.get(url, {
        params: {
          key: apiKey,
          city: city,
        },
      });

      const result = respones.data;

      const {
        temp: weather,
        weather: { icon: icon },
        city_name: city2,
        wind_spd: wind,
        rh: humidity,
      } = result.data[0];

      let iconUrl = `https://www.weatherbit.io/static/img/icons/${icon}.png`;

      res.render("index", { weather, iconUrl, city2, wind, humidity });
    } catch (err) {
      res.render("index", { msg: err.message });
      console.error(err.message);
    }
  } else if (action === "Forecast") {
    try {
      const response = await axios.get(
        "https://api.weatherbit.io/v2.0/forecast/daily",
        {
          params: {
            key: apiKey,
            city: city,
          },
        }
      );

      const result = response.data;
      const cityName = result.city_name;
      const forecast = result.data;

      const forecastData = [];
      const dayBtnChoose = [];

      for (let i = 1; i <= 5; i++) {
        const day = forecast[i].datetime;
        const date = new Date(day);
        const dayName = dayNames[date.getDay()];
        const {
          temp: weather,
          weather: { icon: icon },
          wind_spd: wind,
          rh: humidity,
        } = forecast[i];

        let iconUrl = `https://www.weatherbit.io/static/img/icons/${icon}.png`;

        forecastData.push({
          dayName,
          weather,
          iconUrl,
          wind,
          humidity,
          cityName,
        });
      }
      for (let i = 1; i <= 5; i++) {
        const d = forecast[i].datetime;
        let dayBtn = new Date(d);
        dayBtnChoose.push(dayNames[dayBtn.getDay()]);
      }

      res.render("index", {
        forecastData,
        cityName,
        dayBtnChoose,
      });
    } catch (error) {
      console.error(error);
      res.render("error", { message: "Failed to fetch forecast data." });
    }
  }
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
