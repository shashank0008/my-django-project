import React, { useState, useEffect, useCallback } from 'react';
import './ItemList.css'; // Import the CSS file

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  const fetchItems = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8000/api/items/');
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addItem = async () => {
    if (newItem.trim()) {
      try {
        const response = await fetch('http://localhost:8000/api/items/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: newItem }),
        });
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Response text:', errorText);
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const newItemData = await response.json();
        setItems((prevItems) => [...prevItems, newItemData]);
        setNewItem('');
      } catch (error) {
        console.error('Failed to add item:', error);
      }
    }
  };

  const deleteItem = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/items/${id}/`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response text:', errorText);
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      setItems((prevItems) => prevItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  return (
    <div className="container">
      <h1>Item List</h1>
      <div className="input-container">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add a new item"
        />
        <button onClick={addItem}>Add Item</button>
      </div>
      <ol>
        {items.map((item) => (
          <li key={item.id}>
            {item.name}
            <button onClick={() => deleteItem(item.id)} className="delete-button">×</button>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ItemList;
