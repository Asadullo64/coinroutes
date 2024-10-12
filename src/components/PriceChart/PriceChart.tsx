// // components/PriceChart.tsx
// "use client"
// import React, { useEffect, useState } from 'react';
// import { Line } from 'react-chartjs-2';
// import { Chart, LinearScale, CategoryScale, LineElement, PointElement, Filler } from 'chart.js'; // Импортируйте необходимые компоненты
// import { subscribeToOrderBook } from '@/service/websocket';

// // Регистрация шкал и других компонентов вручную
// Chart.register(
//   LinearScale,
//   CategoryScale,
//   LineElement,
//   PointElement,
//   Filler
// );

// export const PriceChart: React.FC<{ currencyPair: string }> = ({ currencyPair }) => {
//   const [priceData, setPriceData] = useState<number[]>([]);

//   useEffect(() => {
//     const handleOrderBookMessage = (data: any) => {
//       if (data.type === 'l2update') {
//         const price = parseFloat(data.changes[0][1]);
//         setPriceData((prevData) => [...prevData, price]);
//       }
//     };

//     const unsubscribe = subscribeToOrderBook(currencyPair, handleOrderBookMessage);

//     return () => {
//       unsubscribe();
//     };
//   }, [currencyPair]);

//   const chartData = {
//     labels: priceData.map((_, index) => `Point ${index + 1}`),
//     datasets: [
//       {
//         label: 'Price',
//         data: priceData,
//         borderColor: 'rgba(75,192,192,1)',
//         fill: false,
//       },
//     ],
//   };

//   return <Line data={chartData} />;
// };

// "use client";
// import React, { useEffect, useState } from 'react';
// import { Line } from 'react-chartjs-2';
// import { Chart, LinearScale, CategoryScale, LineElement, PointElement, Filler, TimeScale, Tooltip } from 'chart.js';
// import 'chartjs-adapter-date-fns'; // Добавляем адаптер для работы с временными метками
// import { subscribeToOrderBook } from '@/service/websocket';

// Chart.register(
//   LinearScale,
//   CategoryScale,
//   LineElement,
//   PointElement,
//   Filler,
//   TimeScale, // Добавляем TimeScale для оси времени
//   Tooltip // Добавляем функционал для подсказок (tooltips)
// );

// export const PriceChart: React.FC<{ currencyPair: string }> = ({ currencyPair }) => {
//   const [priceData, setPriceData] = useState<{ price: number; time: number }[]>([]);

//   useEffect(() => {
//     const handleOrderBookMessage = (data: any) => {
//       if (data.type === 'ticker') { // Обрабатываем тип 'ticker'
//         const price = parseFloat(data.price); // Получаем текущую цену
//         const timestamp = Date.now(); // Используем текущее время
//         setPriceData((prevData) => [...prevData, { price, time: timestamp }]);
//       }
//     };

//     const unsubscribe = subscribeToOrderBook(currencyPair, handleOrderBookMessage);

//     return () => {
//       unsubscribe();
//     };
//   }, [currencyPair]);

//   // Ограничиваем количество данных для отображения
//   const displayedPriceData = priceData.slice(-50); // Отображаем последние 50 данных

//   // Подготавливаем данные для графика
//   const chartData = {
//     labels: displayedPriceData.map((entry) => new Date(entry.time)), // Метки для оси времени
//     datasets: [
//       {
//         label: 'Price',
//         data: displayedPriceData.map((entry) => entry.price),
//         fill: true,
//         borderColor: 'rgba(75,192,192,1)',
//         backgroundColor: 'rgba(75,192,192,0.2)',
//         tension: 0.4,
//         pointBackgroundColor: 'rgba(0,0,0,1)', // Цвет точек
//       },
//     ],
//   };

//   // Конфигурация графика с подсказками
//   const options = {
//     responsive: true,
//     plugins: {
//       tooltip: {
//         enabled: true,
//         mode: 'index',
//         intersect: false,
//         callbacks: {
//           label: function (context: any) {
//             const price = context.raw;
//             const time = new Date(context.label).toLocaleTimeString();
//             return `Price: $${price}, Time: ${time}`; // Отображаем цену и время
//           },
//         },
//       },
//     },
//     scales: {
//       x: {
//         type: 'time', // Ось времени
//         time: {
//           unit: 'minute',
//           tooltipFormat: 'HH:mm:ss', // Формат времени для всплывающих подсказок
//         },
//         title: {
//           display: true,
//           text: 'Time',
//         },
//       },
//       y: {
//         title: {
//           display: true,
//           text: 'Price',
//         },
//       },
//     },
//   };

//   return (
//     <div>
//       <h3>Price Chart for {currencyPair}</h3>
//       <Line data={chartData} options={options} />
//     </div>
//   );
// };






// "use client";
// import React, { useEffect, useState } from 'react';
// import { Line } from 'react-chartjs-2';
// import { Chart, LinearScale, CategoryScale, LineElement, PointElement, Filler, TimeScale, Tooltip } from 'chart.js';
// import 'chartjs-adapter-date-fns';
// import { subscribeToOrderBook } from '@/service/websocket';

// Chart.register(
//   LinearScale,
//   CategoryScale,
//   LineElement,
//   PointElement,
//   Filler,
//   TimeScale,
//   Tooltip
// );

