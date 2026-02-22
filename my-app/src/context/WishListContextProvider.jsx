import React, { useContext } from 'react'
import WishListContext from './WishListContext';
import { useState } from 'react';
import axios from 'axios';
import UserContext from './UserContext';
export default function WishListContextProvider({children}) {
  const [favorites, setFavorites] = useState(new Set());
  const{token}=useContext(UserContext)

     // ✅ Add to wishlist
  const addFavorite = async (id) => {
  
    if (favorites.has(id)) return; // already favorited
    try {
      await axios.post(
        `http://127.0.0.1:5000/liked/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFavorites((prev) => new Set([...prev, id]));
    } catch (err) {
      console.error("Error adding favorite:", err);
      alert(err.response?.data?.msg || "Error adding favorite");
    }
  };

  // ✅ Remove from wishlist
  const removeFavorite = async (id) => {
    if (!favorites.has(id)) return;
    try {
      await axios.delete(`http://127.0.0.1:5000/liked/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites((prev) => {
        const updated = new Set(prev);
        updated.delete(id);
        return updated;
      });
    } catch (err) {
      console.error("Error removing favorite:", err);
      alert(err.response?.data?.msg || "Error removing favorite");
    }
  };
  return (
    <div>
        <WishListContext.Provider value={{addFavorite,removeFavorite,favorites,setFavorites}}>
            {children}
        </WishListContext.Provider>

      
    </div>
  )
}
