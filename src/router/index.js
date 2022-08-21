import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/home/actor-list",
  },
  {
    path: "/home",
    component: () => import("../views/HomeView.vue"),
    children: [
      {
        path: "actor-list",
        component: () => import("../views/actor/ActorList.vue"),
      },
      {
        path: "actor-add",
        component: () => import("../views/actor/ActorAdd.vue"),
      },
      {
        path: "director-list",
        component: () => import("../views/director/DirectorList.vue"),
      },
      {
        path: "director-add",
        component: () => import("../views/director/DirectorAdd.vue"),
      },
      {
        path: "movie-list",
        component: () => import("../views/movie/MovieList.vue"),
      },
      {
        path: "movie-add",
        component: () => import("../views/movie/MovieAdd.vue"),
      },
      {
        path: "movie-update/:id",
        component: () => import("../views/movie/MovieUpdate.vue"),
      },
      {
        path: "thumb-list/:movie_id",
        component: () => import("../views/thumb/ThumbList.vue"),
      },
      {
        path: "cinema-add",
        component: () => import("../views/cinema/CinemaAdd.vue"),
      },
      {
        path: "cinema-list",
        component: () => import("../views/cinema/CinemaList.vue"),
      },
      {
        path: "cinema-update/:id",
        component: () => import("../views/cinema/CinemaUpdate.vue"),
      },
      {
        path: "cinema-room-list/:id",
        component: () => import("../views/cinema/CinemaRoomList.vue"),
      },
      {
        path: "cinema-room-seat-template/:id",
        component: () => import("../views/cinema/CinemaRoomSeat.vue"),
      },
      {
        path: "cinema-room-showingon-plan/:id",
        component: () => import("../views/showingon/ShowIngonAdd.vue"),
      },
      {
        path: "showingon-plan/list/:id",
        component: () => import("../views/showingon/ShowingonPlanList.vue"),
      },
    ],
  },

  {
    path: "/user/login",
    component: () => import("../views/user/Login.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
