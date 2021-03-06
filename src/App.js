import React, { useState, useEffect } from "react";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
  AppBar,
} from "@material-ui/core";
import "./App.css";
import InfoBox from "./Components/InfoBox";
import Map from "./Components/Map";
import Table from "./Components/Table";
import { sortData, prettyPrintStat } from "./util";
import LineGraph from "./Components/LineGraph";
import "leaflet/dist/leaflet.css";
import numeral from "numeral";
import CompleteTable from "./Components/CompleteTable";
import Footer from "./Components/Footer";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 20, lng: 77 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);

  const getCountriesData = async () => {
    await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => ({
          name: country.country,
          value: country.countryInfo.iso2,
        }));

        setCountries(countries);
        const sortedData = sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
      });
  };

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((res) => res.json())
      .then((data) => {
        setCountryInfo(data);
      });

    getCountriesData();
  }, []);

  const onCountryChanage = async (event) => {
    const countryCode = event.target.value;
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);

        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  return (
    <div>
      <AppBar className="bar" position="static">
        <h2>COVID-19 CORONAVIRUS PANDEMIC</h2>
        <p>Last Updated: {Date()}</p>
      </AppBar>
      <div className="app">
        <div className="app__left">
          <div className="app__header">
            <h1>TRACKER</h1>
            <FormControl className="app__dropdown">
              <Select
                variant="outlined"
                onChange={onCountryChanage}
                value={country}
              >
                <MenuItem value="worldwide">WorldWide</MenuItem>
                {countries.map((country) => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="app__stats">
            <InfoBox
              onClick={(e) => setCasesType("cases")}
              active={casesType === "cases"}
              isRed
              title="Coronavirus Cases"
              cases={numeral(countryInfo.todayCases).format("0,0")}
              total={prettyPrintStat(countryInfo.cases)}
            />
            <InfoBox
              onClick={(e) => setCasesType("recovered")}
              active={casesType === "recovered"}
              title="Recovered Cases"
              cases={numeral(countryInfo.todayRecovered).format("0,0")}
              total={prettyPrintStat(countryInfo.recovered)}
            />
            <InfoBox
              onClick={(e) => setCasesType("deaths")}
              active={casesType === "deaths"}
              isRed
              title="Deaths"
              cases={numeral(countryInfo.todayDeaths).format("0,0")}
              total={prettyPrintStat(countryInfo.deaths)}
            />
          </div>

          <Map
            casesType={casesType}
            countries={mapCountries}
            center={mapCenter}
            zoom={mapZoom}
          />
        </div>
        <Card className="app__right">
          <CardContent>
            <div className="app__information">
              <h3>Live Cases by Country</h3>
              <Table countries={tableData} />
              <h3>WorldWide New {casesType} </h3>
              <LineGraph className="app__graph" casesType={casesType} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="app__detail">
        <CompleteTable />
      </div>
      <Footer />
    </div>
  );
}

export default App;
