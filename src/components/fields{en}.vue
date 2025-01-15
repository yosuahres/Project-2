<template>
    <div>
      <header>
        <div class="top-bar">
          <div class="right-icons">
            <button class="search-icon" @click="showSearch = !showSearch">
              <img src="../assets/icons/search.png" alt="search icon" style="width: 24px; height: 24px;">
            </button>
            <button class="menu-button" @click="toggleMenu">  
              ☰
            </button> 
            <transition name="slide">
              <div class="menu" v-if="showMenu">
                <div class="menu-header">
                  <button class="close-menu" @click="toggleMenu">✖</button>
                  <img src="../assets/icons/logo1 (1).png" alt="Menu Logo" class="menu-logo">
                </div>
                <nav class="menu-nav">
                  <div class="menu-item-top">
                    <a href="/page2">
                      <img src="../assets/icons/language.png" alt="2" class="menu-icon">
                      Language
                    </a>
                  </div>
                </nav>
              </div>
            </transition>
          </div>
        </div>
  
        <img src="../assets/icons/ip-logo.png" alt="Header Image" class="header-image">
        <button class="header-button">
          <div class="header-content">
            <h1>Indah Puri</h1>
            <p>Open today, 06:30-21:15</p>
          </div>
          <span class="arrow-icon">></span>
        </button>

        <div class="order-type">
          <h3>Discover More</h3>
          <button class="dine-in-button" @click="goToMenuInformation">
            Menu Info
          </button>
        </div>
        
      </header>
  
      <div class="container">
        <div class="media-container">
          <img src="../assets/icons/handicap.jpeg" alt="handicap" class="media-image" @click="showModal = true">
          <video autoplay loop muted class="media-video">
            <source src="../assets/icons/field.mp4" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        </div>
        <div v-if="showModal" class="modal" @click="showModal = false">
          <span class="close" @click="showModal = false">&times;</span>
          <img class="modal-content" src="../assets/icons/handicap.jpeg">
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Menu',
    data() {
      return {
        selectedOption: 'MAKANAN',
        selectedTab: 'MAKANAN BERAT',
        showModal: false,
        showMenu: false,
        showSearch: false,
        showModalz: false,
        menuItems: [],
        modalImage: '../assets/icons/handicap.jpeg'
      };
    },
    computed: {
      makananBeratItems() {
        return this.menuItems.filter(item => item.type === 'berat');
      },
      snackItems() {
        return this.menuItems.filter(item => item.type === 'snack');
      },
      coldDessertItems() {
        return this.menuItems.filter(item => item.type === 'cold dessert');
      },
      hotDessertItems() {
        return this.menuItems.filter(item => item.type === 'hot dessert');
      },
      drinkItems() {
        return this.menuItems.filter(item => item.type === 'drink');
      }
    },
    methods: {
      selectOption(option) {
        this.selectedOption = option;
        this.showModal = false;
        this.scrollToSection(option === 'MAKANAN' ? 'makananBeratSection' : 'drinkSection');
      },
      goToMenuInformation() {
        this.$router.push({ name: 'MenuPageEng' }); 
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
      fetchMenuItems() {
        fetch('http://localhost:3000/menu')
          .then(response => response.json())
          .then(data => {
            this.menuItems = data; // Assign fetched data to menuItems
          })
          .catch(error => {
            console.error('There was an error!', error);
          });
      },
      toggleMenu() {
        this.showMenu = !this.showMenu;
      }
    },
    created() {
      this.fetchMenuItems();
    }
  }
  </script>
  
  <style scoped>
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
    padding: 10px 20px;
    width: 100%;
    position: relative;
  }
  
  .top-bar {
    display: flex;
    justify-content: flex-end; /* Align to the right */
    align-items: center; /* Align items to the center */
    margin-top: 0; /* Remove any margin from the top */
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
  
  .closex {
    position: absolute;
    top: 20px;
    right: 35px;
    color: #fff;
    font-size: 40px;
    font-weight: bold;
    cursor: pointer;
  }

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }

  .media-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .media-image, .media-video {
    max-width: 100%;
    height: auto;
    margin-bottom: 10px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }
  
  .modal {
    display: flex;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.8);
    justify-content: center;
    align-items: center;
  }

  .modal-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .game-info {
    font-size: 1.2em;
    color: #333;
    text-align: center;
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
    background-color: #ffffff;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 100%;
  }
  
  .tabs {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin: 10px 0;
    background-color: #fff;
    border-radius: 5px;
    width: 100%;
    overflow-x: auto;
  }
  
  .dropbtn {
    background-color: #fff;
    color: black;
    padding: 10px;
    font-size: 12px; /* Adjusted text size */
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
    font-size: 13px; /* Adjusted text size */
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
    grid-template-columns: 1fr; /* Single column for mobile look */
    gap: 15px;
  }
  
  .menu-grid.two-columns {
    grid-template-columns: 1fr 1fr; /* Two columns for food list */
  }
  
  .menu-item {
    background-color: #fff;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 100%;
  }
  
  .menu-item img {
    width: 100%; /* Full width inside container */
    border-radius: 5px;
  }
  
  .menu-item h3 {
    margin: 10px 0 5px;
    font-size: 12px; /* Adjusted text size */
  }
  
  .menu-item p {
    color: gray;
    font-size: 10px; /* Adjusted text size */
    margin: 5px 0;
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
    background-color: rgba(0, 0, 0, 0.4);
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
    padding: 20px;
    border-radius: 20px; /* Rounded corners */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 90%; /* Make it wider */
    max-width: 500px; /* Maximum width */
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
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
    background-color: transparent; /* Ensure background color does not change on hover */
  }
  
  button.selected {
    background-color: green;
    color: white;
  }
  
  .modal-button {
    font-size: 18px; /* Increase text size */
    padding: 15px 20px; /* Increase padding */
    margin: 10px 0; /* Add margin between buttons */
    border: 1px solid #ccc; /* Add border */
    border-radius: 5px; /* Add border radius */
    background-color: #fff;
    cursor: pointer;
    width: 100%; /* Make button full width */
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .modal-button:hover {
    background-color: #f0f0f0; /* Change background color on hover */
  }
  
  .modal-button.selected {
    background-color: green;
    color: white;
  }
  
  .tick {
    margin-left: auto;
    color: white;
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