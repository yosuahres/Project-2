<template>
  <div>
    <header>
    <div class="sticky-header" :class="{ 'header-scrolled': isScrolled }">
      <div class="top-bar">

        <!-- header for scrolled -->
        <div class="left-text background-icon" v-if="isScrolled">
          Indah Puri
        </div>
        <!-- end -->

        <div class="right-icons">
          <!-- <button class="search-icon" @click="showSearch = !showSearch">
            <img src="../assets/icons/search.png" alt="search icon" style="width: 24px; height: 24px;">
          </button> -->
          <button class="menu-button" @click="toggleMenu">  
            ☰
          </button> 

          <!-- menu modal -->
          <transition name="slide">
            <div class="menu" v-if="showMenu && !isModalOpen">
              <div class="menu-header">
                <button class="close-menu" @click="toggleMenu">✖</button>
                <img src="../assets/icons/ip-logo.png" alt="Menu Logo" class="menu-logo">
              </div>
              <nav class="menu-nav">
                <div class="menu-item-top">
                  <a @click.prevent="openModal">
                    <img src="../assets/icons/language.png" alt="2" class="menu-icon">
                    Language
                  </a>
                </div>
              </nav>
            </div>
          </transition>
          <!-- end of menu modal -->
        </div>
      </div>
    </div>

    <div class="pad-only">

      <img src="../assets/icons/ip-logo.png" alt="Header Image" class="header-image">
      <button class="header-button" @click="goToAboutPage">
        <div class="header-content">
          <h1>Indah Puri</h1>
          <p>Open today, 06:00-19:00</p>
        </div>
        <span class="arrow-icon">></span>
      </button>

      <div class="order-type">
        <h3>Discover More</h3>
        <button class="dine-in-button" @click="goToHandicapInformation">
          Field Info
        </button>
      </div>

    </div>
    </header>

    <!-- <div class="container"> -->
      <!-- <div class="menu-container "> -->
        <div style="display: flex; justify-content: center;">
          <div style="width: 100%; max-width: 600px;">
        <div class="tabs" :class="{ 'menu-section-scrolled ': isMenuSectionScrolled }">
          <button class="dropbtn" @click="showModal = true">
            <div class="logo">
              <div class="line"></div>
              <div class="line"></div>
              <div class="line"></div>
            </div>
            {{ selectedOption }}
          </button>
          <div :class="['tab', { active: selectedTab === 'MAKANAN BERAT' }]" @click="scrollToSection('makananBeratSection')">HEAVY FOOD</div>
          <div :class="['tab', { active: selectedTab === 'SNACK' }]" @click="scrollToSection('snackSection')">SNACK</div>
          <div :class="['tab', { active: selectedTab === 'DESSERT' }]" @click="scrollToSection('dessertSection')">DESSERT</div>
          <div :class="['tab', { active: selectedTab === 'DRINK' }]" @click="scrollToSection('drinkSection')">DRINK</div>
          <div :class="['tab', { active: selectedTab === 'CIGARETTE' }]" @click="scrollToSection('cigaretteSection')">CIGARETTE</div>
        </div>
        </div>  
      </div>

        <div style="display: flex; justify-content: center;">
        <div style="padding: 0px 10px 10px 10px; width: 100%; max-width: 600px;">
        <div class="menu-section">
          <h2 class="header-with-line">
            FOODS
            <span class="line"></span>
          </h2>
        </div>
        <div class="menu-section" ref="makananBeratSection">
          <h2>HEAVY FOOD</h2>
          <div class="menu-grid two-columns">
            <div v-for="item in makananBeratItems" :key="item.id" class="menu-item">
              <img :src="item.image" :alt="item.name">
              <h3>{{ item.name }}</h3>
              <p>{{ item.price }}</p>
            </div>
          </div>
        </div>
        <div class="menu-section" ref="snackSection">
          <h2>SNACK</h2>
          <div class="menu-grid two-columns">
            <div v-for="item in snackItems" :key="item.id" class="menu-item">
              <img :src="item.image" :alt="item.name">
              <h3>{{ item.name }}</h3>
              <p>{{ item.price }}</p>
            </div>
          </div>
        </div>
        <div class="menu-section">
          <h2 class="header-with-line">
            DRINKS
            <span class="line"></span>
          </h2>
        </div>
        <div class="menu-section" ref="dessertSection">
          <h2>DESSERT</h2>
          <div class="menu-grid two-columns">
            <div v-for="item in coldDessertItems" :key="item.id" class="menu-item">
              <img :src="item.image" :alt="item.name">
              <h3>{{ item.name }}</h3>
              <p>{{ item.price }}</p>
            </div>
          </div>
        </div>
        <!-- <div class="menu-section" ref="hotDessertSection">
          <h2>HOT DESSERT</h2>  
          <div class="menu-grid two-columns">
            <div v-for="item in hotDessertItems" :key="item.id" class="menu-item">
              <img :src="item.image" :alt="item.name">
              <h3>{{ item.name }}</h3>
              <p>{{ item.price }}</p>
            </div>
          </div>
        </div> -->
        <div class="menu-section" ref="drinkSection">
          <h2>DRINK</h2>
          <div class="menu-grid two-columns">
            <div v-for="item in drinkItems" :key="item.id" class="menu-item">
              <img :src="item.image" :alt="item.name">
              <h3>{{ item.name }}</h3>
              <p>{{ item.price }}</p>
            </div>
          </div>
        </div>
        <div class="menu-section" ref="cigaretteSection">
          <h2>CIGARETTE</h2>
          <div class="menu-grid two-columns">
            <div v-for="item in cigaretteItems" :key="item.id" class="menu-item">
              <img :src="item.image" :alt="item.name">
              <h3>{{ item.name }}</h3>
              <p>{{ item.price }}</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
    <!-- </div> -->

      <!-- languange selection modal -->
      <div v-if="isModalOpen" class="modal" @click.self="closeModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Select Language</h2>
            <span class="close" @click="closeModal">&times;</span>
          </div>
          <div class="modal-body">
            <button :class="{ selectedLang: selectedLanguage === 'English' }" @click="selectLanguage('English')" class="modal-button">
              <span>English</span>
              <span v-if="selectedLanguage === 'English'" class="tick">
                <img src="../assets/icons/check.png" alt="selected" class="tick-icon">
              </span>
            </button>
            <button :class="{ selectedLang: selectedLanguage === 'Indonesia' }" @click="selectLanguage('Indonesia')" class="modal-button">
              <span>Indonesia</span>
              <span v-if="selectedLanguage === 'Indonesia'" class="tick">
                <img src="../assets/icons/check.png" alt="selected" class="tick-icon">
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- food type modal -->
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Category Item</h2>
            <span class="close" @click="showModal = false">&times;</span>
          </div>
          <div class="modal-body">
            <button :class="{ selected: selectedOption === 'MAKANAN' }" @click="selectOption('MAKANAN')" class="modalbot-button">
              <span>FOOD</span>
              <span v-if="selectedOption === 'MAKANAN'" class="tickbot">
                <img src="../assets/icons/checkbot.png" alt="selected" class="tickbot-icon">
              </span>
            </button>
            <button :class="{ selected: selectedOption === 'DRINK' }" @click="selectOption('DRINK')" class="modalbot-button">
              <span>DRINK</span>
              <span v-if="selectedOption === 'DRINK'" class="tickbot">
                <img src="../assets/icons/checkbot.png" alt="selected" class="tickbot-icon">
              </span>
            </button>
          </div>
        </div>
    </div>
  <!-- </div> -->
