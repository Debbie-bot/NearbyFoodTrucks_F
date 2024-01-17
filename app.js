new Vue({
    el: '#app',
    data: {
      latitude: 0,
      longitude: 0,
      loading: true,
      shops: [],
    },
    mounted() {
      // Get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            this.latitude = position.coords.latitude; // 37.76008693;
            this.longitude = position.coords.longitude; // -122.4188065;
            this.fetchNearbyShops();
          },
          error => {
            console.error('Error getting user location:', error);
            this.loading = false;
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
        this.loading = false;
      }
    },
    methods: {
      fetchNearbyShops() {
        const apiUrl = `data.json`;
  
        fetch(apiUrl)
          .then(response => response.json())
          .then(data => {
            var shopData = [];
            for (const shop of data) {
              shop.distance = this.calculateDistance(shop);
              // console.log(shop.distance)
              if (shop.distance <= 3) {
                shopData.push(shop);
              }
            }
            this.shops = shopData;
            this.loading = false;
          })
          .catch(error => {
            console.error('Error fetching nearby shops:', error);
            this.loading = false;
          });
      },
      calculateDistance: function(shop) {
        var earthRadius = 6371;
        var dLat = this.deg2rad(shop.latitude - this.latitude);
        var dLon = this.deg2rad(shop.longitude - this.longitude);
        var a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(this.deg2rad(this.latitude)) * Math.cos(this.deg2rad(shop.latitude)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2)
          ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = earthRadius * c;
        return (Math.round(d * 100) / 100).toFixed(2);
     },
     deg2rad: function(deg) {
        return deg * (Math.PI / 180)
     }
    },
  });
  
