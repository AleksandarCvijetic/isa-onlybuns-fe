<template>
  <div id="map" class="map-container"></div>
</template>

<script>
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Icon } from 'ol/style';
import Overlay from 'ol/Overlay';
import { nextTick } from 'vue';

export default {
  name: 'PostsMap',
  props: {
    posts: {
      type: Array,
      required: true,
    },
    userAddress: {
      type: String,
      required: false,
    },
    careLocations: {
      type: Array,
      required: false,
    },
  },
  data() {
    return {
      map: null,
      vectorLayer: null,
      overlay: null,
    };
  },
  mounted() {
    nextTick(() => {
        this.initializeMap();

        // Dodaj updateSize nakon kašnjenja (ovo osigurava da container ima dimenzije)
        setTimeout(() => {
        if (this.map) {
            this.map.updateSize();
        }
        }, 300); // 300ms je u većini slučajeva dovoljno
    });
    },

  methods: {
    async initializeMap() {
    this.vectorLayer = new VectorLayer({
        source: new VectorSource(),
    });

    this.map = new Map({
        target: 'map',
        layers: [
        new TileLayer({
            source: new OSM(),
        }),
        this.vectorLayer,
        ],
        view: new View({
        center: fromLonLat([20.4568, 44.8176]), // Fallback centar
        zoom: 13,
        }),
    });

    const container = document.createElement('div');
    container.className = 'ol-popup';
    this.overlay = new Overlay({
        element: container,
        positioning: 'bottom-center',
        stopEvent: false,
        offset: [0, -30],
    });
    this.map.addOverlay(this.overlay);

    this.map.on('click', event => {
        const feature = this.map.forEachFeatureAtPixel(event.pixel, f => f);
        if (feature && feature.get('popupHtml')) {
        const coordinates = feature.getGeometry().getCoordinates();
        this.overlay.setPosition(coordinates);
        this.overlay.getElement().innerHTML = feature.get('popupHtml');
        } else {
        this.overlay.setPosition(undefined);
        }
    });
    },


    async geocodeAddress(address) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
        );
        const data = await response.json();
        if (data.length > 0) {
          return {
            lat: parseFloat(data[0].lat),
            lon: parseFloat(data[0].lon),
          };
        }
      } catch (err) {
        console.error('Greška pri geokodiranju adrese:', err);
      }
      return null;
    },

    addUserLocationMarker([lon, lat]) {
      const coords = fromLonLat([lon, lat]);
      const feature = new Feature({
        geometry: new Point(fromLonLat([lon, lat])),
      });

      feature.setStyle(
        new Style({
          image: new Icon({
            anchor: [0.5, 1],
            src: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          }),
        })
      );

      this.vectorLayer.getSource().addFeature(feature);
      // 2. Prikaz popup-a odmah sa tekstom "Your address"
        if (this.overlay) {
            this.overlay.setPosition(coords);
            this.overlay.getElement().innerHTML = `
            <div class="user-popup">
                <strong>Your address</strong>
            </div>
            `;
        }
    },

    addPostMarkers() {
      const coordinatesArray = [];

      this.posts.forEach(post => {
        if (
          post.location &&
          typeof post.location.latitude === 'number' &&
          typeof post.location.longitude === 'number'
        ) {
          const lonLat = [post.location.longitude, post.location.latitude];
          const feature = new Feature({
            geometry: new Point(fromLonLat(lonLat)),
          });

          const popupHtml = `
          <div class="post-card">
            ${ post.image ? `<img src="${this.getImageSrc(post.image)}" alt="Post Image" class="post-image" />` : '' }
            <div class="post-details">
              <h3 class="post-username">${ post.user.username }</h3>          
              <p class="post-description">${ post.description }</p>
              <p class="post-date"><strong>Created At:</strong> ${ new Date(post.createdAt).toLocaleString() }</p>
              <p class="post-comments"><strong>Comments:</strong> ${ post.comments.length }</p>
              <p class="post-likes"><strong>Likes:</strong> ${ post.likeCount }</p>
            </div>
          </div>
          `;


          feature.set('popupHtml', popupHtml);

          feature.setStyle(
            new Style({
              image: new Icon({
                anchor: [0.5, 1],
                src: 'https://openlayers.org/en/latest/examples/data/icon.png',
                scale: 0.8,
              }),
            })
          );

          this.vectorLayer.getSource().addFeature(feature);
          coordinatesArray.push(lonLat);
        }
      });

      // Centriraj mapu na prosečne koordinate postova ako korisnikova lokacija nije data
      if (coordinatesArray.length > 0 && !this.userAddress) {
        const avgLon = coordinatesArray.reduce((sum, c) => sum + c[0], 0) / coordinatesArray.length;
        const avgLat = coordinatesArray.reduce((sum, c) => sum + c[1], 0) / coordinatesArray.length;
        this.map.getView().setCenter(fromLonLat([avgLon, avgLat]));
      }
    },
    async addCareLocationMarkers() {
      if (!this.careLocations || this.careLocations.length === 0) return;

      for (const loc of this.careLocations) {
        const coords = await this.geocodeAddress(loc.lokacija);
        if (coords) {
          const lonLat = [coords.lon, coords.lat];
          const feature = new Feature({
            geometry: new Point(fromLonLat(lonLat)),
          });

          const popupHtml = `
            <div class="popup-content">
              <p><strong>Tip usluge:</strong> ${loc.naziv}</p>
              <p><strong>Adresa:</strong> ${loc.lokacija}</p>
            </div>
          `;

          feature.set('popupHtml', popupHtml);

          feature.setStyle(
            new Style({
              image: new Icon({
                anchor: [0.5, 1],
                src: 'https://cdn-icons-png.flaticon.com/512/616/616408.png',
                scale: 0.1,
              }),
            })
          );

          this.vectorLayer.getSource().addFeature(feature);
        }
      }
    },
    // Method to extract the filename from the image path
    getImageSrc(imagePath) {
      const fileName = imagePath.substring(imagePath.lastIndexOf("\\") + 1); // Extract file name from path
      return `http://localhost:8080/images/${fileName}`; // Construct the URL
    }
  },
  watch: {
    posts: {
        handler(newPosts) {
        if (this.map && this.vectorLayer && newPosts.length > 0) {
            this.addPostMarkers();
        }
        },
        immediate: true,
        deep: true
    },
    userAddress: {
        async handler(newAddress) {
        if (this.map && this.vectorLayer && newAddress) {
            const coords = await this.geocodeAddress(newAddress);
            if (coords) {
            const userLonLat = [coords.lon, coords.lat];
            this.map.getView().setCenter(fromLonLat(userLonLat));
            this.addUserLocationMarker(userLonLat);
            }
        }
        },
        immediate: true
    },
    careLocations: {
      handler(newLocations) {
        if (this.map && this.vectorLayer && newLocations.length > 0) {
          this.addCareLocationMarkers();
        }
      },
      immediate: true,
      deep: true
    },

    }


};
</script>

