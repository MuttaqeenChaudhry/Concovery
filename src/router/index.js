import CRTResources from "@/pages/CRTResources.vue";
import KnowYourRisk from "@/pages/KnowYourRisk.vue";
import LocateSupportPage from "@/pages/LocateSupportPage.vue";
import ExercisePage from "@/pages/ExercisePage.vue";
import { createRouter, createWebHistory } from "vue-router";
import Home from "@/pages/Home.vue";
import StagedRecovery from "@/pages/StagedRecovery.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
      meta: { title: "Concovery" },
    },
    {
      path: "/exploredata",
      name: "Know Your Risk",
      component: KnowYourRisk,
      meta: { title: "Know Your Risk" },
    },
    {
      path: "/locatesupport",
      name: "Locate Support",
      component: LocateSupportPage,
      meta: { title: "Nearby Support" },
    },
    {
      path: "/crtresources",
      name: "CRT Resources",
      component: CRTResources,
      meta: { title: "CRT Resources" },
    },
    {
      path: "/iteration3/stagedrecovery",
      name: "Staged Recovery",
      component: StagedRecovery,
      meta: { title: "Staged Recovery" },
    },
    {
      path: "/exercises",
      name: "Exercises",
      component: ExercisePage,
    },
  ],
});

router.beforeEach((to) => {
  document.title = to.meta.title ?? "Concovery";
});

export default router;
