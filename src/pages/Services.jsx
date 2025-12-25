import { useState, useEffect } from 'react';
import axios from 'axios';
import './Services.css'; // Make sure to import the CSS

export default function Services() {
  const [services, setServices] = useState([]); // Store fetched services
  const [selectedServices, setSelectedServices] = useState(new Set()); // Manage selected services
  const [showAdd, setShowAdd] = useState({ open: false, section: null });
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Fetch services from the backend with JWT token
  useEffect(() => {
    const token = localStorage.getItem('access');  // Get the token from localStorage

    if (!token) {
      alert('No authentication token found. Please log in.');
      return;
    }

    // Make the API request with Authorization header
    axios
      .get('http://127.0.0.1:8000/api/service/services', {
        headers: {
          'Authorization': `Bearer ${token}`, // Attach the token here
        },
      })
      .then((response) => {
        console.log('Fetched services data:', response.data); 
        setServices(response.data); // Set the fetched data
      })
      .catch((error) => {
        console.error('Error fetching services:', error);
        alert('Failed to fetch services');
      });
  }, []);  // Empty dependency array to run the effect on mount

  // Toggle service selection
  function toggle(serviceId) {
    setSelectedServices((prev) => {
      const next = new Set(prev);
      if (next.has(serviceId)) next.delete(serviceId);
      else next.add(serviceId);
      return next;
    });
  }

  // Open the modal for adding custom service
  function openAdd(section) {
    setShowAdd({ open: true, section });
    setNewTitle('');
    setNewDesc('');
    setNewImage(null);
    setPreviewUrl(null);
  }

  // Close the modal
  function closeAdd() {
    setShowAdd({ open: false, section: null });
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }

  // Handle image upload for the custom service
  function handleImage(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setNewImage(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }

  // Add custom service and update the state dynamically
  function addCustom() {
    if (!newTitle.trim()) {
      alert('Please enter a title for the service');
      return;
    }

    const id = `${showAdd.section}-${Date.now()}`;
    const svc = {
      id,
      title: newTitle.trim(),
      description: newDesc.trim(),
      selected_services: Array.from(selectedServices), // Convert Set to Array
    };
    if (previewUrl) svc.imageUrl = previewUrl;

    const section = showAdd.section.toLowerCase();

    setServices((prev) => {
      const updatedServices = { ...prev };
      if (!updatedServices[section]) updatedServices[section] = [];
      updatedServices[section].push(svc);
      return updatedServices;
    });

    setSelectedServices((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });

    closeAdd();
  }

  return (
    <div className="services-bg">
      <main className="services-page">
        <header className="services-hero">
          <h1 className="services-title">Our <span>Services</span></h1>
          <p className="services-lead">
            Comprehensive engineering solutions tailored to meet your project needs.
          </p>
        </header>

        {/* Dynamically render the service sections */}
        {services.map((service) => (
          <section className="services-section" key={service.id}>
            <h2 className="section-heading">
              <span className="bar" />
              {service.name} {/* Display the main service name */}
            </h2>
            <div className="cards-grid">
              {service.service_info.map((subService) => (
                <article
                  key={subService.id}
                  className={`service-card ${selectedServices.has(subService.id) ? 'selected' : ''}`}
                  onClick={() => toggle(subService.id)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="icon-wrap">
                    {/* Custom check icon for selected services */}
                  </div>
                  <div>
                    <p className="card-text">{subService.name}</p> {/* Display only sub-service name */}
                  </div>
                </article>
              ))}
              <div className="add-card" onClick={() => openAdd(service.name)}>
                + Add Custom Service
              </div>
            </div>
          </section>
        ))}

        {/* Custom Service Modal */}
        {showAdd.open && (
          <div className="modal-overlay" onClick={closeAdd}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeAdd} aria-label="Close">×</button>
              <div className="modal-header">
                <h3>Add Custom {showAdd.section} Service</h3>
                <p className="modal-sub">Add a custom service with an image and description</p>
              </div>

              <div className="modal-body">
                <label className="field">
                  <div className="field-label">Service Title</div>
                  <input
                    className="field-input"
                    placeholder="Enter service title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </label>

                <label className="field">
                  <div className="field-label">Description</div>
                  <textarea
                    className="field-textarea"
                    placeholder="Enter service description"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                  />
                </label>

                <label className="field">
                  <div className="field-label">Service Image</div>
                  <input className="field-file" type="file" accept="image/*" onChange={handleImage} />
                </label>

                {previewUrl && <div className="image-preview"><img src={previewUrl} alt="preview" /></div>}

                <div className="modal-actions">
                  <button onClick={addCustom} className="add-service-btn">Add Service</button>
                  <button onClick={closeAdd} className="cancel-btn">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
