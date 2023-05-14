import logo from './logo.svg';
import { useState, useEffect } from "react"
import './App.css';
import axios from "axios"

let eventSource;
function App() {
  const [notification, setNotification] = useState()
  const [loading, setLoading] = useState()

  useEffect(() => {
    //event source 
  }, [])

  const download = () => {
    let sent = false;
    return async () => {
      if (!sent) {
        let book;
        sent = true
        axios({
          url: 'http://localhost:4000/download',
          method: 'GET',
          responseType: 'blob',
          onDownloadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`Download progress: ${percentCompleted}%`);
            setLoading(percentCompleted)
          }
        }).then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'book.mov');
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
          sent = false
        }).catch(error => {
          console.error('Download error', error);
          sent = false;
        });
      }
    }
  }
  const getNotification = () => {
    eventSource = new EventSource('http://localhost:4000/notification');
    eventSource.addEventListener('message', (event) => {
      // setNotifications((notifications) => [...notifications, JSON.parse(event.data)]);
      console.log(event.data)
      setNotification(event.data)
    });
  }

  const stopNotification = () => {
    eventSource?.close();
  }
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={download()}>Download</button>
        <br />
        {loading !== 100 ? `Downloading : ${loading ?? 0}%` : "Installing"}
        <button onClick={getNotification}>Notification</button>
        <br />
        <button onClick={() => { stopNotification() }}>Stop Notification</button>
        <br />
        {notification}
      </header>
    </div>
  );
}

export default App;