</template>

<script>
export default {
  name: 'Menu',
  data() {
    return {
      makananBeratItems: [
        { id: 1, name: 'Soup Buntut Goreng with Rice', price: 'Rp140.000', image: '../assets/icons/mb-1.jpg' },
        { id: 2, name: 'Chicken Satay Set', price: 'Rp97.000', image: '../assets/icons/mb-2.jpg' },
        { id: 3, name: 'Fried Rice Indonesia', price: 'Rp80.000', image: '../assets/icons/mb-3.jpg' },
        { id: 4, name: 'Sliced Beef with Black Pepper Set', price: 'Rp145.000', image: '../assets/icons/mb-4.jpg' },
        { id: 5, name: 'Fried Noodle Indonesia', price: 'Rp78.000', image: '../assets/icons/mb-5.jpg' },
        { id: 6, name: 'Crispy Chicken Wing', price: 'Rp110.000', image: '../assets/icons/mb-6.jpg' },
        { id: 7, name: 'Chicken Steak', price: 'Rp135.000', image: '../assets/icons/mb-7.jpg' },
        { id: 8, name: 'Sirloin Steak', price: 'Rp189.000', image: '../assets/icons/mb-8.jpg' },
        { id: 9, name: 'Fried Noodle with Chicken', price: 'Rp80.000', image: '../assets/icons/mb-9.jpg' },
        { id: 10, name: 'Tomyam Seafood Set', price: 'Rp110.000', image: '../assets/icons/mb-10.jpg' },
        { id: 11, name: 'Nasi Kari Ayam', price: 'Rp80.000', image: '../assets/icons/mb-11.jpg' },
        { id: 12, name: 'Nasi Goreng Ikan Bilis', price: 'Rp100.000', image: '../assets/icons/mb-12.jpg' },
        { id: 13, name: 'Seafood Noodle Soup', price: 'Rp78.000', image: '../assets/icons/mb-13.jpg' },
        { id: 14, name: 'Butter Rice With Beef', price: 'Rp117.000', image: '../assets/icons/mb-14.jpg' },
        { id: 15, name: 'Mixed Omelette and Fries', price: 'Rp88.000', image: '../assets/icons/mb-15.jpg' },
        { id: 16, name: 'Butter Prawn', price: 'Rp110.000', image: '../assets/icons/mb-16.jpg' },
        { id: 17, name: 'Nasi Kari Ayam', price: 'Rp80.000', image: '../assets/icons/mb-17.jpg' },
        { id: 18, name: 'Nasi Goreng Ikan Bilis', price: 'Rp100.000', image: '../assets/icons/mb-18.jpg' },
        { id: 19, name: 'Seafood Noodle Soup', price: 'Rp78.000', image: '../assets/icons/mb-19.jpg' },
        { id: 20, name: 'Butter Rice With Beef', price: 'Rp117.000', image: '../assets/icons/mb-20.jpg' },
        { id: 21, name: 'Mixed Omelette and Fries', price: 'Rp88.000', image: '../assets/icons/mb-21.jpg' },
        { id: 22, name: 'Butter Prawn', price: 'Rp110.000', image: '../assets/icons/mb-22.jpg' },
        { id: 23, name: 'Oxtail Soup with Rice', price: 'Rp140.000', image: '../assets/icons/mb-23.jpg' },
        { id: 24, name: 'Fish n Chip with Vegetable', price: 'Rp161.000', image: '../assets/icons/mb-24.jpg' },
        { id: 25, name: 'Fried Hokkien Mie', price: 'Rp88.000', image: '../assets/icons/mb-25.jpg' },
        { id: 26, name: 'Nasi Ikan Sambal', price: 'Rp117.000', image: '../assets/icons/mb-26.jpg' },

        // bread/roti
        { id: 27, name: 'American Breakfast', price: 'Rp104.000', image: '../assets/icons/mb-27.jpg' },
        { id: 28, name: 'Tuna Sandwich', price: 'Rp81.000', image: '../assets/icons/mb-28.jpg' },
        { id: 29, name: 'Cheese French Toast', price: 'Rp78.000', image: '../assets/icons/mb-29.jpg' },
        { id: 30, name: 'Egg Sandwich', price: 'Rp81.000', image: '../assets/icons/mb-30.jpg' },
        { id: 31, name: 'French Toast Kaya', price: 'Rp56.000', image: '../assets/icons/mb-31.jpg' },
        { id: 32, name: 'Roti Prata With Kari Ayam', price: 'Rp79.000', image: '../assets/icons/mb-32.jpg' },
        { id: 33, name: 'Mix Sandwich', price: 'Rp81.000', image: '../assets/icons/mb-33.jpg' },
        { id: 34, name: 'Tuna French Toast', price: 'Rp49.000', image: '../assets/icons/mb-34.jpg' },
        { id: 35, name: 'Chicken French Toast', price: 'Rp49.000', image: '../assets/icons/mb-35.jpg' },
        { id: 36, name: 'Rissole', price: 'Rp41.000', image: '../assets/icons/mb-36.jpg' },
        { id: 37, name: 'Prata Gula', price: 'Rp41.000', image: '../assets/icons/mb-37.jpg' },
        { id: 38, name: 'Prata Kosong', price: 'Rp37.000', image: '../assets/icons/mb-38.jpg' },
        { id: 38, name: 'Toas Kaya', price: 'Rp37.000', image: '../assets/icons/mb-38.jpg' },
        { id: 38, name: 'Chicken Sandwich', price: 'Rp81.000', image: '../assets/icons/mb-38.jpg' },
        { id: 38, name: 'Cheese Sandwich', price: 'Rp81.000', image: '../assets/icons/mb-38.jpg' },

        // Rice/nasi
        { id: 39, name: 'Nasi Ayam Penyet', price: 'Rp90.000', image: '../assets/icons/mb-39.jpg' },
        { id: 40, name: 'Nasi Kari Ayam', price: 'Rp124.000', image: '../assets/icons/mb-40.jpg' },
        { id: 41, name: 'Chicken Garlic Rice', price: 'Rp110.000', image: '../assets/icons/mb-41.jpg' },
        { id: 42, name: 'Butter Rice With Beef', price: 'Rp117.000', image: '../assets/icons/mb-42.jpg' },
        { id: 43, name: 'Nasi Ikan Sambal', price: 'Rp117.000', image: '../assets/icons/mb-43.jpg' },
        { id: 44, name: 'Nasi Putih', price: 'Rp12.000', image: '../assets/icons/mb-44.jpg' },

        // NASI GORENG/FRIED RICE
        { id: 45, name: 'Nasi Goreng + Oxtail Soup', price: 'Rp140.000', image: '../assets/icons/mb-45.jpg' },
        { id: 46, name: 'Nasi Goreng Indah', price: 'Rp80.000', image: '../assets/icons/mb-46.jpg' },
        { id: 47, name: 'Nasi Goreng Ikan Bilis', price: 'Rp80.000', image: '../assets/icons/mb-47.jpg' },
        { id: 48, name: 'Corned Beef Fried Chicken', price: 'Rp80.000', image: '../assets/icons/mb-48.jpg' },
        { id: 49, name: 'Nasi Goreng Indonesia', price: 'Rp80.000', image: '../assets/icons/mb-49.jpg' },
        { id: 50, name: 'Nasi Goreng Seafood', price: 'Rp80.000', image: '../assets/icons/mb-50.jpg' },
        { id: 51, name: 'Nasi Goreng Oriental', price: 'Rp80.000', image: '../assets/icons/mb-51.jpg' },
        { id: 52, name: 'Nasi Goreng Ikan Asin', price: 'Rp80.000', image: '../assets/icons/mb-52.jpg' },
        { id: 53, name: 'Oxtail Fried Rice', price: 'Rp104.000', image: '../assets/icons/mb-53.jpg' },

        // MIE/NOODLES
        { id: 54, name: 'Mie Goreng Jawa', price: 'Rp72.000', image: '../assets/icons/mb-54.jpg' },
        { id: 55, name: 'Mie Goreng Indonesia', price: 'Rp78.000', image: '../assets/icons/mb-55.jpg' },
        { id: 56, name: 'Horfun Black Paper', price: 'Rp98.000', image: '../assets/icons/mb-56.jpg' },
        { id: 57, name: 'Fried Bihun Seafood', price: 'Rp88.000', image: '../assets/icons/mb-57.jpg' },
        { id: 58, name: 'Fried Hokkien Mie', price: 'Rp88.000', image: '../assets/icons/mb-58.jpg' },
        { id: 59, name: 'Seafood Noodle Soup', price: 'Rp78.000', image: '../assets/icons/mb-59.jpg' },
        { id: 60, name: 'Horfun', price: 'Rp41.000', image: '../assets/icons/mb-60.jpg' },
        { id: 61, name: 'Kwetiau Soup', price: 'Rp97.000', image: '../assets/icons/mb-61.jpg' },
        { id: 62, name: 'F.beef Noodle/Kwetiau', price: 'Rp98.000', image: '../assets/icons/mb-62.jpg' },
        { id: 63, name: 'Mee Ayam', price: 'Rp41.000', image: '../assets/icons/mb-63.jpg' },
        { id: 64, name: 'Bihun Soup', price: 'Rp78.000', image: '../assets/icons/mb-64.jpg' },
        { id: 65, name: 'Oxtail Soup 60k', price: 'Rp70.000', image: '../assets/icons/mb-65.jpg' },

        // BEEF, CHICKEN, PRAWN & FISH
        { id: 66, name: 'Chicken Teriyaki Set', price: 'Rp101.000', image: '../assets/icons/mb-66.jpg' },
        { id: 67, name: 'Chicken Satay Set', price: 'Rp97.000', image: '../assets/icons/mb-67.jpg' },
        { id: 68, name: 'Chicken Ginger Set', price: 'Rp101.000', image: '../assets/icons/mb-68.jpg' },
        { id: 69, name: 'Chicken Lemon Sauce Set', price: 'Rp104.000', image: '../assets/icons/mb-69.jpg' },
        { id: 70, name: 'Beef Ginger Set', price: 'Rp115.000', image: '../assets/icons/mb-70.jpg' },
        { id: 71, name: 'Chicken Dried Chili Set', price: 'Rp94.000', image: '../assets/icons/mb-71.jpg' },
        { id: 72, name: 'Chicken Butter', price: 'Rp101.000', image: '../assets/icons/mb-72.jpg' },
        { id: 73, name: 'Chicken Bbq Set', price: 'Rp101.000', image: '../assets/icons/mb-73.jpg' },
        { id: 74, name: 'Butter Prawn', price: 'Rp110.000', image: '../assets/icons/mb-74.jpg' },
        { id: 75, name: 'Black Pepper Beef Set', price: 'Rp145.000', image: '../assets/icons/mb-75.jpg' },
        { id: 76, name: 'Thai Honey Chicken Set', price: 'Rp61.000', image: '../assets/icons/mb-76.jpg' },
        { id: 77, name: 'Butter Prawn In Gold Net', price: 'Rp110.000', image: '../assets/icons/mb-77.jpg' },
        { id: 78, name: 'F.Chicken', price: 'Rp190.000', image: '../assets/icons/mb-78.jpg' },
        { id: 79, name: 'Ayam Goreng Bawang', price: 'Rp127.000', image: '../assets/icons/mb-79.jpg' },
        { id: 80, name: 'Chicken Mongolian With Rice', price: 'Rp81.000', image: '../assets/icons/mb-80.jpg' },
        { id: 81, name: 'Beef Mongolian With Rice', price: 'Rp110.000', image: '../assets/icons/mb-81.jpg' },
        { id: 82, name: 'Prawn Mongolian With Rice', price: 'Rp110.000', image: '../assets/icons/mb-82.jpg' },

        { id: 83, name: "Chicken Porridge", price: "Rp70.000", image: "../assets/icons/mb-83.jpg" },
        { id: 84, name: "Fish Porridge", price: "Rp70.000", image: "../assets/icons/mb-84.jpg" },
        { id: 85, name: "Sea Food Porridge", price: "Rp70.000", image: "../assets/icons/mb-85.jpg" },
        { id: 86, name: "Tomyam Seafood Set", price: "Rp110.000", image: "../assets/icons/mb-86.jpg" },
        { id: 87, name: "Fish Soup Set", price: "Rp110.000", image: "../assets/icons/mb-87.jpg" },
        { id: 88, name: "Oxtail Soup Set", price: "Rp140.000", image: "../assets/icons/mb-88.jpg" },
        { id: 89, name: "Sop Buntut Goreng Set", price: "Rp140.000", image: "../assets/icons/mb-89.jpg" },
        { id: 90, name: "Soup Seafood Set", price: "Rp86.000", image: "../assets/icons/mb-90.jpg" },
        { id: 91, name: "Soup Chicken Set", price: "Rp86.000", image: "../assets/icons/mb-91.jpg" },
        { id: 92, name: "1000 Salad", price: "Rp61.000", image: "../assets/icons/mb-92.jpg" },
        { id: 93, name: "Sop Buntut 80", price: "Rp80.000", image: "../assets/icons/mb-93.jpg" },
        { id: 94, name: "Hot Plate Topu", price: "Rp92.000", image: "../assets/icons/mb-94.jpg" },
        { id: 95, name: "Sirloin Steak", price: "Rp189.000", image: "../assets/icons/mb-95.jpg" },
        { id: 96, name: "Black Pepper Steak", price: "Rp233.000", image: "../assets/icons/mb-96.jpg" },
        { id: 97, name: "Tenderloin Steak", price: "Rp233.000", image: "../assets/icons/mb-97.jpg" },
        { id: 98, name: "Chicken Steak", price: "Rp135.000", image: "../assets/icons/mb-98.jpg" },
        { id: 99, name: "Fish 'n' Chips", price: "Rp161.000", image: "../assets/icons/mb-99.jpg" },
        { id: 100, name: "Mixed Omelette & Fries", price: "Rp88.000", image: "../assets/icons/mb-100.jpg" },
        { id: 101, name: "Scramble Egg & Toast", price: "Rp88.000", image: "../assets/icons/mb-101.jpg" },
        { id: 102, name: "Fried Egg (Double)", price: "Rp19.000", image: "../assets/icons/mb-102.jpg" },
        { id: 103, name: "Hard/Half Boiled Egg", price: "Rp19.000", image: "../assets/icons/mb-103.jpg" },
        { id: 104, name: "Cheese Omelette", price: "Rp81.000", image: "../assets/icons/mb-104.jpg" },
        { id: 105, name: "Mushroom Omelette", price: "Rp81.000", image: "../assets/icons/mb-105.jpg" },
        { id: 106, name: "Fried Egg With Onion", price: "Rp25.000", image: "../assets/icons/mb-106.jpg" },
        { id: 107, name: "Fried Rice Vegetable", price: "Rp73.000", image: "../assets/icons/mb-107.jpg" },
        { id: 108, name: "Fried Noodle Vegetable", price: "Rp73.000", image: "../assets/icons/mb-108.jpg" },
        { id: 109, name: "Fried Bihoun Vegetable", price: "Rp73.000", image: "../assets/icons/mb-109.jpg" },
        { id: 110, name: "Broccoli Mushroom", price: "Rp73.000", image: "../assets/icons/mb-110.jpg" },
        { id: 111, name: "Capcai", price: "Rp73.000", image: "../assets/icons/mb-111.jpg" },
        { id: 112, name: "Mix Vegetable", price: "Rp73.000", image: "../assets/icons/mb-112.jpg" },
        { id: 113, name: "Soup Vegetable", price: "Rp73.000", image: "../assets/icons/mb-113.jpg" },
        { id: 114, name: "Sauteed Beansprout With Fish Salted", price: "Rp66.000", image: "../assets/icons/mb-114.jpg" },

        // NOODLE
        { id: 115, name: "Miso Ramen Chicken", price: "Rp122.000", image: "../assets/icons/mb-115.jpg" },
        { id: 116, name: "Miso Ramen Beef", price: "Rp140.000", image: "../assets/icons/mb-116.jpg" },
        { id: 117, name: "Chicken Gyoza", price: "Rp82.000", image: "../assets/icons/mb-117.jpg" },
        { id: 118, name: "Beef Gyoza", price: "Rp88.000", image: "../assets/icons/mb-118.jpg" },
        { id: 119, name: "Chicken Teriyaki", price: "Rp105.000", image: "../assets/icons/mb-119.jpg" },
        { id: 120, name: "Yaki Udon Seafood", price: "Rp83.000", image: "../assets/icons/mb-120.jpg" },
        { id: 121, name: "Udon Soup Seafood", price: "Rp83.000", image: "../assets/icons/mb-121.jpg" },
        { id: 122, name: "Yaki Udon With Beef", price: "Rp89.000", image: "../assets/icons/mb-122.jpg" },
        { id: 123, name: "Korea Noodle + Plain Rice", price: "Rp140.000", image: "../assets/icons/mb-123.jpg" },

      ],
      snackItems:[
        { id: 1, name: "Grilled Sausage 6 Pcs", price: "Rp94.000", image: "../assets/icons/mb-115.jpg" },
        { id: 2, name: "Deep Fried Sotong Ball", price: "Rp94.000", image: "../assets/icons/mb-116.jpg" },
        { id: 3, name: "Vegetable Spring Roll", price: "Rp94.000", image: "../assets/icons/mb-117.jpg" },
        { id: 4, name: "Crispy Chicken Wing", price: "Rp110.000", image: "../assets/icons/mb-118.jpg" },
        { id: 5, name: "Stir Fried Ikan Bilis Nut", price: "Rp81.000", image: "../assets/icons/mb-119.jpg" },
        { id: 6, name: "French Fries", price: "Rp56.000", image: "../assets/icons/mb-120.jpg" },
        { id: 7, name: "Chicken Curry Puff", price: "Rp22.000", image: "../assets/icons/mb-121.jpg" },
        { id: 8, name: "Emping", price: "Rp37.000", image: "../assets/icons/mb-122.jpg" },
        { id: 9, name: "Prawn Cracker", price: "Rp37.000", image: "../assets/icons/mb-123.jpg" },
        { id: 10, name: "Fried Banana", price: "Rp41.000", image: "../assets/icons/mb-124.jpg" },
        { id: 11, name: "Sotong Goreng Tepung", price: "Rp98.000", image: "../assets/icons/mb-125.jpg" },
        { id: 12, name: "Samosa", price: "Rp56.000", image: "../assets/icons/mb-126.jpg" },
        { id: 13, name: "Kerupuk", price: "Rp37.000", image: "../assets/icons/mb-127.jpg" },
        { id: 14, name: "Jeker", price: "Rp37.000", image: "../assets/icons/mb-128.jpg" },
        { id: 15, name: "Soy Joy", price: "Rp15.000", image: "../assets/icons/mb-129.jpg" },
      ],
      coldDessertItems:[
        { id: 1, name: 'Cornetto Disc Chocolate', price: 'Rp20.000', image: '../assets/icons/cd-1.jpg' },
        { id: 2, name: 'Magnum Almond', price: 'Rp30.000', image: '../assets/icons/cd-2.jpg' },
        { id: 3, name: 'Magnum Classic', price: 'Rp30.000', image: '../assets/icons/cd-3.jpg' },
        { id: 4, name: 'Magnum Strawberry', price: 'Rp30.000', image: '../assets/icons/cd-4.jpg' },
        { id: 5, name: 'Magnum Gold', price: 'Rp30.000', image: '../assets/icons/cd-5.jpg' },
        { id: 6, name: 'Paddle Pop Choco Magma', price: 'Rp12.000', image: '../assets/icons/cd-6.jpg' },
        { id: 7, name: 'Paddle Pop Cola Fire', price: 'Rp12.000', image: '../assets/icons/cd-7.jpg' },
        { id: 8, name: 'Populaire Strawberry', price: 'Rp12.000', image: '../assets/icons/cd-8.jpg' },
        { id: 9, name: 'Populaire Chocolate', price: 'Rp12.000', image: '../assets/icons/cd-9.jpg' },

        { id: 25, name: "Melon Fruit", price: "Rp38.000", image: "../assets/icons/mb-139.jpg" },
        { id: 26, name: "Papaya Fruit", price: "Rp38.000", image: "../assets/icons/mb-140.jpg" },
        { id: 27, name: "Apple Fruit", price: "Rp38.000", image: "../assets/icons/mb-141.jpg" },
        { id: 28, name: "Pineapple Fruit", price: "Rp38.000", image: "../assets/icons/mb-142.jpg" },
        { id: 29, name: "Mixed Fruit", price: "Rp38.000", image: "../assets/icons/mb-143.jpg" },
        { id: 30, name: "Water Melon Fruit", price: "Rp44.000", image: "../assets/icons/mb-144.jpg" },
      ],
      cigaretteItems: [
        { id: 1, name: 'GP Filter Cigarette', price: 'Rp55.000', image: '../assets/icons/cig-1.jpg' },
        { id: 2, name: 'Sampoerna Green Cigarette', price: 'Rp55.000', image: '../assets/icons/cig-2.jpg' },
        { id: 3, name: 'Sampoerna Red Cigarette', price: 'Rp55.000', image: '../assets/icons/cig-3.jpg' },
        { id: 4, name: 'Lighter', price: 'Rp10.000', image: '../assets/icons/cig-4.jpg' },
        { id: 5, name: 'Marlboro Red Cigarette', price: 'Rp55.000', image: '../assets/icons/cig-5.jpg' },
        { id: 6, name: 'Marlboro Light Cigarette', price: 'Rp55.000', image: '../assets/icons/cig-6.jpg' },
        { id: 7, name: 'Marlboro Green Light (Menthol)', price: 'Rp55.000', image: '../assets/icons/cig-7.jpg' },
        { id: 8, name: 'Marlboro Green Black Cigarette', price: 'Rp55.000', image: '../assets/icons/cig-8.jpg' }
      ],
      drinkItems:[
        // Coffee
        { id: 1, name: 'Espresso', price: 'Rp15.000', image: '../assets/icons/dr-1.jpg' },
        { id: 2, name: 'Cappucino', price: 'Rp30.000', image: '../assets/icons/dr-2.jpg' },
        { id: 3, name: 'Americano', price: 'Rp25.000', image: '../assets/icons/dr-3.jpg' },
        { id: 4, name: 'Coffee Latte', price: 'Rp25.000', image: '../assets/icons/dr-4.jpg' },

        // Juice
        { id: 5, name: 'Orange Juice/Kalimantan Juice', price: 'Rp48.000', image: '../assets/icons/dr-5.jpg' },
        { id: 6, name: 'Melon Juice', price: 'Rp48.000', image: '../assets/icons/dr-6.jpg' },
        { id: 7, name: 'Green Apple Juice', price: 'Rp48.000', image: '../assets/icons/dr-7.jpg' },
        { id: 8, name: 'Pineaple Juice', price: 'Rp37.000', image: '../assets/icons/dr-8.jpg' },
        { id: 9, name: 'Water Melon Juice', price: 'Rp37.000', image: '../assets/icons/dr-9.jpg' },
        { id: 10, name: 'Carrot Juice', price: 'Rp48.000', image: '../assets/icons/dr-10.jpg' },
        { id: 11, name: 'Avocado Juice', price: 'Rp48.000', image: '../assets/icons/dr-11.jpg' },
        { id: 12, name: 'Lime Juice', price: 'Rp39.000', image: '../assets/icons/dr-12.jpg' },
        { id: 13, name: 'Lemon Juice', price: 'Rp39.000', image: '../assets/icons/dr-13.jpg' },
        { id: 14, name: 'Mixed Fruit Juice', price: 'Rp48.000', image: '../assets/icons/dr-14.jpg' },
        { id: 15, name: 'Papaya Juice', price: 'Rp48.000', image: '../assets/icons/dr-15.jpg' },
        { id: 16, name: 'Ice Kacang', price: 'Rp48.000', image: '../assets/icons/dr-16.jpg' },
        { id: 17, name: 'Ice Longan', price: 'Rp48.000', image: '../assets/icons/dr-17.jpg' },
        { id: 18, name: 'Ice Cendol', price: 'Rp48.000', image: '../assets/icons/dr-18.jpg' },
        { id: 19, name: 'Ice Cincau', price: 'Rp32.000', image: '../assets/icons/dr-19.jpg' },
        
        // Softdrink
        { id: 20, name: 'Pocari Sweat (Bottle) @ 500 ml', price: 'Rp35.000', image: '../assets/icons/dr-20.jpg' },
        { id: 21, name: 'Pocari Sweat (Can) @ 330 ml', price: 'Rp30.000', image: '../assets/icons/dr-21.jpg' },
        { id: 22, name: '100 Plus Can @ 330 ml', price: 'Rp21.000', image: '../assets/icons/dr-22.jpg' },
        { id: 23, name: 'Coke zero or Diet Coke @ 330 ml', price: 'Rp25.000', image: '../assets/icons/dr-23.jpg' },
        { id: 24, name: 'Coke Can (Coca-Cola) @ 330 ml', price: 'Rp21.000', image: '../assets/icons/dr-24.jpg' },
        { id: 25, name: 'Fanta Merah @ 330 ml', price: 'Rp21.000', image: '../assets/icons/dr-25.jpg' },
        { id: 26, name: 'Sprite @ 330 ml', price: 'Rp21.000', image: '../assets/icons/dr-26.jpg' },
        { id: 27, name: 'Tonic Water @ 330 ml', price: 'Rp25.000', image: '../assets/icons/dr-27.jpg' },
        { id: 28, name: 'Soda Water @ 330 ml', price: 'Rp25.000', image: '../assets/icons/dr-28.jpg' },
        { id: 29, name: 'Soya Bean @ 330 ml', price: 'Rp21.000', image: '../assets/icons/dr-29.jpg' },
        { id: 30, name: 'Cincau @ 330 ml', price: 'Rp21.000', image: '../assets/icons/dr-30.jpg' },
        { id: 31, name: 'Aqua Big @ 1500 ml', price: 'Rp26.000', image: '../assets/icons/dr-31.jpg' },
        { id: 32, name: 'Aqua Small @ 600 ml', price: 'Rp13.000', image: '../assets/icons/dr-32.jpg' },
        { id: 33, name: 'Nu Green Tea @ 500 ml', price: 'Rp26.000', image: '../assets/icons/dr-33.jpg' },
        { id: 34, name: 'Red BUll @ 250 ml', price: 'Rp32.000', image: '../assets/icons/dr-34.jpg' },
        { id: 35, name: 'Mizone @ 500 ml', price: 'Rp26.000', image: '../assets/icons/dr-35.jpg' },

        // Tea
        { id: 36, name: 'Teh Tarik', price: 'Rp30.000', image: '../assets/icons/dr-36.jpg' },
        { id: 37, name: 'Kopi Tarik', price: 'Rp35.000', image: '../assets/icons/dr-37.jpg' },
        { id: 38, name: 'Milo Cup', price: 'Rp29.000', image: '../assets/icons/dr-38.jpg' },
        { id: 39, name: 'Milo Big', price: 'Rp48.000', image: '../assets/icons/dr-39.jpg' },
        { id: 40, name: 'Hot Tea Small', price: 'Rp15.000', image: '../assets/icons/dr-40.jpg' },
        { id: 41, name: 'Ice Tea', price: 'Rp15.000', image: '../assets/icons/dr-41.jpg' },
        { id: 42, name: 'Teh Tarik Jahe', price: 'Rp35.000', image: '../assets/icons/dr-42.jpg' },

        { id: 43, name: 'San Miguel @ 330 ml', price: 'Rp49.000', image: '../assets/icons/dr-43.jpg' },
        { id: 44, name: 'Bintang Beer @ 330 ml', price: 'Rp49.000', image: '../assets/icons/dr-44.jpg' },
        { id: 45, name: 'Tiger Beer @ 330 ml', price: 'Rp49.000', image: '../assets/icons/dr-45.jpg' },
        { id: 46, name: 'Heineken @ 330 ml', price: 'Rp49.000', image: '../assets/icons/dr-46.jpg' },
        { id: 47, name: 'Carlsberg @ 330 ml', price: 'Rp49.000', image: '../assets/icons/dr-47.jpg' },
        { id: 48, name: 'San Mig Light @ 330 ml', price: 'Rp42.000', image: '../assets/icons/dr-48.jpg' },
        { id: 49, name: 'Anker/Guinness Stout @ 330 ml', price: 'Rp49.000', image: '../assets/icons/dr-49.jpg' },
        { id: 50, name: 'Soju', price: 'Rp80.000', image: '../assets/icons/dr-50.jpg' },
        { id: 51, name: 'Saigon', price: 'Rp60.000', image: '../assets/icons/dr-51.jpg' },
        { id: 52, name: 'Taiwan Beer', price: 'Rp49.000', image: '../assets/icons/dr-52.jpg' },
        { id: 53, name: 'Kaiserdom', price: 'Rp150.000', image: '../assets/icons/dr-53.jpg' },
        { id: 54, name: 'Johnnie Black Label (Shoot)', price: 'Rp60.000', image: '../assets/icons/dr-54.jpg' },
        { id: 55, name: 'Chivas Regal (Shoot)', price: 'Rp60.000', image: '../assets/icons/dr-55.jpg' },
        { id: 56, name: 'Gordon Dry Gin (Shoot)', price: 'Rp48.000', image: '../assets/icons/dr-56.jpg' },
        { id: 57, name: 'Smirnoff Vodka (Shoot)', price: 'Rp42.000', image: '../assets/icons/dr-57.jpg' },
        { id: 58, name: 'Jack Daniel (Shoot)', price: 'Rp60.000', image: '../assets/icons/dr-58.jpg' },
        { id: 59, name: 'Craft Beer (Drink)', price: 'Rp42.000', image: '../assets/icons/dr-59.jpg' },
        { id: 60, name: 'Craft Beer Jug', price: 'Rp168.000', image: '../assets/icons/dr-60.jpg' },
        { id: 61, name: 'Bacardi Light / Rum 750 ml', price: 'Rp667.000', image: '../assets/icons/dr-61.jpg' },
        { id: 62, name: 'Bin 222 @ 750 ml', price: 'Rp552.000', image: '../assets/icons/dr-62.jpg' },
        { id: 63, name: 'Bin 444 @ 750 ml', price: 'Rp552.000', image: '../assets/icons/dr-63.jpg' },
        { id: 64, name: 'Bin 555 @ 750 ml', price: 'Rp552.000', image: '../assets/icons/dr-64.jpg' },
        { id: 65, name: 'Black Label / J Walker Black @ 750 ml', price: 'Rp878.000', image: '../assets/icons/dr-65.jpg' },
        { id: 66, name: 'Chivas Regal @ 750 ml', price: 'Rp914.000', image: '../assets/icons/dr-66.jpg' },
        { id: 67, name: 'Gordon Dry Gin @ 750 ml', price: 'Rp667.000', image: '../assets/icons/dr-67.jpg' },
        { id: 68, name: 'Jack Daniel @ 750 ml', price: 'Rp945.000', image: '../assets/icons/dr-68.jpg' },
        { id: 69, name: 'Smirnoff Vodka @ 750 ml', price: 'Rp667.000', image: '../assets/icons/dr-69.jpg' },
        { id: 70, name: 'Jameson @ 750 ml', price: 'Rp599.000', image: '../assets/icons/dr-70.jpg' },
      ],

      isModalOpen: false,
      selectedOption: 'MAKANAN',
      selectedLanguage: 'English',
      selectedTab: 'MAKANAN BERAT',
      showModal: false,
      showMenu: false,
      showSearch: false,
      menuItems: [],
      isRestaurantMenu: true,
      isScrolled: false,
      isMenuSectionScrolled: false,
    };
  },
  methods: {
    selectOption(option) {
      this.selectedOption = option;
      this.showModal = false;
      this.scrollToSection(option === 'MAKANAN' ? 'makananBeratSection' : 'drinkSection');
    },
    handleScroll() {
      const scrollPosition = window.scrollY;
      this.isScrolled = scrollPosition > 150;  
      
      const menuSection = this.$refs.makananBeratSection;
      if (menuSection) {
        const menuSectionTop = menuSection.getBoundingClientRect().top;
        this.isMenuSectionScrolled = menuSectionTop <=  160 ;
      }
    },
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
      this.showMenu = false;
    },
    selectLanguage(language) {
      if (language === 'English') {
        this.$router.push({ name: 'MenuPageEng' });
      } else {
        this.$router.push({ name: 'MenuPageInd' });
      }
      this.closeModal();
      // this.showMenu = false;
    },
    goToHandicapInformation() {
      this.$router.push({ name: 'HandicapGolfInfoPageEng' }); 
    },
    goToAboutPage() {
      this.$router.push({ name: 'AboutPageEng' }); 
    },
    scrollToSection(section) {
      const sectionMap = {
        makananBeratSection: 'MAKANAN BERAT',
        snackSection: 'SNACK',
        dessertSection: 'DESSERT',
        drinkSection: 'DRINK',
        cigaretteSection: 'CIGARETTE'
      };
      this.selectedTab = sectionMap[section];
      const sectionRef = this.$refs[section];
      if (sectionRef) {
        const header = document.querySelector('header');
        const headerOffset = header ? header.offsetHeight : 0;
        const top  = sectionRef.offsetTop - headerOffset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
      // sectionRef.scrollIntoView();
    },
    toggleMenu() {
      this.showMenu = !this.showMenu;
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
}
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}

.left-text {
  font-size: 18px;
  font-weight: bold;
  flex: 1;
  text-align: left;
  padding: 0px 0px 0px 18px;
}

.sticky-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  overflow-y: auto; 
  z-index: 1000; 
}

