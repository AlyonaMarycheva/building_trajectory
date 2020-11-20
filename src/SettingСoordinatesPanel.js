import './SettingCoordinatesPanel.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const SettingCoordinatesPanel = ( {coordinateList, setCoordinateList} ) => {
  const [isVisibleNotification, setIsVisibleNotification] = useState(false);
  const [place, setPlace] = useState('');
  const initialDnDState = {
    previousPlace: null,
    newPlace: null,
    isDragging: false,
    originalOrder: [],
    updatedOrder: []
  };
  const [dragAndDrop, setDragAndDrop] = useState(initialDnDState);
  useEffect(() => {
    setTimeout(() => setIsVisibleNotification(false), 2000);
  }, [isVisibleNotification]);

  useEffect(() => {
    setDragAndDrop({
      ...dragAndDrop,
       updatedOrder: coordinateList
      })
  }, [coordinateList]);

  const getAddress = async () => {
    try {
      const response = await axios.get(`https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${process.env.REACT_APP_API_KEY}&geocode=${place}`);
      let point = response.data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(" ").map(Number).reverse();
      setCoordinateList(coordinateList.concat([point]));
      setPlace('');
    } catch(exception) {
      setIsVisibleNotification(true);
      setPlace('');
    }
  };

  const addAddress = (e) => {
    e.preventDefault();
    getAddress();
  }

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
        {isVisibleNotification ? <div className="notification">Ничего не найдено:(</div>: null}
    </div> 
  )
}
