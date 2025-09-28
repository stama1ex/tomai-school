import { createCrudHandlers } from '../universalCrud';

const { GET, POST, PUT, DELETE } = createCrudHandlers('plans');

export { GET, POST, PUT, DELETE };
