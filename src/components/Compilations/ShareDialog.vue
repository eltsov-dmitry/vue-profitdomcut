<template>
  <q-dialog v-model="isOpen">
    <q-card>
      <div class="link">
        <span>Выделите и скопируйте ссылку в буфер обмена.</span>
        <p>{{ link }}</p>
      </div>
      <div class="qr">
        <qrcode-vue :value="link" size="200" level="H" />
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import QrcodeVue from 'qrcode.vue';
import { computed } from 'vue';

export default {
  name: 'ShareDialog',
  components: { QrcodeVue },
  props: ['modelValue', 'link'],
  emits: ['update:modelValue'],
  setup(props, context) {
    const isOpen = computed({
      get: () => props.modelValue,
      set: (value) => context.emit('update:modelValue', value),
    });
    return {
      isOpen,
    };
  },
};
</script>

<style scoped lang="scss">
.qr {
  padding: 100px 150px;
}

.link {
  padding: 15px;
  background-color: #ddd;
  border: 2px #ccc dashed;
  text-align: center;

  span {
    font-size: 11px;
    font-weight: 700;
    margin-bottom: 10px;
    display: inline-block;
    user-select: none;
  }

  p {
    background-color: #fff;
    border-radius: 10px;
    padding: 5px;
  }
}
</style>
