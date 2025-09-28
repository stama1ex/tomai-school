import { CrudTable } from '@/components/shared/crud-table';

export default function Staffing() {
  return (
    <CrudTable
      apiPath="/api/staffing"
      title="Кадровый состав"
      primaryLabel="full_name"
      secondaryLabel="position"
      primaryLabelDisplay="ФИО"
      secondaryLabelDisplay="Должность"
    />
  );
}
