import * as uuid from "uniqid";

interface ISetArgs {
  key: string | number;
  value: any;
  ttl?: number | null;
}
interface ICreateTTLArgs {
  key: string | number;
  id: string;
  ttl: number;
}
interface IUpdateArgs {
  key: string | number;
  value?: any;
  ttl?: number | null;
}
type Value = {
  id: string;
  data: any;
  ttl: null | number;
  created: number; // new Date()
  updated: number | null;
};

const InMemoryStore = () => {
  const store: Record<string | number, any> = {};
  const timerStore: Record<string, NodeJS.Timeout> = {};

  const createTTL = ({ key, id, ttl }: ICreateTTLArgs) => {
    const timer = setTimeout(() => {
      delete store[key];
      delete timerStore[id];
    }, ttl);
    timerStore[id] = timer;
  };

  const set = ({ key, value, ttl }: ISetArgs) => {
    const id = uuid();

    store[key] = {
      id,
      data: value,
      ttl,
      created: new Date().getTime(),
      updated: null,
    };
    if (ttl) createTTL({ key, id, ttl });

    return store[key];
  };

  const remove = (key: string | number) => {
    const itemToBeDeleted = store[key];
    const { id } = itemToBeDeleted;
    const timer = timerStore[id];
    clearTimeout(timer);
    delete store[key];
    delete timerStore[id];
    return itemToBeDeleted;
  };

  const update = ({ key, value, ttl }: IUpdateArgs) => {
    if (!ttl || !value) return;

    const itemToBeUpdated = store[key];
    itemToBeUpdated.updated = new Date().getTime();
    itemToBeUpdated.data = value;

    if (ttl) {
      const { id } = itemToBeUpdated;
      const timer = timerStore[id];
      clearTimeout(timer);
      createTTL({ key, id, ttl });
      itemToBeUpdated.ttl = ttl;
    }

    return store[key];
  };

  const get = (key: string | number) => {
    return store[key];
  };

  return {
    set,
    remove,
    update,
    get,
  };
};

export default InMemoryStore;
