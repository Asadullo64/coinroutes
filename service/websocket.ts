const SOCKET_URL = 'wss://ws-feed-public.sandbox.exchange.coinbase.com';

export const subscribeToOrderBook = (currencyPair: string, handleMessage: (data: any) => void) => {
  const socket = new WebSocket(SOCKET_URL);

  socket.onopen = () => {
    socket.send(JSON.stringify({
      type: 'subscribe',
      channels: [{
        name: 'ticker',
        product_ids: [currencyPair]
      }]
    }));
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    handleMessage(data);
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  return () => {
    socket.close();
  };
};
