import { createCrudHandlers } from '../universalCrud';

const { GET, POST, PUT, DELETE } = createCrudHandlers('class_teachers');

export { GET, POST, PUT, DELETE };
