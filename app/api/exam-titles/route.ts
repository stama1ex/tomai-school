// app/api/exam-titles/route.ts
import { createCrudHandlers } from '../universalCrud';

const { GET, POST, PUT, DELETE } = createCrudHandlers('exam_titles');

export { GET, POST, PUT, DELETE };
