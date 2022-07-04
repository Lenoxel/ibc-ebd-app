export type SelectOptions<T> = {
    placeholder?: string;
    items: T[];
    choosedItem?: T;
    defaultAll?: string;
};
