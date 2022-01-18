<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Назовите вашу подборку</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input
          color="grey-3"
          dense
          ref="nameRef"
          v-model="name"
          autofocus
          @keyup.enter="isOpen = false"
          lazy-rules
          :rules="nameRules"
        />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Закрыть" v-close-popup />
        <q-btn flat @click="onSubmit" style="width: 80px">
          <template v-if="loading">
            <q-spinner color="primary" size="15px" :thickness="10"/>
          </template>
          <template v-else> Создать </template>
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'CompilationCreate',
  props: ['modelValue'],
  emits: ['update:modelValue'],

  setup(props, context) {
    const store = useStore();
    const isOpen = computed({
      get: () => props.modelValue,
      set: (value) => context.emit('update:modelValue', value),
    });
    const name = ref(null);
    const nameRef = ref(null);
    const loading = ref(false);
    return {
      isOpen,
      name,
      nameRef,
      loading,
      nameRules: [(val) => (val && val.trim() && val.length > 0) || 'Назовите вашу подборку'],
      async onSubmit() {
        const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        const isValidate = nameRef.value.validate();

        if (isValidate) {
          loading.value = true;
          await store.dispatch('compilations/createCompilation', name.value.trim());
          name.value = '';
          isOpen.value = false;
          loading.value = false;
        }
      },
    };
  },
};
</script>

<style scoped></style>
