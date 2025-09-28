import { CrudTable } from '@/components/shared/crud-table';

export default function StaffingPage() {
  return (
    <CrudTable
      apiPath="/api/staffing"
      title="Кадровый состав"
      primaryLabel="position"
      secondaryLabel="full_name"
    />
  );
}
