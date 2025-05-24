<template>
  <q-page class="landing-page">
    <div class="hero">
      <div class="hero-text">
        <h1 class="main-title">Welcome to {{APP_NAME}}</h1>
        <p class="subtitle">
          Your Ultimate Solution for all health and wellness activity!
        </p>
        <div class="buttons">
          <q-btn color="primary" label="Sign Up" class="rounded-button" :to="{name: 'signup'}" v-if="!authStore.loggedIn" />
          <q-btn
            color="primary"
            outline
            label="Sign In"
            class="rounded-button"
            :to="{name:'signin'}"
            v-if="!authStore.loggedIn"
          />
          <q-btn color="primary" outline label="Blogs" class="rounded-button" :to="{name:'posts'}"/>
        </div>
      </div>
        <q-img
          src="/src/assets/flat-hand-drawn-patient-taking-medical-examination.png"
          class="hero-image"
        />
    </div>

    <div class="features row justify-around q-gutter-lg">
      <q-card class="feature col-12 col-md-3 rounded-card">
        <q-card-section>
          <q-icon name="dvr" size="40px" />
          <h2 class="feature-title">Health Records</h2>
          <p class="feature-text">
            Securely store and manage your medical history for easy access and
            sharing with healthcare providers.
          </p>
        </q-card-section>
      </q-card>

      <q-card class="feature col-12 col-md-3 rounded-card">
        <q-card-section>
          <q-icon name="chat" size="40px" />
          <h2 class="feature-title">ChatBox</h2>
          <p class="feature-text">
            Get instant support and answers to your health questions 24/7 with
            our integrated chatbot.
          </p>
        </q-card-section>
      </q-card>
    </div>

    <q-footer class="footer">
      <div class="footer-content">
        <p class="footer-text">Copyright © 2024 {{APP_NAME}} Organization</p>
      </div>
    </q-footer>
  </q-page>
</template>

<script lang="ts" setup>
import { useAuthStore } from 'src/stores/auth';
import { useGlobalStore } from 'src/stores/global';
import { onMounted } from 'vue';
import { APP_NAME } from 'src/constants';

const authStore = useAuthStore();
const globalStore = useGlobalStore();

onMounted(()=>{
  globalStore.showSearch = false;
})
</script>

<style scoped>
.landing-page {
  text-align: center;
}

.header {
  background-color: #fff;
}

.hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 50px;
  margin-left: 50px;
}

.hero-text {
  max-width: 50%;
}

.hero-image {
  max-width: 45%;

  background: radial-gradient(circle, rgba(154, 162, 230, 0.5), rgba(241, 167, 232, 0) 50%);
}

.main-title {
  font-size: 3rem;
  margin-bottom: 0.2rem;
}

.subtitle {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
}

.buttons {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.rounded-button {
  border-radius: 20px;
}

.features {
  padding: 50px;
  background-color: #f9f9f9;
}

.feature {
  padding: 50px;
  margin: 20px 0;
  text-align: left;
}

.feature-title {
  font-size: 1.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.feature-text {
  font-size: 1rem;
}

.footer-text {
  font-size: small;
  color: white;
}

.rounded-card {
  border-radius: 20px;
}

.footer {
  padding: 15px 0;
  background-color: navy;
}

.footer-content {
  text-align: center;
}



</style>
