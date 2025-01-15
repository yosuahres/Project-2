<template>
  <div class="container p-0">
    <!-- Back Button -->
    <button class="back-btn" @click="goBack">
      <img src="../assets/icons/arrow.png" alt="Back" class="back-icon">
    </button>

    <!-- Content Section -->
    <div class="content">
      <!-- Location Details -->
      <div class="location-details">
        <div class="location-text">
          <h1>Indah Puri</h1>
          <div class="address">
            <img src="../assets/icons/location.png" alt="Location Icon" class="location-icon">
            <div>
              <p>Jalan Ir. Sutami, Sekupang, Patam Lestari, Kec. Sekupang, Kota Batam, Kepulauan Riau 29424</p>
            </div>
          </div>
          <div class="buttons-container">
            <div class="buttons">
              <button class="call-btn" @click="contactOutlet">
                <img src="../assets/icons/telephone.png" alt="call" class="button-icon"> 
                Hubungi kami
              </button>
              <button class="visit-btn" @click="visitOutlet">
                <img src="../assets/icons/map.png" alt="visit" class="button-icon">
                Google Maps
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="separator p-0"></div>

      <!-- Operational Hours -->
      <div class="hours">
        <h2>Operational Hours</h2>
        <ul class="p-0">
          <li class="gapping">
            <span class="day">MONDAY</span> <span class="time">06:30 - 21:15</span>
          </li>
          <li class="gapping">
            <span class="day">TUESDAY</span> <span class="time">06:30 - 21:15</span>
          </li>
          <li class="gapping">
            <span class="day">WEDNESDAY</span> <span class="time">06:30 - 21:15</span>
          </li>
          <li class="gapping">
            <span class="day">THURSDAY</span> <span class="time">06:30 - 21:15</span>
          </li>
          <li class="gapping">
            <span class="day">FRIDAY</span> <span class="time">06:30 - 21:15</span>
          </li>
          <li class="gapping">
            <span class="day">SATURDAY</span> <span class="time">06:30 - 21:15</span>
          </li>
          <li class="gapping">
            <span class="day">SUNDAY</span> <span class="time">06:30 - 21:15</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    contactOutlet() {
      window.location.href = "tel:+628161414784";
    },
    visitOutlet() {
      window.open("https://maps.app.goo.gl/tmX3jqhw1aKVBe5M7", "_blank");
    },
    goBack() {
      this.$router.push({ name: 'MenuPageInd' }); 
    },
  },
};
</script>

<style scoped>
.gapping {
  padding: 15px; 
}

.separator {
  height: 5px;
  background-color: lightgray;
  width: 100%;
}

.bg-red {
  background-color: red;
}

.bg-green {
  background-color: green;
}

.bg-yellow {
  background-color: yellow;
}

body {
  font-family: Arial, sans-serif;
  margin: 0;
}
.container {
  max-width: 480px;
  margin: 0 auto;
  background-color: transparent;
  position: relative;
}
.back-btn {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  border: 1px solid lightgray;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.back-icon {
  width: 20px;
  height: 20px;
}
.content {
  border-radius: 20px 20px 0px 0px;
  width: 100%;
  background-color: white;
  position:absolute;
  top: 60px;
}

.location-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px 20px 0px 20px;
}
.location-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  margin-top: 5px;
}
.location-text {
  width: 100%;
}
.location-text h1 {
  font-size: 20px;
  margin-bottom: 10px;
}
.address {
  display: flex;
  align-items: flex-start;
}
.address img {
  align-self: flex-start;
}
.address div {
  display: flex;
  flex-direction: column;
}
.address p {
  margin: 0 0;
  font-size: 14px;
}
.buttons-container {
  padding: 18px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
.buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;
}
.buttons button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 7px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
  width: 180px;
  border: 1px solid lightgray;
}
.call-btn {
  background-color: transparent;
  color: black;
}
.visit-btn {
  background-color: transparent;
  color: black;
}
.share-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 7px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
  width: 370px;
  border: 1px solid lightgray;
  background-color: transparent;
  color: black;
}
.hours{
  padding: 15px 20px 20px 20px;
}
.hours h2 {
  font-size: 18px;
  margin-bottom: 10px;
}
.hours ul {
  list-style: none;
}
.hours ul li {
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid lightgray;
}
.hours ul li .day {
  font-size: 12px;
  flex: 1;
}
.hours ul li .time {
  font-size: 12px;
  text-align: center;
  flex: 3;
}
.button-icon {
  width: 15px;
  height: 15px;
  margin-right: 10px;
}
</style>