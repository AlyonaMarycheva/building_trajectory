import './App.css';
import React, { useState} from 'react';
import { YMaps, Map, Polyline } from 'react-yandex-maps';
import { SettingCoordinatesPanel } from './SettingСoordinatesPanel.js';

export const App = () => {
  const [coordinateList, setCoordinateList] = useState([]);

  return (
    <div className="container">
      <header className="header">Построение траектории</header>
      <div className="content">
        <div className="map">
          <YMaps>
            <Map
              className="map__item"
              defaultState={{
                center: [55.753215, 37.622504],
                zoom: 5,
              }}
            >
              <Polyline
                geometry={coordinateList}
                options={{
                  balloonCloseButton: false,
                  strokeColor: '#6CC164',
                  strokeWidth: 3,
                  strokeOpacity: 0.5,
                }}
              />
            </Map>
          </YMaps>
        </div>
        <SettingCoordinatesPanel coordinateList={coordinateList} setCoordinateList={setCoordinateList}/>
      </div>
    </div>
  );
}

