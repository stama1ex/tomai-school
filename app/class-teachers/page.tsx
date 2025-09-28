import { CrudTable } from '@/components/shared/crud-table';

export default function ClassTeachersPage() {
  return (
    <CrudTable
      apiPath="/api/class-teachers"
      title="Классные руководители"
      primaryLabel="class_id"
      secondaryLabel="name"
    />
  );
}
