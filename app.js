const params = new URLSearchParams(window.location.search);

const journeyId = params.get("id");

let map;
let marker;

function initMap() {

    map = new google.maps.Map(document.getElementById("map"), {

        zoom: 16,

        center: {
            lat: 20,
            lng: 78
        }

    });

    marker = new google.maps.Marker({

        position: {
            lat: 20,
            lng: 78
        },

        map: map

    });

    db.collection("journeys")
        .doc(journeyId)
        .onSnapshot((doc) => {

            if (!doc.exists) return;

            const data = doc.data();

            const position = {

                lat: data.lat,

                lng: data.lng

            };

            marker.setPosition(position);

            map.panTo(position);

        });

}
