const SOCKET_URL = 'wss://ws-feed-public.sandbox.exchange.coinbase.com';

interface TickerMessage {
  type: string;
  price: string; 
}

export const subscribeToOrderBook = (
  currencyPair: string,
  handleMessage: (data: TickerMessage) => void
) => {
  const socket = new WebSocket(SOCKET_URL);

  socket.onopen = () => {
    socket.send(
      JSON.stringify({
        type: 'subscribe',
        channels: [{
          name: 'ticker',
          product_ids: [currencyPair],
        }],
      })
    );
  };

  socket.onmessage = (event) => {
    try {
      const data: TickerMessage = JSON.parse(event.data);
      handleMessage(data);
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  socket.onclose = () => {
    console.log('WebSocket connection closed.');
  };

  return () => {
    socket.close();
  };
};