.menu-section-scrolled {
  position: fixed;
  top: 60px; /* Adjust based on your header height */
  width: 100%;
  z-index: 999;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-scrolled {
  background-color: white;
  width: 100%;
}

body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f5f5dc; /* Light beige background color */
  text-align: center;
}

header {
  color: black; 
  text-align: center;
  width: 100%;
  position: relative;
}

.pad-only {
  padding: 30px 20px 10px 20px;
}

.top-bar {
  display: flex;
  justify-content: flex-end; /* Align to the right */
  align-items: center; /* Align items to the center */
  margin-top: 0; /* Remove any margin from the top */
  padding-right: 20px;
}

.right-icons {
  display: flex;
  gap: 5px; 
}

.search-icon {
  background: none;
  border: none;
  cursor: pointer;
  color: black;
  margin-top: 13px;
}

.menu-button {
  background: none;
  border: none;
  color: black; 
  font: inherit;
  cursor: pointer;
  font-size: 24px;
}

.menu {
  position: fixed;
  top: 0;
  right: 0; 
  height: 100%; 
  width: 270px; 
  background-color: #fff;
  box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1);
  border-radius: 5px 0 0 5px;
  overflow: hidden;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  padding: 0px 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
  border: 1px solid #ddd; 
}

.menu-header {
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  position: relative; /* For positioning the close button */
  padding-top: 40px; /* Add padding to move the logo down */
  margin-bottom: 15px; /* Space below the header */
}

