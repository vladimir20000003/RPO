// eslint-disable-next-line
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import editIcon from '../images/edit_image.png';
import deleteIcon from '../images/bin.jpg';
import { Link } from 'react-router-dom'; // Importing the Link component from React Router
import { Pagination } from 'react-bootstrap';
import '.././App.css';

function CountriesPage() {
  const [countries, setCountries] = useState([]);
  const [newCountryName, setNewCountryName] = useState('');
  const [editedCountryName, setEditedCountryName] = useState('');
  const [editingCountryId, setEditingCountryId] = useState(null);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // Вы установили эту переменную, но не используете её.

  const PAGE_SIZE = 10;

  async function fetchCountries() {
    try {
      const response = await axios.get('http://127.0.0.1:5000/country');
      setCountries(response.data.countries);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  }

  async function addCountry() {
    try {
      const formData = new URLSearchParams();
      formData.append('name', newCountryName);

      await axios.post('http://127.0.0.1:5000/add_country', formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      fetchCountries();
      setNewCountryName('');
    } catch (error) {
      console.error('Error adding country:', error);
    }
  }

  async function editCountry(countryId) {
    try {
      const updatedCountry = {
        name: editedCountryName
      };
  
      await axios.put(`http://127.0.0.1:5000/update_country/${countryId}`, updatedCountry, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      fetchCountries();
      setEditingCountryId(null);
      setEditedCountryName('');
    } catch (error) {
      console.error('Error editing country:', error);
    }
  }

  async function deleteCountries() {
    try {
      const countryIdsToDelete = selectedCountries.length > 0 ? selectedCountries : [editingCountryId];
      
      await Promise.all(countryIdsToDelete.map(async countryId => {
        await axios.delete(`http://127.0.0.1:5000/delete_country/${countryId}`);
      }));

      fetchCountries();
      setSelectedCountries([]);
      setEditingCountryId(null);
    } catch (error) {
      console.error('Error deleting countries:', error);
    }
  }

  function handleCountrySelect(countryId) {
    if (selectedCountries.includes(countryId)) {
      setSelectedCountries(selectedCountries.filter(id => id !== countryId));
    } else {
      setSelectedCountries([...selectedCountries, countryId]);
    }
  }

  useEffect(() => {
    fetchCountries();
  }, []);

  const startIndex = currentPage * PAGE_SIZE;
  const endIndex = (currentPage + 1) * PAGE_SIZE;
  const displayedCountries = countries.slice(startIndex, endIndex).sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="App">
      <header className="App-header">
        <h2>List of Countries</h2>
        <ul>
          {displayedCountries.map((country, index) => (
            <li key={index} className={`country-item ${selectedCountries.includes(country.id) ? 'selected' : ''}`} onClick={() => handleCountrySelect(country.id)}>
              {editingCountryId === country.id ? (
                <div>
                  <input
                    type="text"
                    value={editedCountryName}
                    onChange={(e) => setEditedCountryName(e.target.value)}
                    placeholder="Enter edited country name"
                  />
                  <button className="save-btn" onClick={() => editCountry(country.id)}>Save</button>
                </div>
              ) : (
                <div className="buttons-right">
                  <span>{country.name}</span>
                  <div>
                    <button className="edit-btn" onClick={() => setEditingCountryId(country.id)}>
                      <img src={editIcon} alt="Edit" className="edit-icon" />
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
        <div>
          <input
            type="text"
            value={newCountryName}
            onChange={(e) => setNewCountryName(e.target.value)}
            placeholder="Enter new country name"
          />
          <button className="add-btn" onClick={addCountry}>Add Country</button>
        </div>
        <div>
          <button className="delete-btn" onClick={deleteCountries}>
            <img src={deleteIcon} alt="Delete" className="delete-icon" style={{ width: '100px', height: 'auto' }} />
          </button>
        </div>
        <div>
          {/* Replaced Pagination buttons with links */}
            <Link to="/artists" className="pagination-link">
                &lt; Previous
                </Link>{" "}
            <Link to="/museums" className="pagination-link">
            Next &gt;
            </Link>
        </div>
      </header>
    </div>
  );
}

export default CountriesPage;
