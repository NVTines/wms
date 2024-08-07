import { useGetProjectsQuery, useGetTimeEntriesQuery } from '@/services';
import { Card, Flex } from 'antd';
import { useEffect, useState } from 'react';
import { TypeProject } from 'wms-types';

export const CardManager = () => {
  const { data: response } = useGetProjectsQuery();
  const { data: responseTimeEntry } = useGetTimeEntriesQuery();
  const [IdEmployee, setIdEmployee] = useState<string>('');
  const [totalProject, setTotalProject] = useState<string>('0');
  const [totalTimeEntry, setTotalTimeEntry] = useState<string>('0');
  const [employees, setEmployees] = useState<string>('0');
  const [LeaveDayused, setLeaveDayused] = useState<string>('0');
  useEffect(() => {
    if (response?.data) {
      const projects: any =
        response?.data.filter((x) => x.type == TypeProject.PROJECT) || [];
      setTotalProject(projects.length.toString());
      const totalTimeEntry: any = responseTimeEntry?.data?.reduce(
        (acc: any, time: any) => {

          if (time.project.type == TypeProject.PROJECT){ 

            acc += time.hours +time.overtime};
          return acc;
        },
        0,
      );
      setTotalTimeEntry(totalTimeEntry?.toString() || '0');
    }
    const employees: any = responseTimeEntry?.data?.reduce(
      (acc: any, employee: any) => {
        if (
          !acc.includes(employee.employeeId) &&
          new Date(employee.date.toString()).getFullYear() ===
            new Date().getFullYear()
        ) {
          acc.push(employee.employeeId);
        }
        return acc;
      },
      [],
    );
    const leaves: any =
      responseTimeEntry?.data?.filter(
        (x) =>
          x.project.type == TypeProject.LEAVE &&
          new Date(x.date.toString()).getFullYear() ===
            new Date().getFullYear(),
      ) || [];

    const totalLeaveDay: any = leaves.reduce((acc: any, time: any) => {
      if (
        new Date(time.date.toString()).getFullYear() ===
        new Date().getFullYear()
      )
        acc += time.hours;
      return acc;
    }, 0);
    setLeaveDayused(parseFloat((totalLeaveDay / 8).toFixed(1)).toString());

    setEmployees(employees?.length?.toString() || '0');
  }, [response]);

  return (
    <>
      <Flex justify={'flex-start'} align={'center'} style={{ gap: '16px' }}>
        <Card
          title='Tổng Dự án hiện tại'
          bordered={false}
          style={{ width: '23%' }}
        >
          <Flex justify={'center'} align={'center'} className='w-full h-20'>
            <span className='text-4xl'>{totalProject}</span>
            <span className='ml-1 mt-4'> /dự án</span>
          </Flex>
        </Card>
        <Card title='Tổng giờ công ' bordered={false} style={{ width: '23%' }}>
          <Flex justify={'center'} align={'center'} className='w-full h-20'>
            <span className='text-4xl'>{totalTimeEntry}</span>
            <span className='ml-1 mt-4'> /h</span>
          </Flex>
        </Card>
        <Card
          title='Tổng Nhân viên tham gia'
          bordered={false}
          style={{ width: '23%' }}
        >
          <Flex justify={'center'} align={'center'} className='w-full h-20'>
            <span className='text-4xl'>{employees}</span>
            <span className='ml-1 mt-4'> /người</span>
          </Flex>
        </Card>
        <Card
          title='Tổng ngày nghỉ sử dụng'
          bordered={false}
          style={{ width: '23%' }}
        >
          <Flex justify={'center'} align={'center'} className='w-full h-20'>
            <span className='text-4xl'>{LeaveDayused}</span>
            <span className='ml-1 mt-4'> /ngày</span>
          </Flex>
        </Card>
      </Flex>
    </>
  );
};
