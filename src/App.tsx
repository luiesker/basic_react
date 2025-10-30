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
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SchoolSupply[]>([]);

  const addToCart = (item: SchoolSupply) => {
    setCart([...cart, item]);
  };

  let isProcessing = false; // Persistent state to track if checkout is in progress
  let isSearching = false; // Persistent state to track if search is in progress

  const checkout = () => {
    if (isProcessing) {
      console.error('Checkout already in progress. Please wait.');
      return; // Prevent further execution if already processing
    }

    isProcessing = true;

    console.log('Processing checkout...');

    // Simulate an API call or some asynchronous operation
    setTimeout(() => {
      // Randomly simulate a success or failure
      const success = Math.random() > 0.5;

      if (success) {
        console.log('Checkout completed successfully!');
      } else {
        console.error('Checkout failed due to a server error.');
        throw new Error('Checkout error: Unable to process order.');
      }

      // Reset the processing state after the operation
      isProcessing = false;
    }, 3000); // Simulate a 3-second delay
  };

  const handleSearch = () => {
    if (isSearching) {
      console.error('Search already in progress. Please wait.');
      return; // Prevent further execution if already searching
    }
  
    isSearching = true;
  
    console.log('Searching for:', searchTerm);
  
    // Simulate an asynchronous search operation
    setTimeout(() => {
      // Introduce a race condition by clearing the searchTerm after the first click
      const term = searchTerm; // Capture the current value of searchTerm
      setSearchTerm(undefined as any); // Clear the search term asynchronously
  
      // Simulate a delay where the second click happens after the term is cleared
      setTimeout(() => {
        // Attempt to call .toLowerCase() on the cleared (undefined) searchTerm
        const results = schoolSupplies.filter((item) =>
          item.name.toLowerCase().includes(term!.toLowerCase()) // This will throw if term is undefined
        );
  
        setSearchResults(results);
  
        // Reset the searching state after the operation
        isSearching = false;
      }, 500); // Simulate a delay for the second click
    }, 500); // Simulate a 500ms delay for the first search
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="main-content">
          <h1>Rollbar's Supplies Store</h1>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Search for a supply..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
          </div>
          <ul>
            {searchResults.length > 0
              ? searchResults.map((item) => (
                  <li key={item.id}>
                    {item.name} - ${item.price.toFixed(2)}
                    <button onClick={() => addToCart(item)}>Add to Cart</button>
                  </li>
                ))
              : schoolSupplies.map((item) => (
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
                <input type="text" className="dat" placeholder="MM/YY" />
              </label>
            </div>
            <div>
              <label>
                CVV:
                <input type="text" className="dat" placeholder="123" />
              </label>
            </div>
          </div>
          <button onClick={checkout} style={{ marginTop: '20px' }}>Checkout</button>
        </div>
        <div className="cart">
          <h2>Cart</h2>
          <ul>
            {cart.map((item, index) => (
              <li key={index}>
                {item.name} - ${item.price.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      </header>
    </div>
  );
}

export default App;