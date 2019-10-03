<template>

  <div class="wrapper">
    <nuxt />
    <Footer />
  </div>

</template>

<script>

import Footer from '~/components/Footer.vue'

// import resize from 'vue-resize-directive'

export default {
  components: {
    Footer
  },
  methods: {
    onResize: function () {
      /* if (window.innerWidth < 1280) {
       *   document.getElementById('sidebar').classList.add('inactive')
       * } else {
       *   document.getElementById('sidebar').classList.remove('inactive')
       * } */
    },
    toggleMenu: function () {
      /* var sidebar = document.getElementById('sidebar')
       * if (sidebar.className.match(/inactive/)) {
       *   sidebar.classList.remove('inactive')
       * } else {
       *   sidebar.classList.add('inactive')
       * } */
    }
  }
}

</script>

<style lang="postcss">

@import '~/assets/sass/layout/global.scss';

body {
  background: #363850;
}


</style>
