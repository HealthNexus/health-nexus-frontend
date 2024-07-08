<template>
  <q-layout view="hhh lpR fFf">
    <q-header elevated  class="bg-primary text-white">
      <q-toolbar >
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>
          Title
        </q-toolbar-title>
        <q-tabs align="left">
          <q-route-tab :to="{name:'home'}" label="Home"/>
          <q-route-tab :to="{name:'posts'}" label="posts" />
          <q-route-tab :to="{name:'dashboard'}" label="dashboard" />
        </q-tabs>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup></script>
