import { createCrudHandlers } from '../universalCrud';

const { GET, POST, PUT, DELETE } = createCrudHandlers('call_schedule');
export { GET, POST, PUT, DELETE };
