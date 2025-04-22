mapboxgl.accessToken = 'pk.eyJ1IjoibWFoYWFsZGF3b29kIiwiYSI6ImNtOThyeDFzYTA2NjEya3B3ZmVkbnBlNzUifQ.a2NLZb3e_7Ezo1smY7SpMQ';

const mapOptions = {
    container: 'map-container',
    style: "mapbox://styles/mapbox/light-v11",
    center: [-73.99432, 40.71103],
    zoom: 10
};

const map = new mapboxgl.Map(mapOptions);

// nta boundries layer
map.on('load', () => {
    map.addSource('nta', {
        type: 'geojson',
        data: 'nta.geojson'
    });

    map.addLayer({
        id: 'fillnta',
        type: 'fill',
        source: 'nta',
        paint: {
            'fill-opacity': 0.1,
            'fill-color': [
                'match',
                ['get', 'BoroName'],
                'Queens', '#f4f455',
                'Bronx', '#FF9900',
                'Brooklyn', '#ea6661',
                'Manhattan', '#5CA2D1',
                'Staten Island', '#d36ff4',
                /* other */ '#000'
            ]
        }
    });

    // add width 
    map.addLayer({
        id: 'outlinenta',
        type: 'line',
        source: 'nta',
        paint: {
            'line-color': 'gray',
            'line-width': 0.3
        },
        slot: 'middle'
    });

    //  parks layer
    map.addSource('parks', {
        type: 'geojson',
        data: 'parks.geojson'
    });

    map.addLayer({
        id: 'fillparks',
        type: 'fill',
        source: 'parks',
        paint: {
            'fill-color': '#8ece7c',
            'fill-opacity': 0.5,
        }
    });

    //    add popups on parks layer when hover
    map.on('mouseenter', 'fillparks', (e) => {
        map.getCanvas().style.cursor = 'pointer';
        const park = e.features[0];
        const parkInfo = `
            <h3>${park.properties.name311}</h3>
            <p style="margin: 0;">${park.properties.typecatego}</p>
            
        `;
        document.getElementById('park-info').innerHTML = parkInfo;
    });

    map.on('mouseleave', 'fillparks', () => {
        map.getCanvas().style.cursor = '';
        document.getElementById('park-info').innerHTML = 'Click on a park to see details here.';  // Reset sidebar
    });

    // if clicked on the nta it also shows neighborhood name
    map.on('click', 'fillnta', (e) => {
        const nta = e.features[0];
        new mapboxgl.Popup({ offset: 36 })
            .setLngLat(e.lngLat)
            .setHTML(`
                <h3>${nta.properties.NTAName}</h3>

            `)
            .addTo(map);
    });

});




