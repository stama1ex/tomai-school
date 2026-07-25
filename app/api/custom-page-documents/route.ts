import { createCrudHandlers } from '../universalCrud';

const { GET, POST, PUT, DELETE } = createCrudHandlers(
  'custom_page_documents',
  'page_id'
);

export { GET, POST, PUT, DELETE };
