import BrainAwareness from "@/components/custom-components/brainAwareness.vue";
import CRTResources from "@/pages/CRTResources.vue";
import KnowYourRisk from "@/pages/KnowYourRisk.vue";
import LocateSupportPage from "@/pages/LocateSupportPage.vue";
import RTPRule from "@/pages/RTPRule.vue";
import StagedRecovery2 from "@/pages/StagedRecovery2.vue";
import ExercisePage from "@/pages/ExercisePage.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: BrainAwareness,
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
      path: "/rtprule",
      name: "21-Day Rule",
      component: RTPRule,
      meta: { title: "21-Day Rule" },
    },
    {
      path: "/iteration3/stagedrecovery",
      name: "Staged Recovery",
      component: StagedRecovery2,
      meta: { title: "Staged Recovery" },
    },
    {
      path: "/exercises",
      name: "Exercises",
      component: ExercisePage,
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
