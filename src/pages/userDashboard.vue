<template>
  <!-- Dashboard -->
  <q-page>
    <q-page-container>
      <q-card class="q-mb-md">
        <q-card-section>
          <h1>
            Dashboard
          </h1>
        </q-card-section>
        <q-card-section>
          <q-list>
            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label header>
                  <q-icon name="person" />
                  Profile: {{ authStore.user?.name }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="chevron_right" />
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label header>
                  <q-icon name="settings" />
                  Settings
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="chevron_right" />
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label header>
                  <q-icon name="exit_to_app" />
                  Logout
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="chevron_right" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-page-container>
  </q-page>
</template>

<script setup lang="ts">
  import {  onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';

  const authStore = useAuthStore();

  onMounted(() => {
    if (!authStore.user) {
      authStore.fetchUser();
    }
  });

</script>
