/* eslint-disable */
import { login, logout, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import {
  resetRouter,
  allAsyncRoutes,
  anyRoute,
  constantRoutes,
} from "@/router";
import router from "@/router";

const getDefaultState = () => {
  return {
    token: getToken(),
    name: "",
    avatar: "",
    roles: [],
    buttons: [],
    asyncRoutes: [],
    routes: [],
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_USERINFO(state, userInfo) {
    state.name = userInfo.name;
    state.avatar = userInfo.avatar;
    state.buttons = userInfo.buttons;
    state.roles = userInfo.roles;
  },
  SET_ROUTES(state, asyncRoutes) {
    state.asyncRoutes = asyncRoutes;
    state.routes = constantRoutes.concat(asyncRoutes, anyRoute);
    // 动态添加路由，参数是数组
    router.addRoutes([...asyncRoutes, anyRoute]);
  },
};
function filterAsyncRouters(allAsyncRoutes, routeNames) {
  let asyncRoutes = allAsyncRoutes.filter((item) => {
    if (routeNames.indexOf(item.name) !== -1) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRouters(item.children, routeNames);
      }
      return true;
    }
  });
  return asyncRoutes;
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then((response) => {
          const { data } = response;
          commit("SET_TOKEN", data.token);
          setToken(data.token);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then((response) => {
          const { data } = response;

          if (!data) {
            return reject("Verification failed, please Login again.");
          }

          // const { name, avatar } = data

          commit("SET_USERINFO", data);
          // 处理路由字符串

          commit("SET_ROUTES", filterAsyncRouters(allAsyncRoutes, data.routes));
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          removeToken(); // must remove  token  first
          resetRouter();
          commit("RESET_STATE");
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken(); // must remove  token  first
      commit("RESET_STATE");
      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
