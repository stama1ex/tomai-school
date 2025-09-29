import { createCrudHandlers } from '../universalCrud';

const { GET, POST, PUT, DELETE } = createCrudHandlers('primary_exams');
export { GET, POST, PUT, DELETE };