.menu-logo {
  width: 150px; /* Adjust logo size */
  display: block; /* Ensure the image is treated as a block element */
}

.menu a {
  display: block;
  padding: 10px 20px;
  color: black;
  text-decoration: none;
}

.menu a:hover {
  background-color: #f0f0f0;
}

.close-menu {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: lightgray; /* Change color to light gray */
  position: absolute; /* Position the close button */
  top: 10px; /* Align close button to the top */
}

.menu-nav {
  display: flex;
  flex-direction: column;
  gap: 15px; 
  padding: 0px 10px;
}

.menu-nav a {
  display: block;
  padding: 5px 20px;
  color: black;
  text-decoration: none;
  border-radius: 5px; 
  transition: background-color 0.3s; 
}

.menu-nav a:hover {
  background-color: #f0f0f0; /* Change background color on hover */
}

.menu-item-top {
  border: 1px solid #ddd; /* Add border */
  border-radius: 10px; /* Add border radius */
  overflow: hidden; /* Ensure content stays within the border radius */
}

.menu-item-top a:hover {
  background-color: #f0f0f0; /* Change background color on hover */
}

.menu-item-top a {
  display: flex; /* Use flexbox to align items */
  align-items: center; /* Center items vertically */
  padding: 10px 20px;
  color: black;
  text-decoration: none;
  transition: background-color 0.3s; /* Smooth transition for background color */
  text-align: left; /* Align text to the left */
}

