import { store } from 'quasar/wrappers';
import { createStore } from 'vuex';

import { bxGetScrollSize, bxIsAdmin, bxUserCurrent } from 'services/bx';

import { getDepartmentsAccess } from 'services/api';
import compilations from './compilations';

export default store((/* { ssrContext } */) => {
  const Store = createStore({
    modules: {
      compilations,
    },

    state() {
      return {
        loaded: false,
        admin: false,
        sized: false,
        user: null,
        frameSizes: {
          width: 0,
          height: 0,
        },
      };
    },
    mutations: {
      setLoaded(state, status) {
        state.loaded = status;
      },
      SET_ADMIN(state, status) {
        state.admin = status;
      },
      SET_SIZED(state, status) {
        state.sized = status;
      },
      SET_USER(state, user) {
        state.user = user;
      },
      SET_FRAME_SIZES(state, data) {
        state.frameSizes = data;
      },
    },
    getters: {
      isLoaded(state) {
        return state.loaded;
      },
      isAdmin(state) {
        return state.admin;
      },
      isSized(state) {
        return state.sized;
      },
      getUserCurrent(state) {
        return state.user;
      },
      getFrameSizes(state) {
        console.log(state.frameSizes);
        return state.frameSizes;
      },
    },
    actions: {
      admin({ commit }) {
        return bxIsAdmin().then((status) => {
          commit('SET_ADMIN', status);
          return status;
        });
      },
      size({ commit, dispatch }, status) {
        console.log('size', status);
        commit('SET_SIZED', status);
        if (status) {
          dispatch('updateFrameSizes');
        }
      },
      async updateUserCurrent({ state, commit, dispatch }) {
        const userCurrent = await bxUserCurrent();
        const department = userCurrent.UF_DEPARTMENT;
        const departmentAccess = await getDepartmentsAccess();
        let isAccess = false;

        // Check Department
        if (Array.isArray(department)) {
          if (departmentAccess.find((element) => department.includes(element))) isAccess = true;
        } else if (departmentAccess.includes(department)) {
          isAccess = true;
        }

        // Check Admin
        if (state.admin) isAccess = true;

        commit('SET_USER', userCurrent);
        if (isAccess) {
          dispatch('board/updateClientModeAccess', true, { root: true });
          dispatch('board/updateClientMode', false, { root: true });
        }
      },
      async updateFrameSizes({ commit }) {
        const frame = await bxGetScrollSize();
        commit('SET_FRAME_SIZES', {
          width: frame.scrollWidth,
          height: frame.scrollHeight,
        });
      },
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING,
  });

  return Store;
});
