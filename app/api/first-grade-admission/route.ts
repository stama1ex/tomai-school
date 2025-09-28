import { createCrudHandlers } from '../universalCrud';

const { GET, POST, PUT, DELETE } = createCrudHandlers('first_grade_admission');

export { GET, POST, PUT, DELETE };
