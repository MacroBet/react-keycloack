class Storage {
  async save(key, data) {
    return localStorage.setItem(key, JSON.stringify(data));
  }

  async load(key, defaultValue = undefined) {
    const data = await localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  }

  async remove(key) {
    return localStorage.removeItem(key);
  }

  async purgeAllData() {
    return localStorage.clear();
  }
}

export default new Storage();
