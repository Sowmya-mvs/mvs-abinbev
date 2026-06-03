import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchFavorites, removeFavorite } from '../store/favoritesSlice';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(state => state.favorites.items);
  const status = useAppSelector(state => state.favorites.status);
  const token = useAppSelector(state => state.user.token);
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    dispatch(fetchFavorites(token));
  }, [dispatch, token, navigate]);

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed') return <div>Failed to load favorites.</div>;

  const handleRemoveFavorite = async (bookId) => {
    if (!token) {
      navigate('/');
      return;
    }
    try {
      const result = await dispatch(removeFavorite({ token, bookId })).unwrap();
      setMessage(result.message || 'Book removed from favorites');
    } catch (error) {
      setMessage(error.message || 'Failed to remove favorite');
    }
  };

  return (
    <div>
      <h2>My Favorite Books</h2>
      {message && <div role="status">{message}</div>}
      {favorites.length === 0 ? (
        <div style={{
          background: '#fff',
          padding: '2rem',
          borderRadius: '8px',
          maxWidth: '400px',
          margin: '2rem auto',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          textAlign: 'center',
          color: '#888',
        }}>
          <p>No favorite books yet.</p>
          <p>
            Go to the <a href="/books" onClick={e => { e.preventDefault(); navigate('/books'); }}>book list</a> to add some!
          </p>
        </div>
      ) : (
        <ul>
          {favorites.map(book => (
            <li key={book.id}>
              <strong>{book.title}</strong> by {book.author}
              <button
                type="button"
                onClick={() => handleRemoveFavorite(book.id)}
                style={{ marginLeft: '1rem' }}
              >
                Remove from Favorites
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Favorites;
