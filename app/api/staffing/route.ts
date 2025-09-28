/* eslint-disable @typescript-eslint/no-explicit-any */
import { createCrudHandlers } from '../universalCrud';

const { GET, POST, PUT, DELETE } = createCrudHandlers('staffing');

export { GET, POST, PUT, DELETE };
