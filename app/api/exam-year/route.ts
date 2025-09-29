import { createCrudHandlers } from '../universalCrud';

const { GET, POST, PUT, DELETE } = createCrudHandlers('exam_year');

export { GET, POST, PUT, DELETE };
