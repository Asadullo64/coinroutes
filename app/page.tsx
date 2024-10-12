"use client";

import React, { useEffect, useState } from "react";
import { subscribeToOrderBook } from "@/service/websocket";
import { CurrencyDropdown, PriceChart, TradePanel } from "@/src/components";

interface OrderBookData {
  type: string;
  price: string;
}

const HomePage: React.FC = () => {
  const [currencyPair, setCurrencyPair] = useState("BTC-USD"); // Начальная валютная пара
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  const handlePairChange = (pair: string) => {
    setCurrencyPair(pair);
  };

  useEffect(() => {
    const unsubscribe = subscribeToOrderBook(currencyPair, (data: OrderBookData) => {
      if (data.type === 'ticker') {
        const price = parseFloat(data.price);
        setCurrentPrice(price);
      }
    });
  
    return () => {
      unsubscribe();
    };
  }, [currencyPair]);

  return (
    <div className="container">
      <h1>Crypto Data Dashboard</h1>
      <CurrencyDropdown onPairChange={handlePairChange} />
      <TradePanel currencyPair={currencyPair} />
      <div>
        <h2>
          Current Price: $
          {currentPrice
            ? currentPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
            : "..."}
        </h2>
      </div>
      <PriceChart currencyPair={currencyPair} />
    </div>
  );
};

export default HomePage;
