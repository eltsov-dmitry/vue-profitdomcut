import {
  deleteOffers,
  deleteOffersItem,
  getOffers,
  postOffers,
  postOffersItem,
  putOffers,
  putOffersItem,
  getCompilationURL,
} from 'services/compilation';
import {
  bxDepartmentGet,
  bxPlacementInfo,
  bxDealGet,
  bxUserSearch,
  bxLiveFeedMessage,
} from 'services/bx';
import _, { isArray, isEmpty } from 'lodash';
import { Promise } from 'core-js';
import { getFlatDescription } from 'services/api';

export default {
  namespaced: true,
  state: () => ({
    deal: {},

    compilationsAll: [],
    compilationsDeal: [],
    compilationsManager: [],
    compilationsDepartment: [],

    paginatorAllCurrent: 1,
    paginatorAllTotal: 0,
    paginatorDealCurrent: 1,
    paginatorDealTotal: 0,
    paginatorManagerCurrent: 1,
    paginatorManagerTotal: 0,
    paginatorDepartmentCurrent: 1,
    paginatorDepartmentTotal: 0,

    sortManager: { createAt: 'desc' },
    sortDeal: { createAt: 'desc' },
    sortAll: { manager: 'asc', createAt: 'asc' },
    sortDepartment: { manager: 'asc', createAt: 'asc' },

    loaderManager: false,
    loaderDeal: false,
    loaderAll: false,
    loaderDepartment: false,
    editingMode: false,

    department: {},
    departmentUsers: [],

    compilationCurrent: {},
    compilationEditing: {},

    errorState: false,
    errorMessage: '',

    flatDetailState: false,
    flatDetail: {},

    userPosition: null,

    superAdmins: [266, 360],
  }),
  mutations: {
    SET_DEAL(state, data) {
      state.deal = data;
    },
    SET_COMPILATION_CURRENT(state, data) {
      state.compilationCurrent = data;
    },
    SET_COMPILATION_EDITING(state, data) {
      state.compilationEditing = data;
    },
    SET_DEPARTMENT_USERS(state, data) {
      state.departmentUsers = data;
    },
    SET_DEPARTMENT(state, data) {
      state.department = data;
    },
    SET_USER_POSITION(state, data) {
      state.userPosition = data;
    },
    SET_EDITING_MODE(state, data) {
      state.editingMode = data;
    },
    SET_COMPILATION_CURRENT_STATUS(state, data) {
      state.compilationCurrent.status = data;
    },

    SET_ERROR_STATE(state, data) {
      state.errorState = data;
    },
    SET_ERROR_MESSAGE(state, data) {
      state.errorMessage = data;
    },

    SET_COMPILATION_ITEM(state, data) {
      state.compilationCurrent.items.push(data);
    },
    DEL_COMPILATION_ITEM(state, data) {
      state.compilationCurrent.items = state.compilationCurrent.items.filter(
        (item) => item.cid !== data,
      );
    },

    DELETE_COMPILATION(state, data) {
      const deleteItem = (compilations) => compilations.filter((compilation) => compilation.id !== data.id);
      state.compilationsAll = deleteItem(state.compilationsAll);
      state.compilationsDeal = deleteItem(state.compilationsDeal);
      state.compilationsManager = deleteItem(state.compilationsManager);
      state.compilationsDepartment = deleteItem(state.compilationsDepartment);

      if (state.compilationCurrent.id === data.id) {
        state.compilationCurrent = {};
      }
      if (state.compilationEditing.id === data.id) {
        state.compilationEditing = {};
      }
    },

    SET_COMPILATIONS_ALL(state, data) {
      state.compilationsAll = data;
    },
    SET_COMPILATIONS_DEAL(state, data) {
      state.compilationsDeal = data;
    },
    SET_COMPILATIONS_MANAGER(state, data) {
      state.compilationsManager = data;
    },
    SET_COMPILATIONS_DEPARTMENT(state, data) {
      state.compilationsDepartment = data;
    },

    SET_PAGINATOR_ALL_CURRENT(state, data) {
      state.paginatorAllCurrent = data;
    },
    SET_PAGINATOR_ALL_TOTAL(state, data) {
      state.paginatorAllTotal = data;
    },
    SET_PAGINATOR_DEAL_CURRENT(state, data) {
      state.paginatorDealCurrent = data;
    },
    SET_PAGINATOR_DEAL_TOTAL(state, data) {
      state.paginatorDealTotal = data;
    },
    SET_PAGINATOR_MANAGER_CURRENT(state, data) {
      state.paginatorManagerCurrent = data;
    },
    SET_PAGINATOR_MANAGER_TOTAL(state, data) {
      state.paginatorManagerTotal = data;
    },
    SET_PAGINATOR_DEPARTMENT_CURRENT(state, data) {
      state.paginatorDepartmentCurrent = data;
    },
    SET_PAGINATOR_DEPARTMENT_TOTAL(state, data) {
      state.paginatorDepartmentTotal = data;
    },

    SET_SORT_MANAGER(state, data) {
      state.sortManager = data;
    },
    SET_SORT_DEAL(state, data) {
      state.sortDeal = data;
    },
    SET_SORT_ALL(state, data) {
      state.sortAll = data;
    },
    SET_SORT_DEPARTMENT(state, data) {
      state.sortDepartment = data;
    },

    SET_LOADER_MANAGER(state, status) {
      state.loaderManager = status;
    },
    SET_LOADER_DEAL(state, status) {
      state.loaderDeal = status;
    },
    SET_LOADER_ALL(state, status) {
      state.loaderAll = status;
    },
    SET_LOADER_DEPARTMENT(state, status) {
      state.loaderDepartment = status;
    },

    SET_FLAT_DETAIL_STATE(state, data) {
      state.flatDetailState = data;
    },
    SET_FLAT_DETAIL(state, data) {
      state.flatDetail = data;
    },
    SET_FLAT_DESCRIPTION(state, data) {
      state.flatDetail.description = data;
    },
  },
  getters: {
    // isSuperAdmin(state) {
    //   return (user) => state.superAdmins.includes(Number(user.ID));
    // },
    getSuperAdmins(state) {
      return state.superAdmins;
    },
    getDeal(state) {
      return state.deal;
    },
    getCompilationCurrent(state) {
      return state.compilationCurrent;
    },
    getCompilationEditing(state) {
      return state.compilationEditing;
    },
    getDepartmentUsers(state) {
      return state.departmentUsers;
    },
    getDepartment(state) {
      return state.department;
    },
    getUser(state, context, root) {
      return root.user;
    },
    getUserPosition(state) {
      return state.userPosition;
    },
    isEditingMode(state) {
      return state.editingMode;
    },
    isEditingCompilation(state, context, root) {
      const { user } = root;
      const current = state.compilationCurrent;
      return user && current && Number(user.ID) === current.b24_manager_id;
    },
    isCreateCompilation(state, context, root) {
      const userId = root.user && root.user.ID;
      const assignedId = state.deal.ASSIGNED_BY_ID;

      return userId && assignedId && userId === assignedId;
    },

    getCompilationsAll(state) {
      return state.compilationsAll;
    },
    getCompilationsDeal(state) {
      return state.compilationsDeal;
    },
    getCompilationsManager(state) {
      return state.compilationsManager;
    },
    getCompilationsDepartment(state) {
      return state.compilationsDepartment;
    },

    getPaginatorAllCurrent(state) {
      return state.paginatorAllCurrent;
    },
    getPaginatorAllTotal(state) {
      return state.paginatorAllTotal;
    },
    getPaginatorDealCurrent(state) {
      return state.paginatorDealCurrent;
    },
    getPaginatorDealTotal(state) {
      return state.paginatorDealTotal;
    },
    getPaginatorManagerCurrent(state) {
      return state.paginatorManagerCurrent;
    },
    getPaginatorManagerTotal(state) {
      return state.paginatorManagerTotal;
    },
    getPaginatorDepartmentCurrent(state) {
      return state.paginatorDepartmentCurrent;
    },
    getPaginatorDepartmentTotal(state) {
      return state.paginatorDepartmentTotal;
    },

    getSortManager(state) {
      return state.sortManager;
    },
    getSortDeal(state) {
      return state.sortDeal;
    },
    getSortAll(state) {
      return state.sortAll;
    },
    getSortDepartment(state) {
      return state.sortDepartment;
    },

    getLoaderManager(state) {
      return state.loaderManager;
    },
    getLoaderDeal(state) {
      return state.loaderDeal;
    },
    getLoaderAll(state) {
      return state.loaderAll;
    },
    getLoaderDepartment(state) {
      return state.loaderDepartment;
    },

    getErrorState(state) {
      return state.errorState;
    },
    getErrorMessage(state) {
      return state.errorMessage;
    },

    getFlatDetailState(state) {
      return state.flatDetailState;
    },
    getFlatDetail(state) {
      return state.flatDetail;
    },
  },
  actions: {
    isSuperAdmin({ getters }, userId) {
      return getters.getSuperAdmins.includes(userId);
    },
    async updateDeal({ commit }) {
      const placement = await bxPlacementInfo();
      const dealId = placement.options.ID;
      let deal = {};

      if (dealId) {
        deal = await bxDealGet(dealId);
        commit('SET_DEAL', deal);
      }

      return deal;
    },
    async findDepartment({ commit }, departmentId) {
      const [department] = await bxDepartmentGet({ ID: departmentId });
      commit('SET_DEPARTMENT', department);
      return department;
    },
    findSubDepartments({}, departments) {
      return new Promise((resolve) => {
        const getDepartment = () => {
          const departmentsClone = _.clone(departments);
          const promises = Object.values(departments).map((department) => bxDepartmentGet({ PARENT: department.ID }).then((departmentsData) => {
            departmentsData.forEach((dataItem) => (departments[dataItem.ID] = dataItem));
          }));
          Promise.all(promises).then(() => {
            if (Object.values(departments).length !== Object.values(departmentsClone).length) {
              getDepartment();
            } else {
              resolve(Object.values(departments));
            }
          });
        };
        getDepartment();
      });
    },
    async findDepartmentUsers({ dispatch, getters, commit }) {
      const departmentCurrent = getters.getDepartment;
      const departments = await dispatch('findSubDepartments', {
        [departmentCurrent.ID]: departmentCurrent,
      });
      const promises = departments.map((department) => bxUserSearch({ UF_DEPARTMENT_NAME: department.NAME, ACTIVE: true }).then((data) => data));
      const users = (await Promise.all(promises)).reduce((result, usersDepartment) => {
        usersDepartment.forEach((item) => (result[item.ID] = item));
        return result;
      }, {});

      const departmentUsers = Object.values(users).map((user) => Number(user.ID));
      commit('SET_DEPARTMENT_USERS', departmentUsers);

      return departmentUsers;
    },

    async updateCompilationsAll({ commit, getters }, params) {
      const page = (params && params.page) ?? getters.getPaginatorAllCurrent;
      const sort = (params && params.sort) ?? getters.getSortAll;

      if (page) commit('SET_PAGINATOR_ALL_CURRENT', page);

      commit('SET_SORT_ALL', sort);
      commit('SET_LOADER_ALL', true);

      const offersAll = (await getOffers({ page, sort })).data;

      commit('SET_COMPILATIONS_ALL', offersAll.payload);
      commit('SET_PAGINATOR_ALL_CURRENT', offersAll.meta.page);
      commit('SET_PAGINATOR_ALL_TOTAL', offersAll.meta.totalPages);
      commit('SET_LOADER_ALL', false);
    },
    async updateCompilationsDeal({ commit, getters }, params) {
      const page = (params && params.page) ?? getters.getPaginatorDealCurrent;
      const sort = (params && params.sort) ?? getters.getSortDeal;

      if (page) commit('SET_PAGINATOR_DEAL_CURRENT', page);

      commit('SET_SORT_DEAL', sort);
      commit('SET_LOADER_DEAL', true);

      const deal = getters.getDeal;

      const offersDeal = await getOffers({
        filter: { b24_deal_id: deal.ID },
        page,
        sort,
      });

      if (offersDeal.request.status === 200) {
        commit('SET_COMPILATIONS_DEAL', offersDeal.data.payload);
        commit('SET_PAGINATOR_DEAL_CURRENT', offersDeal.data.meta.page);
        commit('SET_PAGINATOR_DEAL_TOTAL', offersDeal.data.meta.totalPages);
      } else {
        commit('SET_COMPILATIONS_DEAL', []);
      }

      commit('SET_LOADER_DEAL', false);
    },
    async updateCompilationsManager({ commit, rootGetters, getters }, params) {
      const page = (params && params.page) ?? getters.getPaginatorManagerCurrent;
      const sort = (params && params.sort) ?? getters.getSortManager;

      if (page) commit('SET_PAGINATOR_MANAGER_CURRENT', page);

      commit('SET_SORT_MANAGER', sort);
      commit('SET_LOADER_MANAGER', true);

      const currentUser = rootGetters.getUserCurrent;

      // Real DATA =========================
      const userId = Number(currentUser.ID);

      // // Fake DATA =========================
      // const userId = 266;

      const offersManager = (
        await getOffers({
          filter: { b24_manager_id: userId },
          page,
          sort,
        })
      ).data;

      if (offersManager) {
        commit('SET_COMPILATIONS_MANAGER', offersManager.payload);
        commit('SET_PAGINATOR_MANAGER_CURRENT', offersManager.meta.page);
        commit('SET_PAGINATOR_MANAGER_TOTAL', offersManager.meta.totalPages);
      }
      commit('SET_LOADER_MANAGER', false);
    },
    async updateCompilationsDepartment({ commit, getters, dispatch }, params) {
      const page = (params && params.page) ?? getters.getPaginatorDepartmentCurrent;
      const sort = (params && params.sort) ?? getters.getSortDepartment;

      if (page) commit('SET_PAGINATOR_DEPARTMENT_CURRENT', page);

      commit('SET_SORT_DEPARTMENT', sort);
      commit('SET_LOADER_DEPARTMENT', true);

      const users = getters.getDepartmentUsers.length
        ? getters.getDepartmentUsers
        : await dispatch('findDepartmentUsers');

      const offersDepartment = (
        await getOffers({
          filter: { b24_manager_id: users },
          page,
          sort,
        })
      ).data;

      commit('SET_COMPILATIONS_DEPARTMENT', offersDepartment.payload);
      commit('SET_PAGINATOR_DEPARTMENT_CURRENT', offersDepartment.meta.page);
      commit('SET_PAGINATOR_DEPARTMENT_TOTAL', offersDepartment.meta.totalPages);
      commit('SET_LOADER_DEPARTMENT', false);
    },

    async updateCompilations({ rootGetters, dispatch, commit }) {
      const currentUser = rootGetters.getUserCurrent;

      // Real DATA =========================
      const userId = Number(currentUser.ID);
      const departmentId = Number(
        isArray(currentUser.UF_DEPARTMENT)
          ? currentUser.UF_DEPARTMENT[0]
          : currentUser.UF_DEPARTMENT,
      );

      // // Fake DATA =========================
      // const userId = 29;
      // const departmentId = 82;

      const department = await dispatch('findDepartment', departmentId);
      const deal = await dispatch('updateDeal');

      const isSuperAdmin = await dispatch('isSuperAdmin', userId);
      const isDepartmentHead = Number(department.UF_HEAD) === userId;

      // Set compilations deal
      if (!isEmpty(deal)) {
        dispatch('updateCompilationsDeal');
      }

      // Set compilations manager
      dispatch('updateCompilationsManager');

      if (isSuperAdmin) {
        dispatch('updateCompilationsAll');
        commit('SET_USER_POSITION', 'superAdmin');
      } else if (isDepartmentHead) {
        dispatch('updateCompilationsDepartment');
        commit('SET_USER_POSITION', 'departmentHead');
      } else {
        commit('SET_USER_POSITION', 'manager');
      }
    },
    async updateEditingCompilation({ getters, commit }) {
      let compilationDefine = getters.getCompilationEditing;

      if (isEmpty(compilationDefine)) {
        const deal = getters.getDeal;
        const request = await getOffers({
          // TODO = param: deal.ID,
          // TODO = param: 34532,
          filter: { b24_deal_id: deal.ID, status: "'Новая'" },
        });
        const [compilation] = request.data ? request.data.payload : [{}];
        commit('SET_COMPILATION_EDITING', compilation);
        compilationDefine = compilation;
      }

      commit('SET_COMPILATION_CURRENT', compilationDefine);
      return compilationDefine;
    },
    async createCompilation({ getters, rootGetters, commit }, name) {
      const deal = getters.getDeal;
      const user = rootGetters.getUserCurrent;
      const offer = {
        b24_contact_id: Number(deal.CONTACT_ID),
        b24_deal_id: Number(deal.ID),
        b24_manager_id: Number(deal.ASSIGNED_BY_ID),
        manager: `${user.LAST_NAME} ${user.NAME}`,
        phone: user.PERSONAL_MOBILE || user.PERSONAL_PHONE,
        position: user.WORK_POSITION,
        avatar: user.PERSONAL_PHOTO,
        name,
      };

      const offerRequest = await postOffers(offer);
      const requestStatus = offerRequest.request.status;

      if (requestStatus === 200) {
        commit('SET_COMPILATION_EDITING', offerRequest.data);
        commit('SET_COMPILATION_CURRENT', offerRequest.data);
        commit('SET_EDITING_MODE', true);
      } else if (requestStatus === 409) {
        const { message } = JSON.parse(offerRequest.request.response);
        commit('SET_ERROR_STATE', true);
        commit('SET_ERROR_MESSAGE', message);
      }
    },
    async createCompilationItem({ commit, getters, dispatch }, flat) {
      const compilation = getters.getCompilationEditing;

      const images = flat.files.map((file) => {
        if (file.previews) {
          return {
            image: file.previews.large,
            preview: file.previews.small,
          };
        }
        return {
          image: file.path,
          preview: file.path,
        };
      });
      const { description } = (await getFlatDescription(flat.id)).flat;

      const compilationFlat = {
        offer_id: Number(compilation.id),
        cid: flat.id,
        type: flat.type,
        square: String(flat.square),
        complex: flat.complex,
        house: flat.house,
        article: flat.article_name,
        entrance: flat.entrance,
        price: flat.cost,
        orders_count: flat.orders,
        images,
        description,
      };

      commit('SET_COMPILATION_ITEM', compilationFlat);

      const request = await postOffersItem(compilationFlat);
      compilationFlat.id = request.data.id;
      commit('DEL_COMPILATION_ITEM', compilationFlat.cid);
      commit('SET_COMPILATION_ITEM', compilationFlat);

      // Update compilations manager
      dispatch('updateCompilationsManager');
      // Update compilations deal
      dispatch('updateCompilationsDeal');
    },
    async deleteCompilationItem({ commit, dispatch }, item) {
      commit('DEL_COMPILATION_ITEM', item.cid);
      const request = await deleteOffersItem(item.id);
      if (request.request.status !== 200) {
        commit('SET_COMPILATION_ITEM', item);
      } else {
        // Update compilations manager
        dispatch('updateCompilationsManager');
        // Update compilations deal
        dispatch('updateCompilationsDeal');
      }
    },
    async deleteCompilation({ commit }, offer) {
      commit('DELETE_COMPILATION', offer);
      await deleteOffers(offer.id);
    },
    async putFlat({ getters }) {
      const flat = getters.getFlatDetail;
      const request = await putOffersItem(flat.id, { description: flat.description });
    },
    async putCompilationStatus({ dispatch, commit }, offer) {
      const request = await putOffers(offer.id, {
        status: 'Отправлена клиенту',
      });

      commit('SET_COMPILATION_CURRENT_STATUS', 'Отправлена клиенту');

      await bxLiveFeedMessage(
        offer.b24_deal_id,
        offer.name,
        offer.manager,
        `${getCompilationURL()}/${offer.uid}`,
      );

      // Update compilations manager
      dispatch('updateCompilationsManager');
      // Update compilations deal
      dispatch('updateCompilationsDeal');
    },
  },
};
