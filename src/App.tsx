import React, { useState } from 'react';
import './App.css';

type SchoolSupply = {
  id: number;
  name: string;
  price: number;
};

const schoolSupplies: SchoolSupply[] = [
  { id: 1, name: 'Notebook', price: 2.99 },
  { id: 2, name: 'Pencil', price: 0.99 },
  { id: 3, name: 'Eraser', price: 0.50 },
  { id: 4, name: 'Backpack', price: 29.99 },
];


function App() {
  const [cart, setCart] = useState<SchoolSupply[]>([]);

  const addToCart = (item: SchoolSupply) => {
    setCart([...cart, item]);
  };

  const checkout = () => {
    throw new Error('Checkout error: Unable to process order.');
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="main-content">
        <h1>Rollbar's Supplies Store</h1>
        <ul>
          {schoolSupplies.map(item => (
            <li key={item.id}>
              {item.name} - ${item.price.toFixed(2)}
              <button onClick={() => addToCart(item)}>Add to Cart</button>
            </li>
          ))}
        </ul>
        <div style={{ marginTop: '20px' }}>
          <h2>Payment Information</h2>
          <div>
            <label>
              Card Number:
              <input type="text" className="mask" placeholder="1234 5678 9012 3456" />
            </label>
          </div>
          <div>
            <label>
              Expiration Date:
              <input type="text" className="mask" placeholder="MM/YY" />
            </label>
          </div>
          <div>
            <label>
              CVV:
              <input type="text" className="mask" placeholder="123" />
            </label>
          </div>
        </div>
        <button onClick={checkout} style={{ marginTop: '20px' }}>Checkout</button>
        </div>
        <div className="cart">
          <h2>Cart</h2>
          <ul>
            {cart.map((item, index) => (
              <li key={index}>{item.name} - ${item.price.toFixed(2)}</li>
            ))}
          </ul>
        </div>
      </header>
    </div>
  );
}

export default App;
