<template>
  <div class="loading-wrapper">
    <q-spinner
      color="primary"
      size="3em"
      :thickness="10"
    />
  </div>
</template>

<script>
export default {
  name: 'Loader',
};
</script>

<style scoped>
.loading-wrapper{
  position: absolute;
  width: 100%;
  height: 100%;
  /*min-height: 300px;*/
  top: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}
</style>
