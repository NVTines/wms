import { useGetProjectsQuery } from '@/services/project';
import {
  Button,
  DatePicker,
  DatePickerProps,
  Flex,
  SelectProps,
  Table,
  Tag,
  notification,
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { Project, TimeEntryProject, TypeProject } from 'wms-types';
import SkeletonTable from '../shared/TableSkeleton';
import {
  useGetTimeEntryEmployeeQuery,
  useUpdateTimeEntryEmployeeMutation,
} from '@/services/timeEntry';
import { orderBy } from 'lodash';
import { ReloadOutlined } from '@ant-design/icons';
import { SelectTimeSingleTag } from './SelectTimeSingleTag';

export type InfoDate = {
  day: number;
  month: number;
  year: number;
  object: any;
};
export type RangeType = {
  end: InfoDate;
  start: InfoDate;
};
export type PropsType = {
  employeeId: string | null;
  isAdmin: boolean;
};
export const ProjectSchedule = ({ employeeId, isAdmin }: PropsType) => {
  const [range, setRange] = useState<RangeType>();
  const [api, contextHolder] = notification.useNotification();
  const [dataSource, setDataSource] = useState<any[]>();
  const [columns, setColumns] = useState<any[]>([]);
  const [isChange, setIsChange] = useState<boolean>(false);
  const [totalWeeks, setTotalWeeks] = useState<number>(0);
  const { data: responseProject, isLoading, refetch } = useGetProjectsQuery();
  const [updateTimeEntryEmployee, { isSuccess, isError, data, error }] =
    useUpdateTimeEntryEmployeeMutation();
  const { data: responseTimeEntry, refetch: timeEntryRefetch } =
    useGetTimeEntryEmployeeQuery(employeeId);
  const [entries, setEntries] = useState<Partial<TimeEntryProject>[]>([]);
  const options: SelectProps['options'] = [
    { value: '0' },
    { value: '4' },
    { value: '8' },
  ];

  useEffect(() => {
    if (isError) {
      api.error({
        message: 'Thông báo',
        description: (error as any).data.message,
      });
      // refetch();
      // timeEntryRefetch();
    }
  }, [isError]);
  const onSelectTimeEntry = (
    value: any,
    timeEntry: TimeEntryProject | null = null,
    project?: Project,

    date: Dayjs | null = null,
    type: 'overtime' | 'hours' = 'hours',
  ) => {
    setIsChange(true);
    if (timeEntry) {
      // INFO: update time entry
      const newEntries = entries.map((entry) => {
        if (entry?.id === timeEntry.id) {
          if (employeeId === null) {
            return {
              ...entry,
              [`${type}`]: Number(value),
            };
          } else
            return {
              ...entry,

              [`${type}`]: Number(value),
              employeeId: employeeId,
            };
        } else return entry;
      });

      setEntries([...newEntries]);
      setIsChange(true);
    } else {
      //TODO: create time entry

      // if (Number(value) !== 0) {
      setIsChange(true);
      if (entries.length === 0) {
        const newEntries = [
          {
            [`${type}`]: Number(value),
            employeeId,
            projectId: project?.id,
            project,

            date: date?.toDate(),
          },
        ];

        setEntries([...(newEntries as any)]);
      } else {
        const index = entries.findIndex((entry) => {
          return (
            dayjs(entry.date).isSame(date, 'day') &&
            entry.projectId === project?.id
          );
        });
        if (index === -1) {
          setEntries([
            ...entries,
            {
              [`${type}`]: Number(value),
              employeeId,
              projectId: project?.id,
              project,
              date: dayjs.utc(date)?.toDate(),
            } as any,
          ]);
          return;
        } else {
          if (!entries[index][`${type}`]) {
            // NOTE: add hours value with overtime
            entries[index][`${type}`] = Number(value);
          } else {
            // NOTE: update hours value with overtime

            entries.splice(index, 1, {
              ...entries[index],
              [`${type}`]: Number(value),
              employeeId,

              projectId: project?.id,
              project,
              date: dayjs.utc(date)?.toDate(),
            } as any);
          }

          setEntries([...entries]);
        }
        // }
        // }
      }
    }
  };
  useEffect(() => {
    if (responseProject !== undefined && responseTimeEntry !== undefined) {
      // refetch();
      // timeEntryRefetch();

      const listEntries: TimeEntryProject[] = [];
      responseTimeEntry?.data?.forEach((timeEntry) => {
        const dateTimeEntry = dayjs(timeEntry.date).date();
        const monthTimeEntry = dayjs(timeEntry.date).month() + 1;
        const yearTimeEntry = dayjs(timeEntry.date).year();
        // if()
        // if (
        //   dateTimeEntry === dayjs().date() &&
        //   monthTimeEntry === dayjs().month() + 1 &&
        //   yearTimeEntry === dayjs().year()
        // ) {
        listEntries.push(timeEntry);
        // }
      });

      setEntries([...(listEntries || [])]);
      const _ = orderBy(responseProject?.data, ['type'], ['desc']).map(
        (project: Project) => {
          return {
            key: project.id,
            project: project,
            timeEntry: responseTimeEntry?.data || null,
          };
        },
      );
      setDataSource([..._!, { key: 'total', project: null, timeEntry: null }]);
    }
  }, [responseProject, responseTimeEntry, isError, employeeId]);

  const daysOfWeek = [
    'Dự án',
    'Thứ 2',
    'Thứ 3',
    'Thứ 4',
    'Thứ 5',
    'Thứ 6',
    'Thứ 7',
    'Chủ nhật',
  ];
  useEffect(() => {
    let temp = 0;
    const columns = daysOfWeek.map((value, index) => {
      if (index === 0) {
        return {
          key: 'project',
          title: value,
          dataIndex: 'project',
          render: (project: Project) => {
            if (project?.type === TypeProject.LEAVE) {
              return (
                <Tag
                  color='red'
                  className='font-bold uppercase w-full text-center py-2'
                >
                  {project.name}
                </Tag>
              );
            }

            if (project?.type === TypeProject.OVERTIME) {
              return (
                <Tag
                  color='warning'
                  className='font-bold uppercase w-full text-center py-2'
                >
                  OT
                </Tag>
              );
            }
            if (project === null) {
              return (
                <Tag
                  color='purple'
                  className='font-bold uppercase w-full text-center py-2'
                >
                  Tổng
                </Tag>
              );
            }

            return (
              <Tag
                color='blue'
                className='font-bold uppercase w-full text-center text-sm py-2'
              >
                {project.name}
              </Tag>
            );
          },
        };
      } else {
        const date = range?.start?.object?.add(temp, 'day').date();
        const month = range?.start?.object?.add(temp, 'day').month() + 1;
        const year = range?.start?.object?.add(temp, 'day').year();

        const key = `${index}${date}${month}${year}`;
        const title = `${value} - ${date}/${month}/${year?.toString().slice(2)}`;

        const disabled =
          dayjs().get('date') !== date ||
          dayjs().get('month') + 1 !== month ||
          dayjs().get('year') !== year;

        temp++;
        return {
          key,
          title,
          dataIndex: 'project',
          render: (project: Project, record: any) => {
            const now = dayjs();
            const dateStart = range?.start?.object.date();
            const monthStart = range?.start?.object?.month() + 1;
            const yearStart = range?.start?.object.year();
            const dateEnd = range?.end?.object.date();
            const monthEnd = range?.end?.object.month() + 1;
            const yearEnd = range?.end?.object.year();
            const between = now.isBetween(
              `${yearStart}/${monthStart}/${dateStart}`,
              `${yearEnd}/${monthEnd}/${dateEnd}`,
              'days',
              '[)',
            );

            const isBefore = dayjs().isBefore(
              `${yearEnd}/${monthEnd}/${dateEnd}`,
            );
            if (project === null) {
              let total = 0;

              entries.forEach((entry) => {
                const dateTimeEntry = dayjs(entry.date).date();
                const monthTimeEntry = dayjs(entry.date).month() + 1;
                const yearTimeEntry = dayjs(entry.date).year();

                if (
                  dateTimeEntry === date &&
                  monthTimeEntry === month &&
                  yearTimeEntry === year
                ) {
                  total += entry?.hours || 0;
                  total += entry?.overtime || 0;
                }
              });

              return (
                <Tag
                  className='w-full py-2 text-center font-bold '
                  color='purple'
                >
                  {total}
                </Tag>
              );
            }

            const timeEntries = record.timeEntry as TimeEntryProject[];
            let result = null;
            timeEntries?.some((timeEntry: TimeEntryProject) => {
              const dateTimeEntry = dayjs(timeEntry.date).date();
              const monthTimeEntry = dayjs(timeEntry.date).month() + 1;
              const yearTimeEntry = dayjs(timeEntry.date).year();

              if (
                dateTimeEntry === date &&
                monthTimeEntry === month &&
                yearTimeEntry === year &&
                timeEntry.projectId === project.id
              ) {
                result = (
                  <SelectTimeSingleTag
                    isAdmin={isAdmin}
                    project={project}
                    color={{
                      disabled: between ? 'red' : isBefore ? 'gray' : 'blue',
                      enabled: 'green',
                    }}
                    disabled={between ? false : disabled}
                    options={options}
                    entry={timeEntry}
                    onChange={(value) => onSelectTimeEntry(value, timeEntry)}
                    onChangeOverTime={(value) =>
                      onSelectTimeEntry(
                        value,
                        timeEntry,
                        project,

                        dayjs(`${year}/${month}/${date}`),
                        'overtime',
                      )
                    }
                    defaultValue={timeEntry.hours}
                  ></SelectTimeSingleTag>
                );

                return true;
              } else {
                result = (
                  <SelectTimeSingleTag
                    onChangeOverTime={(value) =>
                      onSelectTimeEntry(
                        value,
                        null,
                        project,
                        dayjs(`${year}/${month}/${date}`),
                        'overtime',
                      )
                    }
                    project={project}
                    isAdmin={isAdmin}
                    color={{
                      disabled: between ? 'red' : isBefore ? 'gray' : 'red',
                      enabled: 'green',
                    }}
                    disabled={between ? false : disabled}
                    options={options}
                    onChange={(value) =>
                      onSelectTimeEntry(
                        value,
                        null,
                        project,
                        dayjs(`${year}/${month}/${date}`),
                        'hours',
                      )
                    }
                    defaultValue={0}
                  ></SelectTimeSingleTag>
                );
              }
            });

            if (result === null) {
              result = (
                <SelectTimeSingleTag
                  onChangeOverTime={(value) =>
                    onSelectTimeEntry(
                      value,
                      null,
                      project,
                      dayjs(`${year}/${month}/${date}`),
                      'overtime',
                    )
                  }
                  project={project}
                  color={{
                    disabled: between ? 'red' : isBefore ? 'gray' : 'red',
                    enabled: 'green',
                  }}
                  isAdmin={isAdmin}
                  disabled={between ? false : disabled}
                  options={options}
                  onChange={(value) =>
                    onSelectTimeEntry(
                      value,
                      null,
                      project,
                      dayjs(`${year}/${month}/${date}`),
                      'hours',
                    )
                  }
                  defaultValue={0}
                />
              );
            }
            return result;
          },
        };
      }
    });
    setColumns(columns);
  }, [range, entries, responseTimeEntry, responseProject, employeeId]);

  useEffect(() => {}, [totalWeeks, employeeId]);

  const calculateTotal = (range: any) => {
    let total = 0;

    const dateStart = range?.start?.object?.date();
    const monthStart = range?.start?.object?.month() + 1;
    const yearStart = range?.start?.object?.year();

    const dateEnd = range?.end?.object?.date();
    const monthEnd = range?.end?.object?.month() + 1;
    const yearEnd = range?.end?.object?.year();

    if (entries) {
      entries.forEach((entry) => {
        const dateTimeEntry = dayjs(entry.date).date();
        const monthTimeEntry = dayjs(entry.date).month() + 1;
        const yearTimeEntry = dayjs(entry.date).year();

        const current = dayjs(
          `${yearTimeEntry}/${monthTimeEntry}/${dateTimeEntry}`,
        );

        const between = current.isBetween(
          `${yearStart}/${monthStart}/${dateStart}`,
          `${yearEnd}/${monthEnd}/${dateEnd}`,
          'days',
          '[)',
        );

        if (between) {
          total += entry?.hours || 0;
          total += entry?.overtime || 0;
        }
      });
      setTotalWeeks(total);
    }
  };
  useEffect(() => {
    calculateTotal(range);
  }, [entries, responseTimeEntry, employeeId]);

  const onChange: DatePickerProps['onChange'] = (date) => {
    const startOfWeek = date.day(0).add(1, 'day');

    const endOfWeek = startOfWeek.add(7, 'day');

    const _range = {
      start: {
        day: startOfWeek.get('D'),
        object: startOfWeek,
        month: startOfWeek.month(),
        year: startOfWeek.year(),
      },
      end: {
        day: endOfWeek.get('D'),
        month: endOfWeek.month(),
        object: endOfWeek,
        year: endOfWeek.year(),
      },
    };
    setRange(_range);

    calculateTotal(_range);
  };

  const saveSchedule = () => {
    if (isChange && entries.length > 0) {
      updateTimeEntryEmployee(entries);
      setIsChange(false);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      api.success({
        message: 'Thông báo',
        description: 'Lưu thành công',
      });
    }
  }, [isSuccess]);

  const refetchAll = () => {
    refetch();
    timeEntryRefetch();
  };

  useEffect(() => {
    setColumns([]);
  }, [employeeId]);
  return (
    <Flex className='flex-col'>
      {contextHolder}
      <Flex className='mb-5 gap-5'>
        <DatePicker
          name='week-picker'
          showNow={false}
          className='w-72'
          type='week'
          picker='week'
          onChange={onChange}
          allowClear={false}
        />

        <Button
          onClick={refetchAll}
          type='primary'
          shape='round'
          className='w-10 h-10 flex items-center justify-center'
        >
          <ReloadOutlined />
        </Button>
      </Flex>

      {range && (
        <>
          <SkeletonTable
            loading={columns.length === 0 ? true : isLoading}
            columns={columns as any}
          >
            <Table
              className='w-full'
              dataSource={dataSource}
              columns={columns}
              title={() => 'Bảng chấm công'}
              pagination={false}
            ></Table>
          </SkeletonTable>

          <Flex className='items-center mt-5 '>
            <Tag
              color='red'
              className=' font-bold uppercase w-20 text-center flex justify-center items-center  h-12'
            >
              Tổng: {totalWeeks}
            </Tag>
            <Button
              className='w-20 h-12 ml-auto'
              onClick={saveSchedule}
              type='primary'
            >
              Lưu
            </Button>
          </Flex>
        </>
      )}
    </Flex>
  );
};
