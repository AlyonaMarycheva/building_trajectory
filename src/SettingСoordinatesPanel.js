import React, { useState} from 'react';
import './SettingCoordinatesPanel.css';
import axios from 'axios';

const baseUrl = 'https://geocode-maps.yandex.ru/1.x/?format=json&apikey=0886277a-1ec8-4078-a870-98da4989ef08&geocode=';

const SettingCoordinatesPanel = ( {coordinateList, setCoordinateList} ) => {
  const [isVisible, setIsVisible] = useState(false);
  const [place, setPlace] = useState('');

  const addAddress = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${baseUrl}${place}`);
      let point = response.data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(" ").map(Number).reverse();
      setCoordinateList(coordinateList.concat([point]));
      setDragAndDrop({
        ...dragAndDrop,
         updatedOrder: coordinateList
        })
      setPlace('');
    } catch(exception) {
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 2000);
      setPlace('');
    }
  };

  const initialDnDState = {
    previousPlace: null,
    newPlace: null,
    isDragging: false,
    originalOrder: [],
    updatedOrder: []
  }
  const [dragAndDrop, setDragAndDrop] = useState(initialDnDState);

  const onDragStart = (event) => {
    const initialPosition = Number(event.currentTarget.dataset.position);
  
    setDragAndDrop({
      ...dragAndDrop, 
      previousPlace: initialPosition,
      isDragging: true, 
      originalOrder: coordinateList 
    });

    event.dataTransfer.setData("text/html", '');//для Mozila
  }

  const onDragOver = (event) => {
    event.preventDefault();

    let newCoordinateList = dragAndDrop.originalOrder;
    const newPlace = Number(event.currentTarget.dataset.position); 

    const previousPlace = dragAndDrop.previousPlace; 
    const itemDragged = newCoordinateList[previousPlace];
    const remainingItems = newCoordinateList.filter((item, index) => index !== previousPlace);
    
    newCoordinateList = [
      ...remainingItems.slice(0, newPlace),
      itemDragged,
      ...remainingItems.slice(newPlace)
    ];
  
    if (newPlace !== dragAndDrop.newPlace){
      setDragAndDrop({
      ...dragAndDrop,
      updatedOrder: newCoordinateList, 
      newPlace: newPlace
      })
    }
  }
  const onDrop = () => {
    setCoordinateList(dragAndDrop.updatedOrder);
    setDragAndDrop({
      ...dragAndDrop,
      previousPlace: null,
      newPlace: null,
      isDragging: false
    });
  }

  const onDragLeave = () => {
    setDragAndDrop({
    ...dragAndDrop,
    newPlace: null
   });
  }

  return (
    <div className="sidebar">
      <form onSubmit={addAddress}>
        <input 
          value={place} 
          onChange={(e) => setPlace(e.target.value)}
          placeholder="Введите адрес..."
        />
      </form>
        <ul className="list">
        {coordinateList.map((coordinate, index) => 
          <li 
            key={index}
            data-position={index}
            draggable

            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragLeave={onDragLeave}

            className={dragAndDrop && dragAndDrop.newPlace=== Number(index) ? "dropArea" : ""}
          >
           {coordinate[0]}, {coordinate[1]}
          </li>)}
        </ul>
        {isVisible ? <div className="notification">Ничего не найдено:(</div>: null}
    </div> 
  )
}

export default SettingCoordinatesPanel;