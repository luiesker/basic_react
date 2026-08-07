import React, { useState } from 'react';
import { useRollbar } from '@rollbar/react';
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
  const rollbar = useRollbar();
  
  const [cart, setCart] = useState<SchoolSupply[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SchoolSupply[]>([]);
  const [isProcessing, setIsProcessing] = useState(false); // Use React state instead of local variable
  const [isSearching, setIsSearching] = useState(false); // Use React state instead of local variable
  
  // Complex bug: Track user interaction patterns that will cause checkout to fail
  const [interactionTimestamps, setInteractionTimestamps] = useState<number[]>([]);
  const [lastSearchTime, setLastSearchTime] = useState<number>(0);
  const [clickSequence, setClickSequence] = useState<string[]>([]);
  const [cardInputFocusCount, setCardInputFocusCount] = useState(0);
  const [mouseMovements, setMouseMovements] = useState<Array<{x: number, y: number, timestamp: number}>>([]);

  const addToCart = (item: SchoolSupply) => {
    setCart([...cart, item]);
    // Track the interaction
    const now = Date.now();
    setInteractionTimestamps([...interactionTimestamps, now]);
    setClickSequence([...clickSequence, `add_${item.id}`]);
  };

  const checkout = () => {
    if (isProcessing) {
      console.error('Checkout already in progress. Please wait.');
      rollbar.warning('Duplicate checkout attempt', {
        userId: 'user123',
        cartItems: cart.length,
        timestamp: new Date().toISOString()
      });
      return;
    }

    setIsProcessing(true);
    setClickSequence([...clickSequence, 'checkout']);

    console.log('Processing checkout...');

    // Simulate an API call or some asynchronous operation
    setTimeout(() => {
      try {
        // COMPLEX BUG: Multiple interconnected conditions that cause failures
        // This will be nearly impossible to debug without session replay
        const now = Date.now();
        const timeSinceLastSearch = now - lastSearchTime;
        
        // Check if user added items too quickly (spam clicking)
        const recentInteractions = interactionTimestamps.filter(ts => now - ts < 5000);
        const isSpamming = recentInteractions.length > 5;
        
        // Check if user hovered over checkout area before clicking
        const recentMouseNearCheckout = mouseMovements.filter(m => 
          now - m.timestamp < 2000 && m.y > 400
        );
        const hasProperMouseIntent = recentMouseNearCheckout.length > 3;
        
        // Check for specific click patterns that indicate bot behavior
        const clickPattern = clickSequence.slice(-5).join(',');
        const suspiciousPatterns = [
          'add_1,add_2,add_3,add_4,checkout',
          'add_1,add_1,add_1,checkout',
          'checkout'
        ];
        const isSuspiciousPattern = suspiciousPatterns.some(pattern => 
          clickPattern.includes(pattern)
        );
        
        // Check if user interacted with payment fields
        const hasInteractedWithPayment = cardInputFocusCount > 0;
        
        // Calculate a "trust score" based on user behavior
        let trustScore = 100;
        
        if (isSpamming) trustScore -= 40;
        if (!hasProperMouseIntent) trustScore -= 25;
        if (isSuspiciousPattern) trustScore -= 30;
        if (!hasInteractedWithPayment) trustScore -= 20;
        if (timeSinceLastSearch < 3000 && timeSinceLastSearch > 0) trustScore -= 15;
        if (cart.length === 0) trustScore -= 50; // Empty cart is suspicious
        
        // Edge case: If user added exactly 3 items of the same type
        const itemCounts = cart.reduce((acc, item) => {
          acc[item.id] = (acc[item.id] || 0) + 1;
          return acc;
        }, {} as Record<number, number>);
        
        const hasExactlyThreeSameItems = Object.values(itemCounts).some(count => count === 3);
        if (hasExactlyThreeSameItems) trustScore -= 35;
        
        // Another edge case: Total cart value is suspicious
        const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);
        if (cartTotal > 100 || cartTotal === 0) trustScore -= 20;
        
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

        // THE SUBTLE BUG: Checkout fails based on trust score, but the reason is obscure
        // The user sees a generic error, but the real cause is the complex behavior pattern
        if (trustScore < 50) {
          // This will fail silently or with a vague error
          const errorReasons: string[] = [];
          if (isSpamming) errorReasons.push('rapid_interactions');
          if (!hasProperMouseIntent) errorReasons.push('unusual_mouse_pattern');
          if (isSuspiciousPattern) errorReasons.push('bot_pattern');
          if (!hasInteractedWithPayment) errorReasons.push('no_payment_interaction');
          if (hasExactlyThreeSameItems) errorReasons.push('suspicious_quantity');
          
          rollbar.error('Checkout blocked by fraud detection', {
            trustScore,
            errorReasons,
            cartItems: cart,
            interactionCount: recentInteractions.length,
            clickPattern,
            cardInputFocusCount,
            mouseMovementCount: mouseMovements.length,
            timeSinceLastSearch,
            userId: 'user123',
            timestamp: new Date().toISOString()
          });
          
          // Throw a generic error that doesn't reveal the real reason
          throw new Error('Payment processing failed. Please try again later.');
        }

        // Randomly simulate a success or failure for valid cases
        const success = Math.random() > 0.3;

        if (success) {
          console.log('Checkout completed successfully!');
          rollbar.info('Checkout completed successfully', {
            cartTotal,
            itemCount: cart.length,
            userId: 'user123',
            trustScore
          });
        } else {
          console.error('Checkout failed due to a server error.');
          rollbar.error('Checkout payment processing failed', {
            cartItems: cart,
            cartTotal,
            userId: 'user123',
            timestamp: new Date().toISOString(),
            paymentMethod: 'credit_card',
            errorCode: 'PAYMENT_DECLINED',
            trustScore
          });
          throw new Error('Checkout error: Unable to process order.');
        }
      } catch (error) {
        console.error('Checkout error:', error);
        rollbar.error('Checkout exception occurred', {
          error: error,
          cartItems: cart,
          userId: 'user123',
          'test-Test': 'test',
          stackTrace: error instanceof Error ? error.stack : 'No stack trace available',
          clickSequence,
          interactionTimestamps,
          mouseMovements: mouseMovements.length,
          cardInputFocusCount
        });
        throw error; // Re-throw to ensure it becomes an unhandled error
      } finally {
        setIsProcessing(false);
      }
    }, 3000);
  };

  const handleSearch = () => {
    if (isSearching) {
      console.error('Search already in progress. Please wait.');
      rollbar.warning('Duplicate search attempt', {
        searchTerm: searchTerm,
        userId: 'user123',
        timestamp: new Date().toISOString()
      });
      return;
    }
  
    setIsSearching(true);
    setLastSearchTime(Date.now());
    setClickSequence([...clickSequence, 'search']);
  
    console.log('Searching for:', searchTerm);
  
    // Simulate an asynchronous search operation
    setTimeout(() => {
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
        // Regular expression error - use valid regex syntax
        // eslint-disable-next-line no-invalid-regexp
        new RegExp('[invalid-regex');
      } else {
        // Normal search functionality
        try {
          const term = searchTerm;
          
          if (term && term.trim()) {
            const results = schoolSupplies.filter((item) =>
              item.name.toLowerCase().includes(term.toLowerCase())
            );
            setSearchResults(results);
          } else {
            setSearchResults([]);
          }
        } catch (error) {
          rollbar.error('Search operation failed', {
            error: error,
            searchTerm: searchTerm,
            userId: 'user123',
            timestamp: new Date().toISOString()
          });
          setSearchResults([]);
        }
      }
      
      setIsSearching(false);
    }, 500);
  };

  // Track mouse movements for fraud detection
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      setMouseMovements(prev => {
        // Keep only last 50 movements and last 10 seconds
        const recent = prev.filter(m => now - m.timestamp < 10000).slice(-50);
        return [...recent, { x: e.clientX, y: e.clientY, timestamp: now }];
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
                <input 
                  type="text" 
                  className="mask" 
                  placeholder="1234 5678 9012 3456"
                  onFocus={() => setCardInputFocusCount(prev => prev + 1)}
                />
              </label>
            </div>
            <div>
              <label>
                Expiration Date:
                <input 
                  type="text" 
                  className="dat" 
                  placeholder="MM/YY"
                  onFocus={() => setCardInputFocusCount(prev => prev + 1)}
                />
              </label>
            </div>
            <div>
              <label>
                CVV:
                <input 
                  type="text" 
                  className="dat" 
                  placeholder="123"
                  onFocus={() => setCardInputFocusCount(prev => prev + 1)}
                />
              </label>
            </div>
          </div>
          <button onClick={checkout} style={{ marginTop: '20px' }} disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Checkout'}
          </button>
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