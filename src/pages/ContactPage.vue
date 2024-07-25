<template>
  <div class="meet-the-team">
    <h1>Meet the <span class="highlight">team.</span></h1>
    <div class="tabs">
      <button v-for="tab in tabs" :key="tab" @click="selectTab(tab)" :class="{ active: selectedTab === tab }">{{ tab }}</button>
    </div>
    <div class="team">
      <div class="team-member" v-for="member in filteredMembers" :key="member.name">
        <img :src="member.image" :alt="member.name" />
        <h2>{{ member.name }}</h2>
        <h3>{{ member.position }}</h3>
        <p>{{ member.title }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedTab: 'Frontend',
      tabs: ['Frontend', 'Backend', 'Database'],
      members: [
        { name: 'STEVE AMBUUL', position: 'HEAD OF SALES', title: '', image: 'Images/prof.jpg', category: 'Frontend' },
        { name: 'MEL PHELPS CEVIK', position: 'REGIONAL DIRECTOR, APAC', title: '', image: 'Images/prof.jpg', category: 'Frontend' },
        { name: 'ALDEN DALE', position: 'DIRECTOR OF SOLUTIONS', title: '', image: 'Images/prof.jpg', category: 'Backend' },
        { name: 'KALEY DENEEN', position: 'REGIONAL DIRECTOR, EMEA', title: '', image: 'Images/prof.jpg', category: 'Backend' },
        { name: 'TONY EADES', position: 'CHIEF STRATEGY OFFICER', title: '', image: 'Images/prof.jpg', category: 'Backend' },
        { name: 'MEGAN ERICKSON', position: 'EXECUTIVE DIRECTOR', title: '', image: 'Images/prof.jpg', category: 'Database' },
        { name: 'URSULA FELLER', position: 'PEOPLE AND CULTURE GENERALIST', title: '', image: 'Images/prof.jpg', category: 'Database' },
        { name: 'BRANDON JONES', position: 'EXECUTIVE REGIONAL DIRECTOR, NA', title: '', image: 'Images/prof.jpg', category: 'Database' },
        { name: 'ALAIRE JONES', position: 'DIRECTOR OF OPERATIONS', title: '', image: 'Images/prof.jpg', category: 'Database' },
        { name: 'ANDREW LEVY', position: 'EXECUTIVE DIRECTOR, REVENUE OPERATIONS', title: '', image: 'Images/prof.jpg', category: 'Database' },
      ],
    };
  },
  computed: {
    filteredMembers() {
      return this.members.filter(member => member.category === this.selectedTab);
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
.meet-the-team {
  text-align: center;
  padding: 20px;
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
  margin: 10px;
  text-align: center;
}

.team-member img {
  border-radius: 50%;
  width: 150px;
  height: 150px;
}

.team-member h2 {
  font-size: 1.2em;
  margin: 10px 0 5px;
}

.team-member h3 {
  font-size: 1em;
  margin: 5px 0;
  color: #555;
}

.team-member p {
  font-size: 0.9em;
  color: #777;
}
</style>
