<template>

  <q-layout view="hHh lpR fFf">
  <div class="hero_area">
    <!-- slider section -->
    <section class="slider_section">
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <div class="text">
              <h1 class="title">{{APP_NAME}}</h1>
              <p>
                Welcome to {APP_NAME} - your all-in-one health management
                solution. Whether you need to refill your prescriptions through
                our e-pharmacy, securely manage your health records, or get
                instant support from our AI chatbot, {APP_NAME} is here to
                make your health journey seamless and convenient. Take control
                of your health with just a few clicks.
              </p>


    <q-btn flat :to="{name: 'home'}" class="my-2 bg-blue-900 text-white font-semibold py-2 px-3 rounded-xl hover:bg-indigo-900">
      Home
    </q-btn>
            </div>
          </div>
          <div class="col-md-6">
            <div class="img-box">
              <img src="/Images/slider-img.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- end slider section -->
  </div>

  <div class="meet-the-team">
    <h1>Meet the <span class="highlight">team.</span></h1>
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="selectTab(tab)"
        :class="{ active: selectedTab === tab }"
      >
        {{ tab }}
      </button>
    </div>
    <div class="team">
      <div
        class="team-member"
        v-for="member in filteredMembers"
        :key="member.name"
      >
        <img :src="member.image" :alt="member.name" />
        <h4 style="font-weight: bold;">{{ member.name }}</h4>
        <p>{{ member.position }}</p>
        <p>{{ member.title }}</p>
      </div>
    </div>
  </div>

  <q-footer reveal elevated class="bg-indigo-10">
      <q-toolbar>
        <q-toolbar-title>
          <div class="footer-text">Copyright © Nexus Health</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

</q-layout>
</template>

<script>
import { APP_NAME } from 'src/constants';

export default {
  data() {
    return {
      APP_NAME,
      selectedTab: 'Frontend',
      tabs: ['Frontend', 'Backend', 'Database'],
      members: [
        {
          name: 'GIDEON NYARKO',
          position: 'UI/UX DEV',
          title: 'FRONTEND LEAD',
          image: 'Images/gideon.png',
          category: 'Frontend',
        },
        {
          name: 'PETER MANDIEYA',
          position: 'UI/UX DEV',
          title: '',
          image: 'Images/peter.jpg',
          category: 'Frontend',
        },
        {
          name: 'JOHN ANAMBOI',
          position: 'FULLSTACK DEV',
          title: 'BACKEND LEAD',
          image: 'Images/john.jpg',
          category: 'Backend',
        },
        {
          name: 'BONSE NZAKAME',
          position: 'DATABASE DEV',
          title: '',
          image: 'Images/bonse.jpg',
          category: 'Database',
        },
        {
          name: 'MOMORE MONSURU-OKE',
          position: 'DATABASE DESIGN',
          title: '',
          image: 'Images/momore.jpg',
          category: 'Database',
        },
        {
          name: 'JAMAL NOAH',
          position: 'BACKEND DEV',
          title: '',
          image: 'Images/jamal.jpg',
          category: 'Backend',
        },
        {
          name: 'RASHID NUMBO',
          position: 'BACKEND DEV',
          title: '',
          image: 'Images/rashid.jpg',
          category: 'Database',
        },
        {
          name: 'SANDRA ODURO',
          position: 'FRONTEND DEV',
          title: '',
          image: 'Images/sandra.jpg',
          category: 'Frontend',
        },
        {
          name: 'ISRAEL TESSU',
          position: 'FRONTEND DEV',
          title: '',
          image: 'Images/israel.jpg',
          category: 'Frontend',
        },
        {
          name: 'DELPHINAH KWARTEMAA',
          position: 'HR',
          title: '',
          image: 'Images/delphinah.jpg',
          category: 'Frontend',
        },
        {
          name: 'ANTHONY ADJEI',
          position: 'BACKEND DEV',
          title: '',
          image: 'Images/anthony.jpg',
          category: 'Backend',
        },
        {
          name: 'DIIVINE ADJABENG JNR',
          position: 'BACKEND DEV',
          title: '',
          image: 'Images/divine.jpg',
          category: 'Backend',
        },
      ],
    };
  },
  computed: {
    filteredMembers() {
      return this.members.filter(
        (member) => member.category === this.selectedTab
      );
    },
  },
  methods: {
    selectTab(tab) {
      this.selectedTab = tab;
    },
  },
};
</script>

<style scoped>
.row {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
}

.slider_section{
  background-image: url(/Images/hero-bg.png);
}

.container {
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
  margin-top: 50px;
  margin-bottom: 1rem;

}

.footer-text{
  font-size: small;
  text-align: center;
}

.title {
  margin-bottom: 0;
  font-size: xx-large;
}

.text {
  margin-bottom: 10px;
  margin-top: 200px;
  padding-left: 30px;
  max-width: 500px;
  color: white;
}

.meet-the-team {
  text-align: center;
  padding: 20px;
  margin-bottom: 50px;
}

.highlight {
  font-weight: bold;
}

.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.tabs button {
  background: none;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 1em;
}

.tabs button.active {
  font-weight: bold;
  border-bottom: 2px solid #000;
}

.team {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.team-member {
  margin: 20px;
  text-align: center;

}

.team-member img {
  border-radius: 50%;
  width: 150px;
  height: 150px;
  justify-content: center;
}

.team-member h2 {
  font-size: 1.2em;
  margin: 10px 0 5px;
  justify-content: center;
}

.team-member h3 {
  font-size: 1em;
  margin: 5px 0;
  color: #555;
  justify-content: center;
}

.team-member p {
  font-size: 0.9em;
  color: #777;
  justify-content: center;
}
</style>

<!-- <style src="/src/css/bootstrap.css"></style> -->
