const params = new URLSearchParams(window.location.search);
const journeyId = params.get("id");

let map;

let startMarker;
let endMarker;
let currentMarker;

let directionsService;
let directionsRenderer;

let routeDrawn = false;

function initMap() {

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: { lat: 20, lng: 78 }
    });

    directionsService = new google.maps.DirectionsService();

    directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        preserveViewport: true,
        polylineOptions: {
            strokeColor: "#4285F4",
            strokeWeight: 6
        }
    });

    directionsRenderer.setMap(map);

    db.collection("journeys")
        .doc(journeyId)
        .onSnapshot((doc) => {

            if (!doc.exists) return;

            const data = doc.data();

            const start = {
                lat: data.startLat,
                lng: data.startLng
            };

            const end = {
                lat: data.endLat,
                lng: data.endLng
            };

            const current = {
                lat: data.currentLat,
                lng: data.currentLng
            };

            createMarkers(start, end, current);

            // Draw route only once
            if (!routeDrawn) {

                drawRoute(start, end);

                fitBounds(start, end);

                routeDrawn = true;
            }

            // Move only the current marker
            currentMarker.setPosition(current);

            // Optional: keep map centered on current location
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

function drawRoute(start, end) {

    console.log("Start:", start);
    console.log("End:", end);

    directionsService.route(
        {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING
        },
        (result, status) => {

            console.log("Directions Status:", status);
            console.log(result);

            if (status === "OK") {

                directionsRenderer.setDirections(result);

                const leg = result.routes[0].legs[0];

                document.getElementById("distance").innerHTML =
                    "Distance : " + leg.distance.text;

                document.getElementById("eta").innerHTML =
                    "ETA : " + leg.duration.text;

            } else {

                alert("Directions Error : " + status);

            }

        }
    );

}

function fitBounds(start, end) {

    const bounds = new google.maps.LatLngBounds();

    bounds.extend(start);

    bounds.extend(end);

    map.fitBounds(bounds);

}
