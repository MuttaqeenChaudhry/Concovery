import BrainAwareness from "@/components/custom-components/brainAwareness.vue";
import ConcussionVisulization from "@/components/custom-components/ConcussionVisulization.vue";
import ConcussionDataExplorer from "@/pages/ConcussionDataExplorer.vue";
import CRTResources from "@/pages/CRTResources.vue";
import KnowYourRisk from "@/pages/KnowYourRisk.vue";
import LocateSupportPage from "@/pages/LocateSupportPage.vue";
import RTPRule from "@/pages/RTPRule.vue";
import StagedRecovery2 from "@/pages/StagedRecovery2.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "Home", component: BrainAwareness, meta: { title: "Concovery" } },
    {
      path: "/exploredata",
      name: "Explore Data",
      component: KnowYourRisk,
      meta: { title: "Explore Data" },
    },
    {
      path: "/locatesupport",
      name: "Locate Support",
      component: LocateSupportPage,
      meta: {
        title: "Nearby Support",
      },
    },
    {
      path: "/crtresources",
      name: "CRT Resources",
      component: CRTResources,
      meta: {
        title: "CRT Resources",
      },
    },
    {
      path: "/rtprule",
      name: "21-Day Rule",
      component: RTPRule,
      meta: {
        title: "21-Day Rule",
      },
    },
    {
      path: "/iteration3/stagedrecovery",
      name: "Staged Recovery",
      component: StagedRecovery2,
      meta: {
        title: "Staged Recoverys",
      },
    },
  ],
});

router.beforeEach((to, from) => {
  document.title = to.meta.title;
});

export default router;
