export const sum = (a, b) => {
    return a + b;
};

export const deleteUserById = (array = [], id = '') => {
    return array.filter((user) => user.id !== id);
};

export const findUserById = (array = [], id = '') => {
    return array.find((obj) => obj.id === id);
};
