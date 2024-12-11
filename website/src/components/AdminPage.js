import React, { useState } from 'react';
import CSVUploadComponent from './CSVUploadComponent';
import LiveUpdates from './LiveUpdates';
import '../css/AdminPage.css';
import logo from '../PickupLogo.png'; // Adjust the path as necessary
import {getAuth, signOut} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';


const AdminPage = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [notification, setNotification] = useState('');
    const navigate = useNavigate();

    
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log(`File selected: ${file.name}`);
            setSelectedFile(file);
            setNotification('');
        }
    };


    // Used by the signout button to sign users out of the administrator pages. 
    const handleLogout = async (event) => {
        const auth = getAuth();
        try {
            await signOut(auth);
            navigate('/login');
        } catch (e)
        {
            console.log('Sign out failed.');
        }
    }


    const handleProcessingNotification = (message) => {
        setNotification(message);
    };

    const notificationClass = notification === 'Processing Complete' ? 'notification-success' : 'notification-error';

    const Footer = () => (
        <footer className="App-footer">
            <p>For more information, visit the <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer">Firebase Dashboard</a>. Be sure to login with the EPICS provided credentials.</p>
            <p>For help with any issues or concerns, please contact the current project partner liaison.</p>
        </footer>
    );

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className='App-logo' alt="Logo" />
                <div className="button-wrapper">
                    {notification && (
                        <div className={`notification ${notificationClass}`}>
                            {notification}
                        </div>
                    )}
                    <div>
                        <input type="file" onChange={handleFileUpload} accept=".csv" id="csvFileInput" style={{ display: 'none' }} />
                        <label htmlFor="csvFileInput" className="button">Upload Data</label>
                        <button className="button2" onClick={handleLogout}>Sign Out</button>
                    </div>
                </div>
            </header>
            {selectedFile && <CSVUploadComponent file={selectedFile} onProcessingResult={handleProcessingNotification} />}
            <div className='LiveUpdate-Table'>
                <LiveUpdates />
            </div>
            <Footer className="App-footer" />
        </div>
    );
}

export default AdminPage;
