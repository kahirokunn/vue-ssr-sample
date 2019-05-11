import { createApp } from "./appCreator";

const { app, router } = createApp();

router.onReady(() => app.$mount("#app"));
