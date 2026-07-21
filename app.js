const params = new URLSearchParams(window.location.search);
const journeyId = params.get("id");

let map;

let startMarker;
let endMarker;
let currentMarker;

let routeLine;        // Straight line: Start -> Destination
let travelledLine;    // Green line: Travelled path

let travelledPath = [];

function initMap() {

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: { lat: 20, lng: 78 }
    });

    db.collection("journeys")
        .doc(journeyId)
        .onSnapshot((doc) => {

            if (!doc.exists) return;

            const data = doc.data();

            const start = {
                lat: Number(data.startLat),
                lng: Number(data.startLng)
            };

            const end = {
                lat: Number(data.endLat),
                lng: Number(data.endLng)
            };

            const current = {
                lat: Number(data.currentLat),
                lng: Number(data.currentLng)
            };

            createMarkers(start, end, current);

            // Draw the route only once
            if (!routeLine) {

                drawStraightRoute(start, end);

                fitBounds(start, end);

            }

            // Move current marker
            currentMarker.setPosition(current);

            // Add current location to travelled path
           if (
    travelledPath.length === 0 ||
    travelledPath[travelledPath.length - 1].lat !== current.lat ||
    travelledPath[travelledPath.length - 1].lng !== current.lng
) {
    travelledPath.push(current);
}

            // Draw/update travelled path
            updateTravelledPath();

            // Update distance information
            updateDistance(start, end, current);

            // Keep current location in view
            map.panTo(current);

        });

}

function createMarkers(start, end, current) {

    if (!startMarker) {

        startMarker = new google.maps.Marker({
            position: start,
            map: map,
            label: "S"
        });

    }

    if (!endMarker) {

        endMarker = new google.maps.Marker({
            position: end,
            map: map,
            label: "E"
        });

    }

    if (!currentMarker) {

        currentMarker = new google.maps.Marker({
            position: current,
            map: map,
            title: "Current Location",
            icon: {
                url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            }
        });

    }

}

function drawStraightRoute(start, end) {

    routeLine = new google.maps.Polyline({

        path: [start, end],

        geodesic: true,

        strokeColor: "#1E88E5",

        strokeOpacity: 1,

        strokeWeight: 5

    });

    routeLine.setMap(map);

}

function updateTravelledPath() {

    if (!travelledLine) {

        travelledLine = new google.maps.Polyline({

            path: travelledPath,

            geodesic: true,

            strokeColor: "#00C853",

            strokeOpacity: 1,

            strokeWeight: 6

        });

        travelledLine.setMap(map);

    } else {

        travelledLine.setPath(travelledPath);

    }

}

function updateDistance(start, end, current) {

    const total =
        google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(start.lat, start.lng),
            new google.maps.LatLng(end.lat, end.lng)
        );

    const remaining =
        google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(current.lat, current.lng),
            new google.maps.LatLng(end.lat, end.lng)
        );

    const travelled = total - remaining;

    document.getElementById("distance").innerHTML =
        "Remaining : " + (remaining / 1000).toFixed(2) + " km";

    document.getElementById("eta").innerHTML =
        "Travelled : " + Math.max(0, travelled / 1000).toFixed(2) + " km";

}

function fitBounds(start, end) {

    const bounds = new google.maps.LatLngBounds();

    bounds.extend(start);

    bounds.extend(end);

    map.fitBounds(bounds);

}
