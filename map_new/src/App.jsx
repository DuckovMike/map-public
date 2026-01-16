import geometry from "./contours.json"
import './app.css'
import { useState } from "react"
import sights from './sights.json'
import SVG from './SVG.jsx'
import Obl from './Obl.jsx'


export default function App() {

  const [markers, setMarkers] = useState(sights.sights) // Пустой массив для маркеров
  const [obl, setObl] = useState({
    id: geometry.contours[0]?.id || '',
    name: geometry.contours[0]?.name || '',
    disc: geometry.contours[0]?.disc || ''
  })
  

  async function saveData() {
    try {
    const response = await fetch('http://85.143.217.205/api//save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        sights: markers.map(marker => ({
          id: marker.id,
          name: marker.name,
          description: marker.description,
          coords: marker.coords
        }))
      })
    })
    if (response) {
      alert('Точки сохранены')
    }
    } catch (e) {
      alert('Ошибка:', e)
    }
  }

  return (
    <>
      <div id="body">
  
        <SVG setObl={setObl} markers={markers} setMarkers={setMarkers}/>
        
        <div id="description">
          <Obl obl={obl}/>
          <button onClick={() => saveData()}>Сохранить изменения</button>
        </div>

      </div>
      
    </>
  )
}
