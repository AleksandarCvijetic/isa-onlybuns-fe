<template>
    <div class="map-container">
      <div class="search-bar" v-if="mode === 'edit'">
        <input 
          type="text" 
          v-model="searchQuery" 
          @keyup.enter="searchLocation" 
          placeholder="Search for a location (city or address)"
        />
        <button @click="searchLocation">Search</button>
      </div>
  
      <div id="map" class="map"></div>
  
      <div v-if="formattedAddress" class="address-info">
        <p><strong>{{ formattedAddress.street }}</strong></p>
        <p>{{ formattedAddress.city }}, {{ formattedAddress.postalCode }}</p>
        <p>Country: {{ formattedAddress.country }}</p>
        <p>Latitude: {{ coordinates.lat }}, Longitude: {{ coordinates.lng }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import 'ol/ol.css';
  import { Map, View } from 'ol';
  import TileLayer from 'ol/layer/Tile';
  import OSM from 'ol/source/OSM';
  import { fromLonLat, toLonLat } from 'ol/proj';
  import { Feature } from 'ol';
  import Point from 'ol/geom/Point';
  import VectorLayer from 'ol/layer/Vector';
  import VectorSource from 'ol/source/Vector';
  import { Style, Icon } from 'ol/style';
  import axios from 'axios';
  
  export default {
    name: 'MapComponent',
    props: {
      address: {
        type: String,
        required: false,
      },
      mode: {
        type: String,
        required: true,
        validator: value => ['view', 'edit'].includes(value),
      },
    },
    data() {
      return {
        map: null,
        coordinates: null,
        formattedAddress: null,
        marker: null,
        vectorLayer: null,
        searchQuery: '',
      };
    },
    mounted() {
      this.initializeMap();
  
      if (this.address) {
        // If the address is predefined, geocode it automatically
        this.geocodeAddress(this.address);
      }
    },
    methods: {
      initializeMap() {
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
            center: fromLonLat([20.4568, 44.8176]), // Default coordinates (Belgrade)
            zoom: 15,
          }),
        });
  
        if (this.mode === 'edit') {
          this.map.on('click', this.handleMapClick);
        }
      },
      async handleMapClick(event) {
        const coordinates = toLonLat(event.coordinate);
        this.coordinates = { lat: coordinates[1], lng: coordinates[0] };
        await this.reverseGeocode();
        this.updateMarker(event.coordinate);
        this.emitAddressData();
        // Update search query with the formatted address
        if (this.formattedAddress) {
          this.searchQuery = `${this.formattedAddress.street}, ${this.formattedAddress.city}, ${this.formattedAddress.country}`;
        }
      },
      async reverseGeocode() {
        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${this.coordinates.lat}&lon=${this.coordinates.lng}&format=json`
          );
          this.processGeocodeResponse(response.data);
        } catch (error) {
          console.error('There was an error fetching the reverse geocode data:', error);
        }
      },
      async geocodeAddress(address) {
        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&addressdetails=1`
          );
          if (response.data.length > 0) {
            const { lat, lon } = response.data[0];
            this.coordinates = { lat: parseFloat(lat), lng: parseFloat(lon) };
  
            this.processGeocodeResponse(response.data[0]);
  
            const coordinates = fromLonLat([lon, lat]);
            this.map.getView().setCenter(coordinates);
            this.map.getView().setZoom(15);
            this.updateMarker(coordinates);
            this.emitAddressData();
          } else {
            console.error('No results found for the given address.');
          }
        } catch (error) {
          console.error('There was an error fetching the geocode data:', error);
        }
      },
      processGeocodeResponse(data) {
        const addressComponents = data.address;
        this.formattedAddress = {
          street: addressComponents.road || '',
          city: addressComponents.city || addressComponents.town || addressComponents.village || '',
          country: addressComponents.country || '',
          postalCode: addressComponents.postcode || '',
        };
      },
      updateMarker(coordinates) {
        if (this.marker) {
          this.vectorLayer.getSource().removeFeature(this.marker);
        }
  
        this.marker = new Feature({
          geometry: new Point(coordinates),
        });
  
        this.marker.setStyle(
          new Style({
            image: new Icon({
              anchor: [0.5, 1],
              src: 'https://openlayers.org/en/latest/examples/data/icon.png',
            }),
          })
        );
  
        this.vectorLayer.getSource().addFeature(this.marker);
      },
      emitAddressData() {
        this.$emit('location-selected', {
          address: this.formattedAddress.street,
          city: this.formattedAddress.city,
          country: this.formattedAddress.country,
          latitude: this.coordinates.lat,
          longitude: this.coordinates.lng,
        });
      },
      async searchLocation() {
        await this.geocodeAddress(this.searchQuery);
      },
    },
  };
  </script>
  
  <style scoped>
  /* The styles remain the same as your previous code */
  .map-container {
    max-width: 600px;
    margin: 1rem auto;
    padding: 1rem;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .search-bar {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .search-bar input[type="text"] {
    flex-grow: 1;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-right: 0.5rem;
  }
  
  .search-bar button {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .search-bar button:hover {
    background-color: #0056b3;
  }
  
  .map {
    width: 100%;
    height: 300px;
    border-radius: 8px;
  }
  
  .address-info {
    margin-top: 1rem;
    padding: 1rem;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    color: #555;
    font-size: 0.95rem;
    line-height: 1.5;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  }
  
  .address-info p {
    margin: 0.5rem 0;
  }
  </style>
  
  
  