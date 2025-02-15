import InMemoryStore from "./hackkey";

(async () => {
  const store = InMemoryStore();

  const item1 = store.set({ key: "nottl", value: "Hello this is my first" });
  const item2 = store.set({ key: "ttl", value: "Hi from the sky", ttl: 1000 });

  console.log(item1);
  console.log(item2);

  await new Promise((resolve) =>
    setTimeout(() => {
      console.log("item 1 exist", !!store.get("nottl"));
      console.log("item 2 does not exist", !store.get("ttl"));
      return resolve(true);
    }, 1200)
  );

  const item3 = store.set({
    key: "todelete",
    value: "This content will be deleted in future",
    ttl: 2000,
  });

  console.log(store.get("nottl"));
  store.update({
    key: "nottl",
    value: { msg: "Hi like Sky" },
    ttl: 3000,
  });
  console.log(store.get("todelete"));
  console.log(store.remove("todelete"));
  console.log("item 3 does not exist", !store.get("todelete"));

  console.log(store.get("nottl"));
})();
