import { CrudTable } from '@/components/shared/crud-table';

export default function ClassTeachers() {
  return (
    <CrudTable
      apiPath="/api/class-teachers"
      title="Классные руководители"
      primaryLabel="name"
      secondaryLabel="class_id"
      primaryLabelDisplay="ФИО"
      secondaryLabelDisplay="Класс"
    />
  );
}
