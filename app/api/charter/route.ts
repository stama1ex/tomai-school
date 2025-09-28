import { createCrudHandlers } from '../universalCrud';

const { GET, POST, PUT, DELETE } = createCrudHandlers('charter');

export { GET, POST, PUT, DELETE };
