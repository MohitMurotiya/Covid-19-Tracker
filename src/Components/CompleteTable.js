import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import { sortData } from "../util";

function CompleteTable() {
  const [countries, setCountries] = useState([]);

  const getCountriesData = async () => {
    await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const sortedData = sortData(data);
        setCountries(sortedData);
      });
  };

  useEffect(() => {
    getCountriesData();
  }, []);

  const [column, setColumn] = useState([
    {
      title: "Flag",
      field: "flag",
      render: (country) => (
        <img src={country.countryInfo.flag} style={{ width: 40 }} />
      ),
      width: 100,
    },
    {
      title: "Country",
      field: "country",
      cellStyle: {
        color: "#01579B",
      },
      width: 100,
    },
    { title: "Total Cases", field: "cases", width: 100 },
    {
      title: "New Cases",
      field: "todayCases",
      cellStyle: {
        color: "#FF0000",
      },
      width: 100,
    },
    { title: "Total Deaths", field: "deaths", width: 100 },
    {
      title: "New Deaths",
      field: "todayDeaths",
      cellStyle: {
        color: "#FF0000",
      },
      width: 100,
    },
    {
      title: "Total Recovered",
      field: "recovered",
      cellStyle: {
        color: "#008000",
      },
      width: 100,
    },
    { title: "Today Recovered", field: "todayRecovered", width: 100 },
    { title: "Active Cases", field: "active", width: 100 },
    { title: "Critical", field: "critical", width: 100 },
    { title: "Cases/ 1M_Pop", field: "casesPerOneMillion", width: 100 },
    { title: "Deaths/ 1M_Pop", field: "deathsPerOneMillion", width: 100 },
    { title: "Total Tests", field: "tests", width: 100 },
    { title: "Tests/ 1M_Pop", field: "testsPerOneMillion", width: 100 },
    { title: "1_Case/ People", field: "oneCasePerPeople", width: 100 },
    { title: "1_Death/ People", field: "oneDeathPerPeople", width: 100 },
    { title: "Population", field: "population", width: 100 },
    { title: "Continent", field: "continent", width: 100 },
  ]);
  return (
    <div>
      <MaterialTable
        title="Reported Coronavirus Cases and Deaths by Country"
        columns={column}
        data={countries}
        options={{
          headerStyle: {
            backgroundColor: "#01579b",
            color: "#FFF",
          },
          fixedColumns: {
            left: 1,
          },
          exportButton: true,
        }}
      />
    </div>
  );
}

export default CompleteTable;
