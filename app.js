const params = new URLSearchParams(window.location.search);

const journeyId = params.get("id");

let map;

let currentMarker;

let startMarker;

let endMarker;

let directionsService;

let directionsRenderer;

function initMap() {

    map = new google.maps.Map(document.getElementById("map"), {

        zoom: 15,

        center: {
            lat: 20,
            lng: 78
        }

    });

    directionsService =
        new google.maps.DirectionsService();

    directionsRenderer =
        new google.maps.DirectionsRenderer({

            suppressMarkers: true,

            preserveViewport: true

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

            currentMarker.setPosition(current);

            drawRoute(start, end);

            fitBounds(start, end, current);

        });

}

function drawRoute(start, end) {

    directionsService.route({

        origin: start,

        destination: end,

        travelMode: google.maps.TravelMode.DRIVING

    }, function(result, status) {

        if (status === "OK") {

            directionsRenderer.setDirections(result);

            const leg = result.routes[0].legs[0];

            document.getElementById("distance").innerHTML =
                "Distance : " + leg.distance.text;

            document.getElementById("eta").innerHTML =
                "ETA : " + leg.duration.text;

        }

    });

}

function fitBounds(start, end, current) {

    const bounds = new google.maps.LatLngBounds();

    bounds.extend(start);

    bounds.extend(end);

    bounds.extend(current);

    map.fitBounds(bounds);

}
