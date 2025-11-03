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
  const [isProcessing, setIsProcessing] = useState(false); // Use React state instead of local variable
  const [isSearching, setIsSearching] = useState(false); // Use React state instead of local variable

  const addToCart = (item: SchoolSupply) => {
    setCart([...cart, item]);
  };

  const checkout = () => {
    if (isProcessing) {
      console.error('Checkout already in progress. Please wait.');
      return; // Prevent further execution if already processing
    }

    setIsProcessing(true);

    console.log('Processing checkout...');

    // Simulate an API call or some asynchronous operation
    setTimeout(() => {
      try {
        // Randomly simulate a success or failure
        const success = Math.random() > 0.5;

        if (success) {
          console.log('Checkout completed successfully!');
        } else {
          console.error('Checkout failed due to a server error.');
          throw new Error('Checkout error: Unable to process order.');
        }
      } catch (error) {
        console.error('Checkout error:', error);
      } finally {
        // Always reset the processing state
        setIsProcessing(false);
      }
    }, 3000); // Simulate a 3-second delay
  };

  const handleSearch = () => {
    if (isSearching) {
      console.error('Search already in progress. Please wait.');
      return; // Prevent further execution if already searching
    }
  
    setIsSearching(true);
  
    console.log('Searching for:', searchTerm);
  
    // Simulate an asynchronous search operation
    setTimeout(() => {
      try {
        // Capture the current value of searchTerm safely
        const term = searchTerm;
        
        // Add null/undefined check before using the search term
        if (term && term.trim()) {
          const results = schoolSupplies.filter((item) =>
            item.name.toLowerCase().includes(term.toLowerCase())
          );
          setSearchResults(results);
        } else {
          // If search term is empty, show all items
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        // Always reset the searching state
        setIsSearching(false);
      }
    }, 500); // Simulate a 500ms delay for the search
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