.menu-icon {
  width: 24px; /* Set icon size */
  height: 24px; /* Set icon size */
  margin-right: 10px; /* Space between icon and text */
}

.header-image {
  width: 100%;
  max-width: 300px; /* Set a maximum width for mobile phone size */
  height: auto;
  border-radius: 5px;
  display: block;
  margin: 0 auto; /* Center the image */
}

.header-button {
  background: white;
  border: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
  text-align: left; /* Align text to the left */
  padding: 10px 20px 10px 10px;
  border-radius: 20px; /* Add border radius */
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 480px; /* Set a maximum width for mobile phone size */
  margin: 0 auto 20px; /* Center the button and add margin below */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: 10px;
  gap: 10px; /* Add gap between h1 and p */
}

.header-button h1,
.header-button p {
  margin: 0;
  text-align: left; /* Align text to the left */
}

.header-button h1 {
  font-size: 18px;
}

.header-button p {
  font-size: 12px; /* Adjusted text size */
  color: gray;
}

.arrow-icon {
  font-size: 24px;
  color: black;
}

.order-type {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  padding: 10px 20px;
  margin-bottom: 10px;
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 480px; /* Set a maximum width for mobile phone size */
  margin: 0 auto; /* Center the order type section */
}

.order-type h3 {
  font-size: 16px; /* Adjusted text size */
  margin: 0;
}

