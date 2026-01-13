import { useEffect, useState, useRef } from "react"
import geometry from "./contours.json"

export default function SVG({ setObl, markers, setMarkers }) {

    // индекс объекта для редактрования уже существующего
    const [editingIndex, setEditingIndex] = useState(null)

    // флаг для отслеживания режима редактирования
    const [editMode, setEditMode] = useState(false)

    // размеры вьюбокса для его редактирования
    const [viewBox, setViewBox] = useState({
        x: 200,
        y: 150,
        w: 1200,
        h: 800,
    })

    // флаг для отслеживания поведения мыши (был ли щелчок или провели мышкой)
    const [wasDrag, setWasDrag] = useState(false)

    // рефы для отслеживания мышки при нажатии 
    const dragState = useRef({
        isDragging: false,  // при нажатии - true, при отпускании - false
        startViewBox: { x: 0, y: 0 }, //предыдущее состояние вьюбкоса
        startMouse: { x: 0, y: 0 } // начальное положение мышки
    })

    const handleMarker = (event) => {
        if (wasDrag) return // если было зажатие - не создаем маркер

        const svg = event.currentTarget
        const point = svg.createSVGPoint()

        point.x = event.clientX
        point.y = event.clientY

        const svgPoint = point.matrixTransform(svg.getScreenCTM().inverse())

        const newMarker = {
            id: Date.now(),
            name: 'Новая точка',
            description: 'Описание',
            coords: {
            x: svgPoint.x,
            y: svgPoint.y,
            }
        }
        

        setMarkers(prev => [...prev, newMarker])

        setEditingIndex(markers.length)
    
        setEditMode(true)
    }
    
    const updateMarker = (index, field, value) => {
    setMarkers(prev => {
        const updatedMarkers = [...prev]
        updatedMarkers[index] = {
        ...updatedMarkers[index],
        [field]: value
        }

        return (updatedMarkers)
    })

    }

    const deleteMarker = (index) => {
    setMarkers(prev => prev.filter((_, i) => i !== index))
    if (index === editingIndex) {
        setEditMode(false)
        setEditingIndex(null)
    }
    }

    useEffect(() => {
    const svg = document.getElementById('map')

    const handleWheel = (el) => {
        el.preventDefault()

        const point = svg.createSVGPoint()

        point.x = el.clientX
        point.y = el.clientY

        const svgPoint = point.matrixTransform(svg.getScreenCTM().inverse())

        const zoomIntensity = 0.1 // Чувствительность зума
        const wheel = el.deltaY > 0 ? 1 : -1
        const zoom = Math.exp(wheel * zoomIntensity)

        if (viewBox.h  * zoom > 1600 || viewBox.h * zoom  < 160) { return }

    
        const newViewBox = {
        x: Math.max(300 - viewBox.w / 2, Math.min(viewBox.x + (svgPoint.x - viewBox.x) * (1 - zoom), 1200 - viewBox.w / 2)),
        y: Math.max(200 - viewBox.h / 2, Math.min(viewBox.y + (svgPoint.y - viewBox.y) * (1 - zoom), 800 - viewBox.h / 2)),
        w: viewBox.w * zoom,
        h: viewBox.h * zoom,
        }

        setViewBox(newViewBox)
    }

    const handleMouseDown = (e) => {
        e.stopPropagation()
        setWasDrag(false)
        dragState.current.isDragging = true
        dragState.current.startMouse.x = e.clientX
        dragState.current.startMouse.y = e.clientY
        dragState.current.startViewBox = { ...viewBox }
        
        // Меняем курсор
        svg.style.cursor = 'grabbing'
    }

    const handleMouseMove = (e) => {
        if (!dragState.current.isDragging) return
        
        const dx = e.clientX - dragState.current.startMouse.x
        const dy = e.clientY - dragState.current.startMouse.y
        
        const scaleX = viewBox.w / svg.clientWidth
        const scaleY = viewBox.h / svg.clientHeight
        
        const newViewBox = {
        x: Math.max(300 - viewBox.w / 2, Math.min(dragState.current.startViewBox.x - dx * scaleX, 1200 - viewBox.w / 2)),
        y: Math.max(200 - viewBox.h / 2, Math.min(dragState.current.startViewBox.y - dy * scaleY, 800 - viewBox.h / 2)),
        w: viewBox.w,
        h: viewBox.h
        }

        setViewBox(newViewBox)
    }

    const handleMouseUp = (e) => {
        dragState.current.isDragging = false
        svg.style.cursor = 'grab'

        if (Math.abs(dragState.current.startMouse.x - e.clientX) > 3 || Math.abs(dragState.current.startMouse.y - e.clientY) > 3) {
            setWasDrag(true)
        }
    }

    svg.addEventListener('wheel', handleWheel, {passive: false})
    svg.addEventListener('mousedown', handleMouseDown)
    svg.addEventListener('mousemove', handleMouseMove)
    svg.addEventListener('mouseup', handleMouseUp)
    svg.addEventListener('mouseleave', handleMouseUp)

    return () => {
        svg.removeEventListener('wheel', handleWheel)
    svg.removeEventListener('mousedown', handleMouseDown)
    svg.removeEventListener('mousemove', handleMouseMove)
    svg.removeEventListener('mouseup', handleMouseUp)
    svg.removeEventListener('mouseleave', handleMouseUp)
    }
    }, [viewBox])

    return(
    <>
        <svg 
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`} 
          id="map" 
          onClick={e => handleMarker(e)}
        >
          {geometry.contours.map(contour => (
            <path 
              strokeWidth={viewBox.h/1000}
              key={contour.id} 
              id={contour.id} 
              d={contour.d} 
              onMouseOver={() => setObl({
                id: contour.id,
                name: contour.name,
                disc: contour.disc
              })}
              style={{ cursor: 'pointer' }}
            />
          ))}
          
          {geometry.polygons.map(polygon => (
            <polygon 
              strokeWidth={viewBox.h/1000}
              key={polygon.id} 
              id={polygon.id} 
              points={polygon.points} 
              onMouseOver={() => setObl({
                id: polygon.id,
                name: polygon.name,
                disc: polygon.disc
              })}
              style={{ cursor: 'pointer' }}
            />
          ))}
          
          {markers.map((marker, index) => (
            <g 
              key={marker.id}
              onClick={(e) => {
                e.stopPropagation()
                setEditingIndex(index)
                setEditMode(true)
              }}
              style={{ cursor: 'pointer' }}
            >
              <circle 
                cx={marker.coords.x} 
                cy={marker.coords.y} 
                r={viewBox.h/200} 
                fill="red" 
                stroke="black" 
                strokeWidth={viewBox.h/400}
              />
              <circle 
                cx={marker.coords.x} 
                cy={marker.coords.y} 
                r={viewBox.h/200} 
                fill="none" 
                stroke="red" 
                strokeWidth={viewBox.h/400}
                opacity="0"
              >
                <animate
                  attributeName="r"
                  from={viewBox.h/100} 
                  to={viewBox.h/50} 
                  dur="1s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.5; 0; 0"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          ))}
        </svg>

        {editMode && editingIndex !== null && markers[editingIndex] && (
        <div id="sight-edit" onClick={() => setEditMode(false)}>
            <form onSubmit={(e) => e.preventDefault()} onClick={(e) => e.stopPropagation()}>
            <label htmlFor="sight-name">Название достопримечательности:</label>
            <input 
                type="text" 
                id="sight-name" 
                placeholder="Название" 
                value={markers[editingIndex]?.name || ''}
                onChange={e => updateMarker(editingIndex, 'name', e.target.value)}
            />
            
            <label htmlFor="sight-desc">Описание достопримечательности:</label>
            <textarea
                id="sight-desc" 
                placeholder="Описание"
                value={markers[editingIndex]?.description || ''}
                onChange={e => updateMarker(editingIndex, 'description', e.target.value)}
                onClick={(e) => e.stopPropagation()}
                rows={5} // Количество строк
                cols={50} 

            />
            
            <div>
                <button type="button" onClick={() => setEditMode(false)}>
                Закрыть
                </button>
                <button 
                type="button" 
                onClick={() => deleteMarker(editingIndex)}
                style={{ marginLeft: '10px', backgroundColor: '#ff4444' }}
                >
                Удалить
                </button>
            </div>
            </form>
        </div>
        )}
    </>
    )}