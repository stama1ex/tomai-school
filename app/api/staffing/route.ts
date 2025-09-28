import { createCrudHandlers } from '../universalCrud';

const { GET, POST, PUT, DELETE } = createCrudHandlers('staffing');

export { GET, POST, PUT, DELETE };
