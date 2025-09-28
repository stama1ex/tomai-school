import { createCrudHandlers } from '../universalCrud';

const { GET, POST, PUT, DELETE } = createCrudHandlers('lessons_schedule');

export { GET, POST, PUT, DELETE };
