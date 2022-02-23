import CountrySelector from "./CountrySelector";
import Highlight from "./Highlight";
import Summary from "./Summary";
import { useEffect, useState } from "react";
import { getCountries, getReportByCountry } from "../../apis/index";
import { sortBy } from "lodash";
import { Alert, Container } from "react-bootstrap";
import axios from "axios";
import moment from "moment";
import "moment/locale/vi";

moment.locale("vi");

function CovidApp() {
  const [countries, setCountries] = useState([]);
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [report, setReport] = useState([]);
  const [error, setError] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const getTime = () => setTime(moment().format("llll"));
    setTimeout(() => getTime(), 1000);
  }, []);

  useEffect(() => {
    getCountries().then((res) => {
      const countries = sortBy(res.data, "Country");
      setCountries(countries);

      setSelectedCountryId("vn");
    });
  }, []);

  const handleSelectCountry = (e) => {
    setSelectedCountryId(e.target.value);
  };

  useEffect(() => {
    setError("");
    if (selectedCountryId) {
      const { Slug } = countries.find(
        (country) => country.ISO2.toLowerCase() === selectedCountryId
      );

      //call api
      if (Slug === "united-states") {
        axios
          .get(
            "https://api.covid19api.com/country/united-states?from=2021-12-01T00:00:00Z&to=2021-12-07T00:00:00Z"
          )
          .then((res) => {
            setReport(res.data);
          });
      } else {
        getReportByCountry(Slug)
          .then((res) => {
            res.data.pop();
            setReport(res.data);
          })
          .catch(() => setError("Failed to load data"));
      }
    }
  }, [countries, selectedCountryId]);

  return (
    <Container className="p-3">
      <h1>SỐ LIỆU COVID-19</h1>
      <p>{time}</p>

      {error && <Alert variant="danger">{error}</Alert>}

      <CountrySelector
        countries={countries}
        handleOnChange={handleSelectCountry}
        value={selectedCountryId}
      />
      <Highlight report={report} />

      <Summary
        report={report}
        selectedCountryId={selectedCountryId}
        setError={setError}
      />
    </Container>
  );
}

export default CovidApp;
