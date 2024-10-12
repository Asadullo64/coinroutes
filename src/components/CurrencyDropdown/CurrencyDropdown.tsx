// // components/CurrencyDropdown.tsx
// "use client"
// import React, { useState } from 'react';

// export const CurrencyDropdown: React.FC<{ onPairChange: (pair: string) => void }> = ({ onPairChange }) => {
//   const [selectedPair, setSelectedPair] = useState('BTC-USD');
  
//   // Обновленный список поддерживаемых пар в песочнице
//   const pairs = ['BTC-USD', 'ETH-BTC', 'LINK-USD', 'BCH-USD'];

//   const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedPair(event.target.value);
//     onPairChange(event.target.value);
//   };

//   return (
//     <select value={selectedPair} onChange={handleChange}>
//       {pairs.map((pair) => (
//         <option key={pair} value={pair}>
//           {pair}
//         </option>
//       ))}
//     </select>
//   );
// };






// "use client";
// import React, { useState } from 'react';

// export const CurrencyDropdown: React.FC<{ onPairChange: (pair: string) => void }> = ({ onPairChange }) => {
//   const [selectedPair, setSelectedPair] = useState('BTC-USD');
  
//   const pairs = ['BTC-USD', 'ETH-USD', 'LTC-USD', 'XRP-USD'];

//   const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedPair(event.target.value);
//     onPairChange(event.target.value);
//   };

//   return (
//     <select value={selectedPair} onChange={handleChange}>
//       {pairs.map((pair) => (
//         <option key={pair} value={pair}>
//           {pair}
//         </option>
//       ))}
//     </select>
//   );
// };
"use client";
import React from 'react';
import styles from './CurrencyDropdown.module.scss'; // Измени на реальный путь к файлу

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
