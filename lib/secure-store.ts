import * as SecureStore from "expo-secure-store";
export const saveIntoSecureStore = async (key: string, value: unknown) => {
  if (value === undefined || value === null) {
    await SecureStore.deleteItemAsync(key);
    return;
  }
  const stringifyValue = JSON.stringify(value);
  await SecureStore.setItemAsync(key, stringifyValue);
};

export const getSecureStoreValueFor = async <T = unknown | null>(
  key: string,
): Promise<T> => {
  const exist = await SecureStore.getItemAsync(key);
  if (exist) return JSON.parse(exist);
  return exist as T;
};