.order-type button {
  font-size: 14px; /* Adjusted text size */
}

.dine-in-button {
  font-size: 12px; /* Smaller text size */
  padding: 5px 10px; /* Smaller padding */
  border: none;
  background-color: white;
  color: black;
  border-radius: 5px;
  cursor: pointer;
  width: 80px; /* Set a smaller width */
  border: 1px solid lightgray;
  display: flex;
  justify-content: center; /* Center text horizontally */
  align-items: center; /* Center text vertically */
}

.dine-in-button:hover {
  background-color: darkorange;
}

.menu-container {
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1200px;
  margin: 0 auto; 
  box-sizing: border-box;
  flex-grow: 1;
  background-color: red;
}

.tabs {
  padding: 5px 5px 0px 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin: 0px 10px auto auto; 
  background-color: #fff;
  border-radius: 5px;
  width: 100%;
  max-width: 1200px; 
  overflow-x: auto;
}

.dropbtn {
  background-color: #fff;
  color: black;
  padding: 10px;
  font-size: 12px; 
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  flex-direction: column;
  margin-right: 10px;
}

.line {
  width: 20px;
  height: 2px;
  background-color: black;
  margin: 2px 0;
}

.tab {
  flex: 1;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  margin-bottom: 5px;
  white-space: nowrap;
  font-size: 13px; 
}

