new Vue({
    el: '#app',
    data: {
      latitude: 0,
      longitude: 0,
      loading: true,
      foodTrucks: [],
      filterKeyword: '',
    },
    mounted() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            this.latitude = position.coords.latitude; // 37.76008693;
            this.longitude = position.coords.longitude; // -122.4188065;
            this.fetchNearbyFoodtrucks();
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
      fetchNearbyFoodtrucks() {
        const apiUrl = `data.json`;
  
        fetch(apiUrl)
          .then(response => response.json())
          .then(data => {
            var truckData = [];
            for (const truck of data) {
              truck.distance = this.calculateDistance(truck);
              // console.log(truck.distance)
              if (truck.distance <= 3) {
                truckData.push(truck);
              }
            }
            this.foodTrucks = truckData;
            // sort by distance
            this.foodTrucks.sort((a, b) => a.distance - b.distance);

            this.loading = false;
          })
          .catch(error => {
            console.error('Error fetching nearby food trucks:', error);
            this.loading = false;
          });
      },
      calculateDistance: function(truck) {
        var earthRadius = 6371;
        var dLat = this.deg2rad(truck.latitude - this.latitude);
        var dLon = this.deg2rad(truck.longitude - this.longitude);
        var a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(this.deg2rad(this.latitude)) * Math.cos(this.deg2rad(truck.latitude)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2)
          ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = earthRadius * c;
        return (Math.round(d * 100) / 100).toFixed(2);
     },
     deg2rad: function(deg) {
        return deg * (Math.PI / 180)
     },
     resetInput() {
        this.filterKeyword = '';
      },
    },
    computed: {
        filteredFoodTrucks() {
          return this.foodTrucks.filter(item => {
            var keyword = this.filterKeyword.trim().toLowerCase();
            if (!keyword) {
              return true;
            }
            return (
                item.name.toLowerCase().includes(keyword) || 
                item.address.toLowerCase().includes(keyword) ||
                item.foodItems.toLowerCase().includes(keyword)
            )
          });
        },
      },
  });
  
