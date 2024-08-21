import { useRef } from 'react';
import './map.scss';

export default function Map() {
    const map = useRef();
    const mapCloseBtn = useRef();

    const mapOpen = () => {
        const aspectRatio = 16 / 9; // Aspect ratio 1920/1080

        // Get the screen width and height
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        // Calculate dimensions to maintain the aspect ratio
        let newWidth, newHeight;

        if (screenWidth / screenHeight > aspectRatio) {
            // Width is the limiting factor
            newWidth = screenHeight * aspectRatio;
            newHeight = screenHeight;
        } else {
            // Height is the limiting factor
            newWidth = screenWidth;
            newHeight = screenWidth / aspectRatio;
        }

        map.current.style.height = `${newHeight*9/10}px`;
        map.current.style.width =  `${newWidth*9/10}px`;
        // map.current.style.aspectRatio = '1920/1080';
        map.current.style.right = '5%';
        map.current.style.bottom = '5%';
        map.current.style.borderRadius = '2vw';
        map.current.style.pointerEvents = 'auto';
        mapCloseBtn.current.style.display = 'block';
    }

    const mapClose = (e) => {
        e.stopPropagation();
        map.current.style.height = '15vh';
        map.current.style.width = '15vh';
        map.current.style.right = '1%';
        map.current.style.bottom = '1%';
        map.current.style.borderRadius = '50%';
        map.current.style.pointerEvents = 'all';
        mapCloseBtn.current.style.display = 'none';
    }

    return (
        <div id="map" ref={map} onClick={mapOpen}>
            <div id="allCursPos">

            </div>
            <div className="close" onClick={mapClose} ref={mapCloseBtn}></div>
        </div>
    );
}
