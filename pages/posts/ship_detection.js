import Link from "next/link"
import React, { useRef, useEffect, useState} from 'react';
import mapboxgl from '!mapbox-gl';

import "mapbox-gl/dist/mapbox-gl.css"

// CHANGE here
mapboxgl.accessToken = 'pk.eyJ1Ijoid2hhdGEiLCJhIjoiY2tqNml5bmttNHQ5NTJ6bHI5aWk2aTV0biJ9.BSy4svuKev-alXyMRYqb5A';


export default function App() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(140.194);
    const [lat, setLat] = useState(35.428);
    const [zoom, setZoom] = useState(9);

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/satellite-v9',
            center: [lng, lat],
            zoom: zoom
        });

        map.current.on('load', () => {
            renderShips(map);
            renderGT(map);
        });
    });

    useEffect(() => {
        if (!map.current) return;
        map.current.on('move', () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        });

        map.current.on('click', 'result0', (e) => {
            const subgrid_id = e.features[0].properties.subgrid_id;
            const class_pred = e.features[0].properties.class_pred;
            const class_target = e.features[0].properties.class_target;

            new mapboxgl.Popup({className: "popup"})
            .setLngLat(e.lngLat)
            .setMaxWidth('600px')
            .setHTML(
                `<div>
                    <strong>ID: ${subgrid_id}</strong>
                    <p>Pred: ${class_pred}</p>
                    <p>Target: ${class_target}</p>
                </div>`
            )
            .addTo(map.current);
        });
    });

    return (
        <>
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta
                name="description"
                content="ship deetection visualizer"
                />
                <title>ship deetection visualizer</title>
            </head>
            <body>
                <noscript>You need to enable JavaScript to run this app.</noscript>
                <div>
                    <div className="sidebar">
                        Latitude: {lat} | Longitude: {lng} | Zoom: {zoom}
                    </div>
                    <div ref={mapContainer} className="map-container" />
                </div>
            </body>
            <footer>
                <a
                href="https://github.com/whata92/ship_detection_viewer"
                target="_blank"
                rel="noopener noreferrer"
                >
                Powered by{' '}
                <img src="/type-color-1.png" alt="web app" className="logo" />
                </a>
            </footer>

            <style jsx>{`
                .map-container {
                    height: 800px;
                }
                .sidebar {
                    background-color: rgba(35, 55, 75, 0.9);
                    color: #fff;
                    padding: 6px 12px;
                    font-family: monospace;
                    z-index: 1;
                    position: absolute;
                    top: 0;
                    left: 0;
                    margin: 12px;
                    border-radius: 4px;
                }
                footer {
                    width: 100%;
                    height: 100px;
                    border-top: 1px solid #eaeaea;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                footer img {
                    margin-left: 0.5rem;
                }
                footer a {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .logo {
                    height: 1em;
                  }
                `}</style>
        </>
    );
}


function renderShips(map) {
    map.current.addSource('binaryEval', {
        'type': 'geojson',
        'data': result
    });

    map.current.addLayer({
        'id': 'result0',
        'type': 'fill',
        'source': 'binaryEval',
        'layout': {},
        'paint': {
            'fill-color': '#000000',
            'fill-opacity': 0,
        },
    });
};