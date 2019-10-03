<template>

  <div class="wrapper">

    <header>
      <div class="nav clearfix">
        <div class="left le">
          <div class="logo"><nuxt-link to="/"><img src="/images/logo-coupon@2x.png" alt="couponlogo"></nuxt-link></div>
        </div>
        <div class="toogle" @click="change_route()"><span /><span /><span /></div>
        <div class="menu_list le">
          <ul>
            <li class="XXXactive"><nuxt-link to="/dashboard">DASHBOARD</nuxt-link></li>
            <li><nuxt-link to="/create">CREATE A CAMPAIGN</nuxt-link></li>
          </ul>
        </div>
      </div>
    </header>

    <nuxt />

  </div>

</template>

<script>

 // import resize from 'vue-resize-directive'

 export default {
   directives: {
     // resize
   },
   monted () { // solution move sidebar to component
     console.log(`this.$el doesn't exist yet, but it will soon!`)
     this.onResize()
   },
   methods: {
     change_route: function () {
       if (this.$router.history.current.name === 'create') {
         console.log(this.$router.history.current.name)
         this.$router.push({path: '/dashboard'})
       } else {
         console.log(this.$router.history.current.name)
         this.$router.push({path: '/create'})
       }
     },
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
  background-color: #242539 !important;
  color: #9a9ba4;
}

.web3Error {

  h3, p {
    margin: 2em;
  }
}

.transact {
  background-image: linear-gradient(102deg, #edb34b, #f3594f);
  color: #000;
  display: inline-block;
  padding: 0 0.5em 0 0.5em;
  margin: 0 0 0 2em;
}

</style>
