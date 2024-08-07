import { ProjectSchedule } from '@/components/schedules/ProjectSchedule';
import { useGetEmployeesQuery } from '@/services';
import { Flex, Select, Tabs, TabsProps, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { Employee } from 'wms-types';

export const ScheduleManagement = () => {
  const {
    data: responseEmployees,
    isLoading,
    refetch,
  } = useGetEmployeesQuery();
  const [current, setCurrent] = useState<string | null>(null);

  const [tabs, setTabs] = useState<TabsProps['items']>([
    {
      key: '1',
      label: 'Chấm công',
      children: <ProjectSchedule employeeId={null} isAdmin />,
    },
  ]);
  const [employees, setEmployees] = useState<Partial<Employee>[]>([]);

  useEffect(() => {
    if (responseEmployees != undefined && responseEmployees.data) {
      const employees = responseEmployees.data;
      setEmployees([...employees]);
    }
  }, [responseEmployees]);

  return (
    <>
      <Flex className='flex-col'>
        <Select
          showSearch
          placeholder='Chọn nhân viên'
          className='w-1/3 block mb-5'
          filterOption={(input, option) => {
            return (
              (option?.name ?? '')
                .toLowerCase()
                .includes(input.toLowerCase()) ||
              (option?.code ?? '')
                .toUpperCase()
                .includes(input.toUpperCase()) ||
              (option?.email ?? '').toLowerCase().includes(input.toLowerCase())
            );
          }}
          onChange={(value) => {
            setCurrent(value);
          }}
          options={employees.map((employee) => {
            return {
              value: employee.id,
              code: employee.code,
              email: employee.email,
              name: employee.fullname,
              label: `[${employee.code}] - ${employee.fullname} - ${employee.email}`,
            };
          })}
          defaultActiveFirstOption={true}
        />
        <>{current && <ProjectSchedule employeeId={current} isAdmin />}</>
      </Flex>
    </>
  );
};
