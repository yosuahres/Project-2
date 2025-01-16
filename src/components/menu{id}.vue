<template>
  <div>
    <header>
    <div class="sticky-header" :class="{ 'header-scrolled': isScrolled }">
      <div class="top-bar">

        <!-- header for scrolled -->
        <div class="left-text" v-if="isScrolled">
          Indah Puri
        </div>
        <!-- end -->

        <div class="right-icons">
          <button class="search-icon" @click="showSearch = !showSearch">
            <img src="../assets/icons/search.png" alt="search icon" style="width: 24px; height: 24px;">
          </button>
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
                    Bahasa
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
          <p>Buka Hari Ini, 06:00-19:00</p>
        </div>
        <span class="arrow-icon">></span>
      </button>
      <div class="order-type">
        <h3>Temukan Lebih Banyak</h3>
        <button class="dine-in-button" @click="goToHandicapInformation">
          Informasi Handicap
        </button>
      </div>
    </div>
    </header>

    <!-- <div class="container"> -->
      <!-- <div class="menu-container "> -->
        <div class="tabs" :class="{ 'menu-section-scrolled ': isMenuSectionScrolled }">
          <button class="dropbtn" @click="showModal = true">
            <div class="logo">
              <div class="line"></div>
              <div class="line"></div>
              <div class="line"></div>
            </div>
            {{ selectedOption }}
          </button>
          <div :class="['tab', { active: selectedTab === 'MAKANAN BERAT' }]" @click="scrollToSection('makananBeratSection')">MAKANAN BERAT</div>
          <div :class="['tab', { active: selectedTab === 'SNACK' }]" @click="scrollToSection('snackSection')">SNACK</div>
          <div :class="['tab', { active: selectedTab === 'COLD DESSERT' }]" @click="scrollToSection('coldDessertSection')">COLD DESSERT</div>
          <div :class="['tab', { active: selectedTab === 'HOT DESSERT' }]" @click="scrollToSection('hotDessertSection')">HOT DESSERT</div>
          <div :class="['tab', { active: selectedTab === 'DRINK' }]" @click="scrollToSection('drinkSection')">DRINK</div>
        </div>

        <div style="padding: 0px 10px 10px 10px ;">
        <div class="menu-section">
          <h2 class="header-with-line">
            MAKANAN
            <span class="line"></span>
          </h2>
        </div>
        <div class="menu-section" ref="makananBeratSection">
          <h2>MAKANAN BERAT</h2>
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
            MINUMAN
            <span class="line"></span>
          </h2>
        </div>
        <div class="menu-section" ref="coldDessertSection">
          <h2>COLD DESSERT</h2>
          <div class="menu-grid two-columns">
            <div v-for="item in coldDessertItems" :key="item.id" class="menu-item">
              <img :src="item.image" :alt="item.name">
              <h3>{{ item.name }}</h3>
              <p>{{ item.price }}</p>
            </div>
          </div>
        </div>
        <div class="menu-section" ref="hotDessertSection">
          <h2>HOT DESSERT</h2>
          <div class="menu-grid two-columns">
            <div v-for="item in hotDessertItems" :key="item.id" class="menu-item">
              <img :src="item.image" :alt="item.name">
              <h3>{{ item.name }}</h3>
              <p>{{ item.price }}</p>
            </div>
          </div>
        </div>
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
      </div>
    </div>
    <!-- </div> -->

      <!-- languange selection modal -->
      <div v-if="isModalOpen" class="modal">
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
              <span>MAKANAN</span>
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
      ],
      snackItems:[
        { id: 1, name: 'kosong', price: 'Rp117.000', image: '../assets/icons/sc-1.jpg' },
      ],
      coldDessertItems:[
        { id: 1, name: 'kosong', price: 'Rp117.000', image: '../assets/icons/cd-1.jpg' },
      ],
      hotDessertItems:[
        { id: 26, name: 'kosong', price: 'Rp117.000', image: '../assets/icons/hd-1.jpg' },
      ],
      drinkItems:[
        { id: 1, name: 'Espresso', price: 'Rp15.000', image: '../assets/icons/dr-1.jpg' },
        { id: 2, name: 'Cappucino', price: 'Rp30.000', image: '../assets/icons/dr-2.jpg' },
        { id: 3, name: 'Americano', price: 'Rp25.000', image: '../assets/icons/dr-3.jpg' },
        { id: 4, name: 'Coffee Latte', price: 'Rp25.000', image: '../assets/icons/dr-4.jpg' },
      ],

      isModalOpen: false,
      selectedOption: 'MAKANAN',
      selectedLanguage: 'Indonesia',
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
  // computed: {
  //   makananBeratItems() {
  //     return this.menuItems.filter(item => item.type === 'berat')
  //   },
  //   snackItems() {
  //     return this.menuItems.filter(item => item.type === 'snack');
  //   },
  //   coldDessertItems() {
  //     return this.menuItems.filter(item => item.type === 'cold dessert');
  //   },
  //   hotDessertItems() {
  //     return this.menuItems.filter(item => item.type === 'hot dessert');
  //   },
  //   drinkItems() {
  //     return this.menuItems.filter(item => item.type === 'drink');
  //   }
  // },
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
      this.showMenu = false;
    },
    goToHandicapInformation() {
      this.$router.push({ name: 'HandicapGolfInfoPageInd' }); 
    },
    goToAboutPage() {
      this.$router.push({ name: 'AboutPageInd' }); 
    },
    scrollToSection(section) {
      const sectionMap = {
        makananBeratSection: 'MAKANAN BERAT',
        snackSection: 'SNACK',
        coldDessertSection: 'COLD DESSERT',
        hotDessertSection: 'HOT DESSERT',
        drinkSection: 'DRINK'
      };
      this.selectedTab = sectionMap[section];
      const sectionRef = this.$refs[section];
      sectionRef.scrollIntoView({ behavior: 'smooth' });
    },
    // fetchMenuItems() {
    //   fetch('http://localhost:3000/menu')
    //     .then(response => response.json())
    //     .then(data => {
    //       this.menuItems = data; // Assign fetched data to menuItems
    //     })
    //     .catch(error => {
    //       console.error('There was an error!', error);
    //     });
    // },
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
  // created() {
  //   this.fetchMenuItems();
  // }
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
  background-color: #f0f0f0; 
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