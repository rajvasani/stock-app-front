import React, { useState, useEffect, useRef } from "react";

const Stocks = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  const prevStockRef = useRef();

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://localhost:8080/stocks")
        .then((res) => res.json())
        .then(
          (result) => {
            setIsLoaded(true);

            const stocks = [];
            result.map((stock) => {
              stocks.push({
                id: stock.id,
                mid: ((stock.askPrice + stock.bidPrice) / 2).toFixed(2),
              });
            });
            setItems(stocks);
            prevStockRef.current = (
              (result[0].askPrice + result[0].bidPrice) /
              2
            ).toFixed(2);
          },
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const prevStock = prevStockRef.current;

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <ol>
        {items.map((item) => (
          <li key={item.symbol}>
            {item.symbol} {item.mid}{" "}
            {item.mid > prevStock ? <span>UP</span> : <span>DOWN</span>}
          </li>
        ))}
      </ol>
    );
  }
};
export default Stocks;
