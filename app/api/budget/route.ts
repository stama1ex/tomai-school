import { createCrudHandlers } from '../universalCrud';

const { GET, POST, PUT, DELETE } = createCrudHandlers('budget');

export { GET, POST, PUT, DELETE };
