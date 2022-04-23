import styles from "../styles/Map.module.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

export default function Map({}) {
  const MAPBOX_API_KEY =
    "pk.eyJ1IjoiaG9jZXZhciIsImEiOiJjbDJjY2hxZG0wZzhhM2NxcnY0NGIzOG96In0.B22sqGMg9TTE046QS93sNA";
  return (
    <div className={styles.map}>
      <MapContainer
        center={[40.8054, -74.0241]}
        zoom={14}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_API_KEY}`}
          // url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.MAPBOX_API_key}`}
          attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
        />
        <Marker position={[40.8054, -74.0241]} draggable={true} animate={true}>
          <Popup>Hey ! I live here</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
