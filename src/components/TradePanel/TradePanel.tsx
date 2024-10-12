"use client";
import React, { useState, useEffect } from 'react';
import { subscribeToOrderBook } from '@/service/websocket';
import styles from './TradePanel.module.scss';

// Определение интерфейсов
interface Trade {
  type: 'buy' | 'sell';
  price: number;
  size: number;
  time: string;
  status: 'open' | 'closed';
}

export const TradePanel: React.FC<{ currencyPair: string }> = ({ currencyPair }) => {
  const [price, setPrice] = useState('');
  const [size, setSize] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceHistory, setPriceHistory] = useState<number[]>([]);
  const [tradeStatus, setTradeStatus] = useState<string | null>(null);
  const [recommendedStopLoss, setRecommendedStopLoss] = useState<number | null>(null);
  const [recommendedTakeProfit, setRecommendedTakeProfit] = useState<number | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [deposit, setDeposit] = useState<number>(10000);

  useEffect(() => {
    const unsubscribe = subscribeToOrderBook(currencyPair, (data: any) => {
      if (data.type === 'ticker') {
        const price = parseFloat(data.price);
        setCurrentPrice(price);
        setPriceHistory((prevHistory) => [...prevHistory, price]);

        // Определение рекомендаций для стоп-лосса и тейк-профита
        if (priceHistory.length > 1) {
          const lastPrice = priceHistory[priceHistory.length - 1];
          const secondLastPrice = priceHistory[priceHistory.length - 2];

          setRecommendedTakeProfit(lastPrice > secondLastPrice ? lastPrice * 1.01 : lastPrice * 1.01);
          setRecommendedStopLoss(lastPrice > secondLastPrice ? lastPrice * 0.99 : lastPrice * 0.98);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [currencyPair, priceHistory]);

  const handleBuy = () => {
    const totalCost = parseFloat(price) * parseFloat(size);

    if (!currentPrice) {
      setTradeStatus('Current price is not available.');
      return;
    }

    if (!size || isNaN(totalCost) || totalCost <= 0) {
      setTradeStatus('Invalid size entered.');
      return;
    }

    if (totalCost <= deposit) {
      const timestamp = new Date().toLocaleTimeString();
      const newTrade: Trade = {
        type: 'buy',
        price: parseFloat(price),
        size: parseFloat(size),
        time: timestamp,
        status: 'open',
      };
      setTrades((prevTrades) => [...prevTrades, newTrade]);
      setDeposit((prevDeposit) => prevDeposit - totalCost);
      setTradeStatus(`Buy order placed at ${price}`);
    } else {
      setTradeStatus('Insufficient funds to buy');
    }
  };

  const handleSell = () => {
    const totalProceeds = parseFloat(price) * parseFloat(size);

    if (!currentPrice) {
      setTradeStatus('Current price is not available.');
      return;
    }

    if (!size || isNaN(totalProceeds) || totalProceeds <= 0) {
      setTradeStatus('Invalid size entered.');
      return;
    }

    const timestamp = new Date().toLocaleTimeString();
    const newTrade: Trade = {
      type: 'sell',
      price: parseFloat(price),
      size: parseFloat(size),
      time: timestamp,
      status: 'open',
    };
    setTrades((prevTrades) => [...prevTrades, newTrade]);
    setDeposit((prevDeposit) => prevDeposit + totalProceeds);
    setTradeStatus(`Sell order placed at ${price}`);
  };

  const handleCloseTrade = (index: number) => {
    const trade = trades[index];
    if (trade.status === 'open') {
      let profitOrLoss = 0;

      if (trade.type === 'buy') {
        profitOrLoss = (currentPrice || 0) - trade.price;
      } else {
        profitOrLoss = trade.price - (currentPrice || 0);
      }

      setDeposit((prevDeposit) => prevDeposit + profitOrLoss * trade.size);
      const updatedTrades = [...trades];
      updatedTrades[index].status = 'closed';
      setTrades(updatedTrades);
      setTradeStatus(`Trade closed at ${currentPrice}`);
    }
  };

  const getTradeColor = (trade: Trade) => {
    if (currentPrice !== null) {
      if (trade.type === 'buy' && currentPrice > trade.price) {
        return styles.tradePanel__tradeItem_profit;
      } else if (trade.type === 'sell' && currentPrice < trade.price) {
        return styles.tradePanel__tradeItem_profit;
      } else {
        return styles.tradePanel__tradeItem_loss;
      }
    }
    return styles.tradePanel__tradeItem_neutral;
  };

  return (
    <div className={styles.tradePanel}>
      <h3 className={styles.tradePanel__header}>Trade Panel</h3>

      <div className={styles.tradePanel__inputGroup}>
        <label className={styles.tradePanel__label}>Price:</label>
        <input
          type="text"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className={styles.tradePanel__input}
        />
      </div>

      <div className={styles.tradePanel__inputGroup}>
        <label className={styles.tradePanel__label}>Size:</label>
        <input
          type="text"
          placeholder="Size"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className={styles.tradePanel__input}
        />
      </div>

      <div className={styles.tradePanel__inputGroup}>
        <label className={styles.tradePanel__label}>Stop Loss:</label>
        <input
          type="text"
          placeholder="Stop Loss"
          value={stopLoss}
          onChange={(e) => setStopLoss(e.target.value)}
          className={styles.tradePanel__input}
        />
        {recommendedStopLoss && (
          <p className={styles.tradePanel__recommendation}>Recommended Stop Loss: {recommendedStopLoss.toFixed(2)}</p>
        )}
      </div>

      <div className={styles.tradePanel__inputGroup}>
        <label className={styles.tradePanel__label}>Take Profit:</label>
        <input
          type="text"
          placeholder="Take Profit"
          value={takeProfit}
          onChange={(e) => setTakeProfit(e.target.value)}
          className={styles.tradePanel__input}
        />
        {recommendedTakeProfit && (
          <p className={styles.tradePanel__recommendation}>Recommended Take Profit: {recommendedTakeProfit.toFixed(2)}</p>
        )}
      </div>

      <div className={styles.tradePanel__buttons}>
        <button onClick={handleBuy} className={`${styles.tradePanel__button} ${styles.tradePanel__button_buy}`}>Buy</button>
        <button onClick={handleSell} className={`${styles.tradePanel__button} ${styles.tradePanel__button_sell}`}>Sell</button>
      </div>

      <div className={styles.tradePanel__status}>
        <h4>Current Price: ${currentPrice ? currentPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : 'Waiting for data...'}</h4>
        {tradeStatus && <p>{tradeStatus}</p>}
      </div>

      <div className={styles.tradePanel__trades}>
        <h4>Open Trades:</h4>
        <ul className={styles.tradePanel__tradeList}>
          {trades.map((trade, index) => (
            <li key={index} className={`${styles.tradePanel__tradeItem} ${getTradeColor(trade)}`}>
              <span>{trade.type} @ {trade.price} - {trade.size} units</span>
              <span>Time: {trade.time}</span>
              {trade.status === 'open' && (
                <button className={styles.tradePanel__tradesBtn} onClick={() => handleCloseTrade(index)}>Close Trade</button>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.tradePanel__deposit}>
        <h4>Current Deposit: ${deposit.toFixed(1)}</h4>
      </div>
    </div>
  );
};
