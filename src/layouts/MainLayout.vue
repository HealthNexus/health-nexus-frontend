<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-positive text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          HealthNexus
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab :to="{name:'signin'}" label="sign in" />
        <q-route-tab :to="{name:'signup'}" label="sign up" />
        <q-route-tab :to="{name:'posts'}" label="posts" />
        <q-route-tab :to="{name:'dashboard'}" label="dashboard" />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>