<style>
.map-container {
  height: 600px;
  width: 100%;
  position: relative;
}

.user-popup {
  padding: 6px 10px;
  border: solid black;
  border-radius: 6px;
  font-weight: bold;
  color: black;
}

.ol-popup {
  background-color: white;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  white-space: nowrap;
}

.popup-content {
  max-width: 250px;
  padding: 10px 14px;
  background-color: white;
  border: 2px solid #007bff;
  border-radius: 10px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 14px;
  color: #333;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  word-wrap: break-word;
  line-height: 1.4;
}

.post-card {
  display: inline-block;
  margin-left: 20px;
  margin-bottom: 20px;
  background-color: #eedbca;
  border: 3px solid #a1622e;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  overflow: hidden;
  width: 300px; /* Set a fixed width for each post card */
  padding: 1.5rem;
  transition: transform 0.2s ease-in-out;
  font-family: 'Open Sans', sans-serif; /* Using Open Sans for card content */
}

.post-details {
  padding: 0.5rem 0;
}

.post-image {
  width: 100%;
  height: auto;
  border-radius: 5px;
  margin-bottom: 1rem;
}

.post-username {
  color: #333;
  font-weight: 600; /* Slightly bolder for the username */
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  font-family: 'Roboto', sans-serif; /* Using Roboto for usernames */
}

.post-description {
  font-size: 1rem;
  color: #555;
  margin-bottom: 1rem;
}

.post-likes{
  font-size: 1rem;
  color: #555;
  margin-bottom: 1rem;
}

.post-date,
.post-comments {
  font-size: 0.9rem;
  color: #777;
  font-family: 'Open Sans', sans-serif; /* Keeping Open Sans for smaller text */
}

</style>
