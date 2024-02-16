import React, { useEffect, useState } from "react";
import axios from "axios";

const NewsComp = ({
  headline,
  category,
  datetime,
  image,
  source,
  url,
  summary,
}) => {
  return (
    <div className="text-center px-11">
      <p>Headline : {headline}</p>
      <p>Summary :{summary}</p>
      <p> Category : {category}</p>
      <p>Date: {datetime}</p>
      <img src={image} alt="" width="100" className="mx-auto" />
      <p> Source : {source}</p>
      <p>
        URL : <a href={url}> {url}</a>{" "}
      </p>
    </div>
  );
};

const CompanyInfo = ({
  name,
  symbol,
  logo,
  phone,
  market,
  country,
  ipo,
  webUrl,
}) => {
  return (
    <div className="bg-white p-4 rounded-md shadow-md mb-9">
      <img src={logo} alt={`${name} Logo`} className="mb-4 mx-auto" />
      <h2 className="text-xl font-bold mb-2">{name}</h2>
      <p className="text-gray-500">Country : {country}</p>
      <p className="text-gray-700">Phone : {phone}</p>
      <p className="text-gray-500">Market Capitalization : {market}</p>
      <p className="text-gray-500">IPO : {ipo}</p>
      <p className="text-gray-500">
        WebURL: <a href={webUrl}>{webUrl}</a>{" "}
      </p>
    </div>
  );
};

const Home = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyDetails, setCompanyDetails] = useState({});
  const [companyNews, setCompanyNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);

  const apiKey = "cn7fg29r01qgjtj4j260cn7fg29r01qgjtj4j26g"; // Replace with your actual API key
  const baseUrl = "https://finnhub.io/api/v1";

  useEffect(() => {
    // Fetch company data for 'Apple', 'Google', and 'Microsoft' on component mount
    const symbols = ["AAPL", "GOOGL", "MSFT"];
    Promise.all(symbols.map((symbol) => fetchCompanyData(symbol)))
      .then((data) => setCompanies(data))
      .catch((error) => console.error("Error fetching company data:", error));
  }, []);

  const fetchCompanyData = async (symbol) => {
    try {
      const response = await axios.get(`${baseUrl}/stock/profile2`, {
        params: {
          symbol: symbol,
          token: apiKey,
        },
      });

      return {
        symbol: response.data.ticker,
        name: response.data.name,
        logo: response.data.logo,
      };
    } catch (error) {
      console.error("Error fetching company data:", error);
      throw error;
    }
  };

  const fetchCompanyNews = async (symbol) => {
    try {
      const response = await axios.get(`${baseUrl}/company-news`, {
        params: {
          symbol: symbol,
          token: apiKey,
          from: "2023-08-15",
          to: "2023-08-20",
        },
      });

      setCompanyNews(response.data);
    } catch (error) {
      console.error("Error fetching company news:", error);
    }
  };

  const handleCompanyClick = async (symbol) => {
    console.log(symbol);
    setSelectedCompany(symbol);
    fetchCompanyNews(symbol);
    try {
      const response = await axios.get(`${baseUrl}/stock/profile2`, {
        params: {
          symbol: symbol,
          token: apiKey,
        },
      });

      setCompanyDetails({
        symbol: response.data.symbol,
        name: response.data.name,
        logo: response.data.logo,
        phone: response.data.phone,
        market: response.data.marketCapitalization,
        country: response.data.country,
        ipo: response.data.ipo,
        webUrl: response.data.weburl,
      });
    } catch (error) {
      console.error("Error fetching company details:", error);
    }
  };

  const handleNewsClick = (news) => {
    setSelectedNews(news);
  };

  return (
    <div>
      <h2 className="text-[4rem] font-semibold text-center">Companies</h2>
      <div className="grid grid-cols-3 gap-4 p-4">
        {/* Three grid items within a single row */}
        {companies.map((company) => (
          <div
            className=" bg-gray-200 p-6 text-center shadow-md rounded-mdtext-center mx-auto my-8 uppercase text-[1.5rem]"
            key={company.symbol}
            onClick={() => handleCompanyClick(company.symbol)}
          >
            {company.name}{" "}
            <img
              className="my-5 mx-auto"
              src={company.logo}
              alt={`${company.name} Logo`}
              width="100"
              height="50"
            />
          </div>
        ))}
      </div>

      {selectedCompany && (
        <div className="text-center ">
          <h3 className="">{selectedCompany}</h3>
          <div>
            <p className="text-[1.5rem] font-bold">Company Details</p>
            <CompanyInfo {...companyDetails} />
          </div>

          {/* Display detailed company information here */}

          <h3 className="text-[1.5rem] font-bold mb-4">Company News</h3>

          <div className="grid grid-cols-3 gap-4 p-4">
            {companyNews.map((news, index) => (
              <div
                className="bg-gray-200 p-6 text-center shadow-md rounded-mdtext-center mx-auto px-5  uppercase text-[1rem]"
                key={news.id}
                onClick={() => handleNewsClick(news)}
              >
                {index + 1}. {news.headline}
              </div>
            ))}
            
          </div>
          {selectedNews && (
              <div>
                <h2 className="text-center font-semibold text-[1.5rem] uppercase underline">
                  selected News
                </h2>
                <NewsComp {...selectedNews} />
            
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default Home;
