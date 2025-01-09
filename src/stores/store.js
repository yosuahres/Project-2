import { defineStore } from "pinia";

export const useMesinStore = defineStore("alerts", {
  id: "store",
  state: () => {
    return {
      // all these properties will have their type inferred automatically
      utils: {
        status: "false",
      },
    };
  },
  actions: {
    // since we rely on `this`, we cannot use an arrow function
    resetUtils() {
      this.utils = {
        status: "false",
      }
    },
  },
});