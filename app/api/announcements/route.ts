import { createCrudHandlers } from '../universalCrud';

const { GET, POST, PUT, DELETE } = createCrudHandlers('announcements');

export { GET, POST, PUT, DELETE };
