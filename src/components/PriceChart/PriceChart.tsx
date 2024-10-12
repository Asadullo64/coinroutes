"use client";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart,
  LinearScale,
  CategoryScale,
  LineElement,
  PointElement,
  Filler,
  TimeScale,
  Tooltip,
  TooltipItem,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { subscribeToOrderBook } from "@/service/websocket";

// Регистрируем компоненты Chart.js
Chart.register(
  LinearScale,
  CategoryScale,
  LineElement,
  PointElement,
  Filler,
  TimeScale,
  Tooltip
);

// Интерфейс для данных из вебсокета
interface OrderBookMessage {
  type: string;
  price: string; // Если данные приходят в строковом формате
}

export const PriceChart: React.FC<{ currencyPair: string }> = ({
  currencyPair,
}) => {
  const [priceData, setPriceData] = useState<{ price: number; time: number }[]>(
    []
  );

  useEffect(() => {
    const handleOrderBookMessage = (data: OrderBookMessage) => {
      if (data.type === "ticker") {
        const price = parseFloat(data.price); // Преобразуем цену в число
        const timestamp = Date.now();
        setPriceData((prevData) => [...prevData, { price, time: timestamp }]);
      }
    };

    const unsubscribe = subscribeToOrderBook(
      currencyPair,
      handleOrderBookMessage
    );

    return () => {
      unsubscribe();
    };
  }, [currencyPair]);

  // Обрезаем данные до последних 50 записей
  const displayedPriceData = priceData.slice(-50);

  // Данные для графика
  const chartData = {
    labels: displayedPriceData.map((entry) => new Date(entry.time)),
    datasets: [
      {
        label: "Price",
        data: displayedPriceData.map((entry) => entry.price),
        fill: true,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        tension: 0.4,
        pointBackgroundColor: "rgba(0,0,0,1)",
      },
    ],
  };

  // Опции для графика
  const options: {
    responsive: boolean;
    plugins: {
      tooltip: {
        enabled: boolean;
        mode: 'index' | 'dataset' | 'point' | 'nearest' | 'x' | 'y'; 
        intersect: boolean;
        callbacks: {
          label: (context: TooltipItem<'line'>) => string;
        };
      };
    };
    scales: {
      x: {
        type: 'time'; 
        time: {
          unit: 'minute';
          tooltipFormat: 'HH:mm:ss';
        };
        title: {
          display: boolean;
          text: string;
        };
      };
      y: {
        title: {
          display: boolean;
          text: string;
        };
      };
    };
  } = {
    responsive: true,
    plugins: {
      tooltip: {
        enabled: true,
        mode: 'index', 
        intersect: false,
        callbacks: {
          label: function (context: TooltipItem<'line'>) {
            const price = context.raw;
            const time = new Date(Number(context.label)).toLocaleTimeString();
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
