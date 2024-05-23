import React, { useState, useEffect } from 'react';
import axios from 'axios';
import editIcon from '../images/edit_image.png';
import deleteIcon from '../images/bin.jpg';
import { Link } from 'react-router-dom'; // Импортируем Link из react-router-dom
import '.././App.css';

function MuseumsPage() {
  const [museums, setMuseums] = useState([]);
  const [newMuseumName, setNewMuseumName] = useState('');
  const [newMuseumLocation, setNewMuseumLocation] = useState('');
  const [selectedMuseums, setSelectedMuseums] = useState([]);
  const [editMuseum, setEditMuseum] = useState(null); // Состояние для хранения информации о выбранном музее для редактирования

  async function fetchMuseums() {
    try {
      const response = await axios.get('http://127.0.0.1:5000/museums');
      setMuseums(response.data.museums);
    } catch (error) {
      console.error('Error fetching museums:', error);
    }
  }

  async function addMuseum() {
    try {
      const formData = {
        name: newMuseumName,
        location: newMuseumLocation
      };

      await axios.post('http://127.0.0.1:5000/add_museum', formData);

      fetchMuseums();
      setNewMuseumName('');
      setNewMuseumLocation('');
    } catch (error) {
      console.error('Error adding museum:', error);
    }
  }

  async function deleteMuseums() {
    try {
      const museumIdsToDelete = selectedMuseums.map(museum => museum.id);
      
      await Promise.all(museumIdsToDelete.map(async museumId => {
        await axios.delete(`http://127.0.0.1:5000/delete_museum/${museumId}`);
      }));

      fetchMuseums();
      setSelectedMuseums([]);
    } catch (error) {
      console.error('Error deleting museums:', error);
    }
  }

  function handleMuseumSelect(museumId) {
    if (selectedMuseums.some(museum => museum.id === museumId)) {
      setSelectedMuseums(selectedMuseums.filter(museum => museum.id !== museumId));
    } else {
      setSelectedMuseums([...selectedMuseums, museums.find(museum => museum.id === museumId)]);
    }
  }

  function handleEditClick(museum) {
    setEditMuseum(museum); // Устанавливаем выбранный музей для редактирования
  }

  // Функция для сохранения изменений в музее
  async function saveEditMuseum() {
    try {
      await axios.put(`http://127.0.0.1:5000/update_museum/${editMuseum.id}`, editMuseum);
      fetchMuseums();
      setEditMuseum(null); // Очищаем состояние выбранного музея для редактирования
    } catch (error) {
      console.error('Error editing museum:', error);
    }
  }

  useEffect(() => {
    fetchMuseums();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h2>List of Museums</h2>
        {/* Добавляем кнопку "Добавить музей", которая перенаправляет на страницу /add_museum */}
        <div>
          <input
            type="text"
            value={newMuseumName}
            onChange={(e) => setNewMuseumName(e.target.value)}
            placeholder="Enter new museum name"
            style={{ marginRight: '10px' }} //
          />
          <input
            type="text"
            value={newMuseumLocation}
            onChange={(e) => setNewMuseumLocation(e.target.value)}
            placeholder="Enter new museum location"
            style={{ marginRight: '10px' }} //
          />
          <button className="add-btn" onClick={addMuseum}>Добавить музей</button>
        </div>
        <ul>
          {museums && museums.length > 0 ? (
            museums.map((museum, index) => (
              <li key={index} className={`museum-item ${selectedMuseums.some(selectedMuseum => selectedMuseum.id === museum.id) ? 'selected' : ''}`} onClick={() => handleMuseumSelect(museum.id)}>
                <div className="buttons-right">
                  {editMuseum && editMuseum.id === museum.id ? ( // Если выбран музей для редактирования, отображаем поля ввода для редактирования
                    <div>
                      <input
                        type="text"
                        value={editMuseum.name}
                        onChange={(e) => setEditMuseum({ ...editMuseum, name: e.target.value })}
                        placeholder="Enter museum name"
                      />
                      <input
                        type="text"
                        value={editMuseum.location}
                        onChange={(e) => setEditMuseum({ ...editMuseum, location: e.target.value })}
                        placeholder="Enter museum location"
                      />
                      <button className="save-btn" onClick={saveEditMuseum}>Сохранить изменения</button>
                    </div>
                  ) : (
                    <div>
                      <span>{museum.name} - {museum.location}</span>
                      <div>
                        {/* Добавляем кнопку редактирования музея */}
                        <button className="edit-btn" onClick={() => handleEditClick(museum)}>
                          <img src={editIcon} alt="Edit" className="edit-icon" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))
          ) : (
            <li>No museums found.</li>
          )}
        </ul>
        <div>
          <button className="delete-btn" onClick={deleteMuseums}>
            <img src={deleteIcon} alt="Delete" className="delete-icon" style={{ width: '100px', height: 'auto' }} />
          </button>
          <div>
          </div>
          {/* Replaced Pagination buttons with links */}
            <Link to="/countries" className="pagination-link">
                &lt; Previous
                </Link>{" "}
            <Link to="/artists" className="pagination-link">
            Next &gt;
            </Link>
        </div>
      </header>
    </div>
  );
}

export default MuseumsPage;