// export const PriceChart: React.FC<{ currencyPair: string }> = ({ currencyPair }) => {
//   const [priceData, setPriceData] = useState<{ price: number; time: number }[]>([]);
//   const [purchasePrice, setPurchasePrice] = useState<number | null>(null); // Цена покупки
//   const [profitOrLoss, setProfitOrLoss] = useState<number | null>(null); // Прибыль или убыток

//   useEffect(() => {
//     const handleOrderBookMessage = (data: any) => {
//       if (data.type === 'ticker') {
//         const price = parseFloat(data.price);
//         const timestamp = Date.now();
//         setPriceData((prevData) => [...prevData, { price, time: timestamp }]);

//         // Если покупка была сделана, вычисляем прибыль/убыток
//         if (purchasePrice !== null) {
//           const profitLoss = price - purchasePrice; // Разница между текущей ценой и ценой покупки
//           setProfitOrLoss(profitLoss);
//         }
//       }
//     };

//     const unsubscribe = subscribeToOrderBook(currencyPair, handleOrderBookMessage);

//     return () => {
//       unsubscribe();
//     };
//   }, [currencyPair, purchasePrice]); // Добавили purchasePrice в зависимости, чтобы обновлять при изменении цены

//   // Функция для покупки
//   const handleBuy = () => {
//     const lastPrice = priceData[priceData.length - 1]?.price;
//     if (lastPrice) {
//       setPurchasePrice(lastPrice); // Устанавливаем цену покупки как последнюю цену
//       setProfitOrLoss(0); // Сбрасываем прибыль/убыток на момент покупки
//     }
//   };

//   const displayedPriceData = priceData.slice(-50);

//   const chartData = {
//     labels: displayedPriceData.map((entry) => new Date(entry.time)),
//     datasets: [
//       {
//         label: 'Price',
//         data: displayedPriceData.map((entry) => entry.price),
//         fill: true,
//         borderColor: 'rgba(75,192,192,1)',
//         backgroundColor: 'rgba(75,192,192,0.2)',
//         tension: 0.4,
//         pointBackgroundColor: 'rgba(0,0,0,1)',
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       tooltip: {
//         enabled: true,
//         mode: 'index',
//         intersect: false,
//         callbacks: {
//           label: function (context: any) {
//             const price = context.raw;
//             const time = new Date(context.label).toLocaleTimeString();
//             return `Price: $${price}, Time: ${time}`;
//           },
//         },
//       },
//     },
//     scales: {
//       x: {
//         type: 'time',
//         time: {
//           unit: 'minute',
//           tooltipFormat: 'HH:mm:ss',
//         },
//         title: {
//           display: true,
//           text: 'Time',
//         },
//       },
//       y: {
//         title: {
//           display: true,
//           text: 'Price',
//         },
//       },
//     },
//   };

//   return (
//     <div>
//       <h3>Price Chart for {currencyPair}</h3>

//       {/* Кнопка покупки */}
//       <button onClick={handleBuy} style={{ marginBottom: '10px', padding: '10px', backgroundColor: 'lightgreen', cursor: 'pointer' }}>
//         Buy at Current Price
//       </button>

//       {/* Отображение прибыли или убытка */}
//       {purchasePrice !== null && (
//         <div>
//           <p>Purchase Price: ${purchasePrice.toFixed(2)}</p>
//           <p style={{ color: profitOrLoss && profitOrLoss >= 0 ? 'green' : 'red' }}>
//             {profitOrLoss !== null ? `Profit/Loss: $${profitOrLoss.toFixed(2)}` : 'No Profit/Loss yet'}
//           </p>
//         </div>
//       )}

//       <Line data={chartData} options={options} />
//     </div>
//   );
// };



"use client";
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, LinearScale, CategoryScale, LineElement, PointElement, Filler, TimeScale, Tooltip } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { subscribeToOrderBook } from '@/service/websocket';

Chart.register(
  LinearScale,
  CategoryScale,
  LineElement,
  PointElement,
  Filler,
  TimeScale,
  Tooltip
);

export const PriceChart: React.FC<{ currencyPair: string }> = ({ currencyPair }) => {
  const [priceData, setPriceData] = useState<{ price: number; time: number }[]>([]);

  useEffect(() => {
    const handleOrderBookMessage = (data: any) => {
      if (data.type === 'ticker') {
        const price = parseFloat(data.price);
        const timestamp = Date.now();
        setPriceData((prevData) => [...prevData, { price, time: timestamp }]);
      }
    };

    const unsubscribe = subscribeToOrderBook(currencyPair, handleOrderBookMessage);

    return () => {
      unsubscribe();
    };
  }, [currencyPair]);

  const displayedPriceData = priceData.slice(-50);

  const chartData = {
    labels: displayedPriceData.map((entry) => new Date(entry.time)),
    datasets: [
      {
        label: 'Price',
        data: displayedPriceData.map((entry) => entry.price),
        fill: true,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        tension: 0.4,
        pointBackgroundColor: 'rgba(0,0,0,1)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function (context: any) {
            const price = context.raw;
            const time = new Date(context.label).toLocaleTimeString();
            return `Price: $${price}, Time: ${time}`;
          },
        },
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute',
          tooltipFormat: 'HH:mm:ss',
        },
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Price',
        },
      },
    },
  };

  return (
    <div>
      <h3>Price Chart for {currencyPair}</h3>
      <Line data={chartData} options={options} />
    </div>
  );
};
