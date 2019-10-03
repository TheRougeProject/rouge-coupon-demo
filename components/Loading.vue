
<template>
  <div v-show="loading" class="loading_spin">
    <i class="fa fa-spinner fa-spin" />
  </div>
</template>

<script>
export default {
  data: () => ({
    loading: false
  }),
  methods: {
    start () {
      this.loading = true
    },
    finish () {
      this.loading = false
    }
  }
}
</script>

<style scoped>
.loading_spin {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.3);
  text-align: center;
  padding-top: 20px;
  font-size: 30px;
  font-family: sans-serif;
}
</style>
