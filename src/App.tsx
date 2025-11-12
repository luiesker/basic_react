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
      throw new Error('Checkout already in progress. Please wait.');
      // @ts-ignore
    }

    setIsProcessing(true);

    console.log('Processing checkout...');

    // Simulate an API call or some asynchronous operation
    setTimeout(() => {
      try {
        // Simulate random unhandled errors that Rollbar will catch automatically
        const errorType = Math.floor(Math.random() * 5);
        
        if (errorType === 0) {
          // Uncaught TypeError - accessing property of null
          const nullObject: any = null;
          console.log(nullObject.nonExistentProperty);
        } else if (errorType === 1) {
          // Uncaught ReferenceError - using undefined variable
          // @ts-ignore
          console.log(undefinedVariable.someProperty);
        } else if (errorType === 2) {
          // Network-like error that gets thrown
          throw new Error('Payment gateway timeout - connection refused');
        } else if (errorType === 3) {
          // JSON parsing error
          JSON.parse('invalid json {');
        }

        // Randomly simulate a success or failure for valid cases
        const success = Math.random() > 0.3;

        if (success) {
          console.log('Checkout completed successfully!');
          // @ts-ignore

        } else {
          console.error('Checkout failed due to a server error.');
          // @ts-ignore
          throw new Error('Checkout payment processing failed');
        }
      } catch (error) {
        throw new Error('Checkout exception occurred');

      } finally {
        // Always reset the processing state
        setIsProcessing(false);
      }
    }, 3000); // Simulate a 3-second delay
  };

  const handleSearch = () => {
    if (isSearching) {
      console.error('Search already in progress. Please wait.');
      // @ts-ignore
      throw new Error('Duplicate search attempt');
      return; // Prevent further execution if already searching
    }
  
    setIsSearching(true);
  
    console.log('Searching for:', searchTerm);
  
    // Simulate an asynchronous search operation
    setTimeout(() => {
      try {
        // Simulate random unhandled errors that Rollbar will catch automatically
        const errorType = Math.floor(Math.random() * 4);
        
        if (errorType === 0) {
          // Uncaught TypeError - trying to call a method on undefined
          const undefinedFunction: any = undefined;
          undefinedFunction.search(searchTerm);
        } else if (errorType === 1) {
          // Array access error - trying to access property of undefined array element
          const emptyArray: any[] = [];
          console.log(emptyArray[999].name);
        } else if (errorType === 2) {
          // Regular expression error
          new RegExp('[invalid regex');
        }

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
        throw new Error('Search error:' + error);

    
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