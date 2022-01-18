<template>
  <q-dialog v-model="isOpen">
    <q-card>
      <q-card-section>
        <div class="text-h6">Удалить</div>
      </q-card-section>

      <q-card-section class="q-pt-none"> {{ getMessage() }} </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Нет" color="primary" v-close-popup />
        <q-btn flat label="Да" color="primary" @click="handler" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'DeleteDialog',
  props: ['modelValue', 'placement', 'item'],
  emits: ['update:modelValue'],
  setup(props, context) {
    const store = useStore();
    const { placement } = props;
    const { item } = props;
    const isOpen = computed({
      get: () => props.modelValue,
      set: (value) => context.emit('update:modelValue', value),
    });
    return {
      isOpen,
      getMessage: () => {
        switch (placement) {
          case 'list':
            return 'Вы уверены что хотите удалить эту подборку?';
          case 'current':
            return 'Вы уверены что хотите удалить эту квартиру?';
          default:
            return '';
        }
      },
      handler: async () => {
        switch (placement) {
          case 'list':
            await store.dispatch('compilations/deleteCompilation', item);
            isOpen.value = false;
            break;
          case 'current':
            await store.dispatch('compilations/deleteCompilationItem', item);
            isOpen.value = false;
            break;
          default:
            isOpen.value = false;
            break;
        }
      },
    };
  },
};
</script>

<style scoped></style>
