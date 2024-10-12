"use client";
import React from 'react';
import styles from './CurrencyDropdown.module.scss'; 

interface CurrencyDropdownProps {
  onPairChange: (pair: string) => void;
}

export const CurrencyDropdown: React.FC<CurrencyDropdownProps> = ({ onPairChange }) => {
  const currencyPairs = ['BTC-USD', 'ETH-USD', 'LTC-USD'];

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onPairChange(event.target.value);
  };

  return (
    <div className={styles['currency-dropdown']}>
      <label htmlFor="currencyPair">Select Currency Pair:</label>
      <select id="currencyPair" onChange={handleChange}>
        {currencyPairs.map(pair => (
          <option key={pair} value={pair}>{pair}</option>
        ))}
      </select>
    </div>
  );
};
