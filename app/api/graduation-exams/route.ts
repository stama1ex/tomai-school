import { createCrudHandlers } from '../universalCrud';

const { GET, POST, PUT, DELETE } = createCrudHandlers('graduation_exams');
export { GET, POST, PUT, DELETE };
