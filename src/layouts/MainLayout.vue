<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-dark text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          HealthNexus
        </q-toolbar-title>

        <!-- Add search box that is allingned at the center -->
        <q-input outlined placeholder="Search" dense class="q-mx-md text-white border border-blue-500 rounded-xl px-2 " >
          <template #after>
            <q-icon name="search" class="text-white"/>
          </template>
        </q-input>

        <q-tabs align="left">
          <q-route-tab :to="{name:'signin'}" label="sign in" />
          <q-route-tab :to="{name:'signup'}" label="sign up" />
          <q-route-tab :to="{name:'posts'}" label="posts" />
        </q-tabs>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <!-- drawer content -->
       <!-- dummy routes -->
      <q-list>
        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label>Home</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label>Profile</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label>Settings</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const leftDrawerOpen = ref(false)

    return {
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
}
</script>
