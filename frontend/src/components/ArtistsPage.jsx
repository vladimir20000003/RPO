import React, { useState, useEffect } from 'react';
import axios from 'axios';
import editIcon from '../images/edit_image.png';
import deleteIcon from '../images/bin.jpg';
import { Link } from 'react-router-dom';
import '.././App.css';

function ArtistsPage() {
  const [artists, setArtists] = useState([]);
  const [newArtistName, setNewArtistName] = useState('');
  const [newArtistAge, setNewArtistAge] = useState('');
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [editArtist, setEditArtist] = useState(null);

  async function fetchArtists() {
    try {
      const response = await axios.get('http://127.0.0.1:5000/artists');
      setArtists(response.data.artists);
    } catch (error) {
      console.error('Error fetching artists:', error);
    }
  }

  async function addArtist() {
    try {
      const formData = {
        name: newArtistName,
        age: newArtistAge,
      };
  
      await axios.post('http://127.0.0.1:5000/add_artist', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      fetchArtists();
      setNewArtistName('');
      setNewArtistAge('');
    } catch (error) {
      console.error('Error adding artist:', error);
    }
  }
  
  
  async function deleteArtists() {
    try {
      const artistsIdsToDelete = selectedArtists.map(artist => artist.id);

      await Promise.all(artistsIdsToDelete.map(async artistId => {
        await axios.delete(`http://127.0.0.1:5000/delete_artist/${artistId}`);
      }));

      fetchArtists();
      setSelectedArtists([]);
    } catch (error) {
      console.error('Error deleting artists:', error);
    }
  }
  
  
  function handleArtistSelect(artistId) {
    if (selectedArtists.some(artist => artist.id === artistId)) {
      setSelectedArtists(selectedArtists.filter(artist => artist.id !== artistId));
    } else {
      setSelectedArtists([...selectedArtists, artists.find(artist => artist.id === artistId)]);
    }
  }

  function handleEditClick(artist) {
    setEditArtist(artist);
  }

  async function saveEditArtist() {
    try {
      await axios.put(`http://127.0.0.1:5000/update_artist/${editArtist.id}`, editArtist);
      fetchArtists();
      setEditArtist(null);
    } catch (error) {
      console.error('Error editing artist:', error);
    }
  }

  useEffect(() => {
    fetchArtists();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h2>List of Artists</h2>
        <div>
          <input
            type="text"
            value={newArtistName}
            onChange={(e) => setNewArtistName(e.target.value)}
            placeholder="Enter new artist name"
            style={{ marginRight: '10px' }}
          />
          <input
            type="text"
            value={newArtistAge}
            onChange={(e) => setNewArtistAge(e.target.value)}
            placeholder="Enter new artist age"
            style={{ marginRight: '10px' }}
          />
          <button className="add-btn" onClick={addArtist}>Add Artist</button>
        </div>
        <ul>
          {artists && artists.length > 0 ? (
            artists.map((artist, index) => (
              <li key={index} className={`artist-item ${selectedArtists.some(selectedArtist => selectedArtist.id === artist.id) ? 'selected' : ''}`} onClick={() => handleArtistSelect(artist.id)}>
                <div className="buttons-right">
                  {editArtist && editArtist.id === artist.id ? (
                    <div>
                      <input
                        type="text"
                        value={editArtist.name}
                        onChange={(e) => setEditArtist({ ...editArtist, name: e.target.value })}
                        placeholder="Enter artist name"
                      />
                      <input
                        type="text"
                        value={editArtist.age}
                        onChange={(e) => setEditArtist({ ...editArtist, age: e.target.value })}
                        placeholder="Enter artist age"
                      />
                      <button className="save-btn" onClick={saveEditArtist}>Save Changes</button>
                    </div>
                  ) : (
                    <div>
                      <span>{artist.name} - {artist.age}</span>
                      <div>
                        <button className="edit-btn" onClick={() => handleEditClick(artist)}>
                          <img src={editIcon} alt="Edit" className="edit-icon" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))
          ) : (
            <li>No artists found.</li>
          )}
        </ul>
        <div>
          <button className="delete-btn" onClick={deleteArtists}>
            <img src={deleteIcon} alt="Delete" className="delete-icon" style={{ width: '100px', height: 'auto' }} />
          </button>
        </div>
        <div>
          <Link to="/museums" className="pagination-link">
            &lt; Previous
          </Link>{" "}
          <Link to="/countries" className="pagination-link">
            Next &gt;
          </Link>
        </div>
      </header>
    </div>
  );
}

export default ArtistsPage;
