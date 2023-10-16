export type SelectOptions<T> = {
  placeholder?: string;
  items: T[];
  chosenItem?: T;
  defaultAll?: string;
};