.tab.active {
  border-bottom: 3px solid orange;
  font-weight: bold;
}

.menu-section {
  margin: 10px 0;
}

.menu-section h2 {
  font-size: 15px;
  font-weight: bold;
}

.header-with-line {
  display: flex;
  align-items: center;
}

.header-with-line .line {
  flex-grow: 1;
  height: 1px;
  background-color: black;
  margin-left: 10px;
}

.menu-grid {
  display: grid;
  grid-template-columns: 1fr; 
  gap: 15px;
}

.menu-grid.two-columns {
  grid-template-columns: 1fr 1fr; 
}

.menu-item {
  background-color: #fff;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: left;
  width: 100%;
}

.menu-item img {
  width: 100%; /* Full width inside container */
  border-radius: 5px;
}

.menu-item h3 {
  margin: 10px 0;
  font-size: 14px; /* Adjusted text size */
  font-weight: bold;
}

.menu-item p {
  color: black;
  font-size: 14px; /* Adjusted text size */
  margin: 20px 0 5px 0;
}

.menu-item button {
  background-color: orange;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px; /* Adjusted text size */
}

.menu-item button:hover {
  background-color: darkorange;
}

.modal {
  display: flex;
  justify-content: center;
  align-items: flex-end; /* Align to the bottom */
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  animation: slide-up 0.3s ease-out; /* Slide up animation */
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.modal-content {
  background-color: #fff;
  padding: 2px;
  border-radius: 20px 20px 0px 0px; /* Rounded corners */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%; /* Make it wider */
  max-width: 600px; /* Maximum width */
  height: 100%;
  max-height: 235px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  font-size: 16px; /* Adjusted text size */
  margin: 0;
}

.close {
  color: #aaa;
  font-size: 20px; /* Adjusted text size */
  font-weight: bold;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
}

.modal-body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ccc; /* Add border */
  border-radius: 5px; /* Add border radius */
  background-color: #fff;
  cursor: pointer;
  font-size: 12px; /* Adjusted text size */
}

button:hover {
  background-color: transparent; 
}

button.selected {
  background-color: green;
  color: white;
}

.modal-button{
  font-size: 18px; /* Increase text size */
  padding: 15px 20px; /* Increase padding */
  margin: 5px 0; /* Add margin between buttons */
  border: none;
  border-radius: 10px; /* Add border radius */
  background-color:#fff;
  cursor: pointer;
  width: 100%; /* Make button full width */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modalbot-button {
  font-size: 18px; /* Increase text size */
  padding: 15px 20px; /* Increase padding */
  margin: 5px 0; /* Add margin between buttons */
  border: 1px solid #ff7440; /* Add border */
  border-radius: 10px; /* Add border radius */
  background-color: #fff;
  cursor: pointer;
  width: 100%; /* Make button full width */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modalbot-button:hover {
  background-color: #f0f0f0; 
}

.modalbot-button.selected {
  background-color: #ff7440;
  color: white;
  border: none;
}

.tickbot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: white;
}

.tickbot-icon {
  width: 16px;
  height: 16px;
}

.tick {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.tick-icon {
  width: 16px;
  height: 16px;
}

.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(100%);
}
</style>