import { useGetProjectByEmployeeWithYearQuery } from '@/services';
import { Button, Card, DatePicker, Flex, Select, Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import { ChartStatistic } from '@/components/shared/Chart';
import dayjs, { Dayjs } from 'dayjs';
import { sum } from 'lodash';
import { TypeLeave, TypeProject } from 'wms-types';
import { CardEmployee } from './CardEmployee';
import { UnderlineOutlined } from '@ant-design/icons';

export const EmployeeStatistics = ({id}:{id:string}) => {
  const { data: projectsEmployeeWithYear, refetch } =id !== "" ? 
  useGetProjectByEmployeeWithYearQuery({
    id: id,
    year: new Date().getFullYear(),
  }) :  useGetProjectByEmployeeWithYearQuery({
    id: undefined,
    year: new Date().getFullYear(),
  })



  const [valueDatePicker, setValueDatePicker] = useState<Dayjs>(dayjs());
  const [barChart, setBarChart] = useState<any>(null);
  const [chartDetailHours, setChartDetailHours] = useState<any>(null);
  const [chartLeave, setChartLeave] = useState<any>(null);

  const [project, setProject] = useState<string | null>(
    projectsEmployeeWithYear?.data?.find((e) => e.type === TypeProject.PROJECT)
      ?.id || null,
  );

  const [type, setType] = useState<'month' | 'year' | 'quarter' | 'week'>(
    'week',
  );

  useEffect(() => {
    if (!projectsEmployeeWithYear?.data) return;

    const currentProject = projectsEmployeeWithYear.data.find(
      (e) => e.id === project,
    );

    const dateStartOfWeek = valueDatePicker.day(1).get('date');
    const dateEndOfWeek = valueDatePicker.day(7).get('date');
    const month = valueDatePicker.get('month') + 1;
    const year = valueDatePicker.get('year');

    const sumHours: number[] = [];
    const sumOT: number[] = [];

    const timeEntries = currentProject?.timeEntries;
    switch (type) {
      case 'week': {
        const days: string[] = [];
        for (let i = dateStartOfWeek; i <= dateEndOfWeek; i++) {
          days.push(`${i >= 10 ? i : `0${i}`}/${month}/${year}`);
        }
        days.forEach((day) => {
          let sumH = 0;
          let sumO = 0;
          timeEntries?.forEach((e) => {
            if (dayjs(e.date).format('DD/M/YYYY') == day) {
              sumH += e.hours;
              sumO += e.overtime;
            }
          });
          sumHours.push(sumH);
          sumOT.push(sumO);
        });

        setBarChart({
          series: [
            {
              name: 'Giờ công',
              data: sumHours,
            },
            {
              name: 'Tăng ca',
              data: sumOT,
            },
          ],
          options: {
            chart: {
              type: 'bar',
              height: 350,
              stacked: true,
              toolbar: {
                show: false,
              },
              zoom: {
                enabled: false,
              },
            },
            responsive: [
              {
                breakpoint: 480,
                options: {
                  legend: {
                    position: 'bottom',
                    offsetX: -10,
                    offsetY: 0,
                  },
                },
              },
            ],
            plotOptions: {
              bar: {
                horizontal: false,
                borderRadius: 10,
                borderRadiusApplication: 'end', // 'around', 'end'
                borderRadiusWhenStacked: 'last', // 'all', 'last'
              },
            },
            xaxis: {
              type: 'string',
              categories: days,
            },
            yaxis: {
              min: 0,
              max: sum([...sumOT, ...sumHours]),
            },
            legend: {
              position: 'right',
              offsetY: 40,
            },
            fill: {
              opacity: 1,
            },
          },
        });
        break;
      }
      case 'month': {
        const months = [];

        for (let i = 1; i <= 12; i++) {
          months.push(`${i}/${year}`);
        }

        months.forEach((month) => {
          let sumH = 0;
          let sumO = 0;

          timeEntries?.forEach((e) => {
            if (dayjs(e.date).format('M/YYYY') == month) {
              sumH += e.hours;
              sumO += e.overtime;
            }
          });
          sumHours.push(sumH);
          sumOT.push(sumO);
        });

        setBarChart({
          series: [
            {
              name: 'Giờ công',
              data: sumHours,
            },
            {
              name: 'Tăng ca',
              data: sumOT,
            },
          ],
          options: {
            chart: {
              type: 'bar',
              height: 350,
              stacked: true,
              toolbar: {
                show: false,
              },
              zoom: {
                enabled: false,
              },
            },
            responsive: [
              {
                breakpoint: 480,
                options: {
                  legend: {
                    position: 'bottom',
                    offsetX: -10,
                    offsetY: 0,
                  },
                },
              },
            ],
            plotOptions: {
              bar: {
                horizontal: false,
                borderRadius: 10,
                borderRadiusApplication: 'end', // 'around', 'end'
                borderRadiusWhenStacked: 'last', // 'all', 'last'
              },
            },
            xaxis: {
              type: 'string',
              categories: months,
            },
            yaxis: {
              min: 0,
              max: sum([...sumOT, ...sumHours]),
            },
            legend: {
              position: 'right',
              offsetY: 40,
            },
            fill: {
              opacity: 1,
            },
          },
        });

        break;
      }
      case 'quarter': {
        const quarters = [];
        for (let i = 1; i <= 4; i++) {
          quarters.push(`Q${i}/${year}`);
        }
        quarters.forEach((quarter) => {
          let sumH = 0;
          let sumO = 0;

          timeEntries?.forEach((e) => {
            if (`Q${dayjs(e.date).quarter()}/${year}` == quarter) {
              sumH += e.hours;
              sumO += e.overtime;
            }
          });
          sumHours.push(sumH);
          sumOT.push(sumO);
        });

        setBarChart({
          series: [
            {
              name: 'Giờ công',
              data: sumHours,
            },
            {
              name: 'Tăng ca',
              data: sumOT,
            },
          ],
          options: {
            chart: {
              type: 'bar',
              height: 350,
              stacked: true,
              toolbar: {
                show: false,
              },
              zoom: {
                enabled: false,
              },
            },
            responsive: [
              {
                breakpoint: 480,
                options: {
                  legend: {
                    position: 'bottom',
                    offsetX: -10,
                    offsetY: 0,
                  },
                },
              },
            ],
            plotOptions: {
              bar: {
                horizontal: false,
                borderRadius: 10,
                borderRadiusApplication: 'end', // 'around', 'end'
                borderRadiusWhenStacked: 'last', // 'all', 'last'
              },
            },
            xaxis: {
              type: 'string',
              categories: quarters,
            },
            yaxis: {
              min: 0,
              max: sum([...sumOT, ...sumHours]),
            },
            legend: {
              position: 'right',
              offsetY: 10,
            },
            fill: {
              opacity: 1,
            },
          },
        });

        break;
      }
    }

    const hoursProjects: number[] = [];
    const listProject: string[] = [];
    const leaves: number[] = [];

    let sickLeaves = 0;
    let annualLeaves = 0;
    let otherLeaves = 0;

    projectsEmployeeWithYear.data.forEach((project) => {
      let sumH = 0;
      project?.timeEntries?.forEach((e) => {
        sumH += e.hours;
        sumH += e.overtime;
        if (project.typeLeave === TypeLeave.SICK) {
          sickLeaves += 1;
        } else if (project.typeLeave === TypeLeave.ANNUAL) {
          annualLeaves += 1;
        } else if (project.typeLeave !== null) {
          otherLeaves += 1;
        }
      });
      if (project.type !== TypeProject.LEAVE) {
        hoursProjects.push(sumH);
        listProject.push(project.name);
      }
    });

    leaves.push(annualLeaves, sickLeaves, otherLeaves);

    setChartLeave({
      series: leaves.length > 0 ? leaves : [0, 0, 0],
      options: {
        chart: {
          width: 350,
          height: 350,
          type: 'pie',
        },
        labels: ['Ngày nghỉ phép', 'Ngày nghỉ bệnh', 'Ngày nghỉ khác'],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 350,
              },
              legend: {
                position: 'bottom',
              },
            },
          },
        ],
      },
    });
    setChartDetailHours({
      series: [
        {
          name: 'Giờ công',
          data: hoursProjects,
        },
      ],
      options: {
        chart: {
          height: 330,
          type: 'bar',
        },
        //colors: colors,
        plotOptions: {
          bar: {
            columnWidth: '45%',
            distributed: true,
          },
        },
        dataLabels: {
          enabled: true,
        },
        legend: {
          show: false,
        },
        xaxis: {
          categories: listProject,
          labels: {
            style: {
              fontSize: '12px',
            },
          },
        },
      },
    });
  }, [project, projectsEmployeeWithYear, type, valueDatePicker]);

  useEffect(() => {
    refetch();
  }, []);
  return (
    <>
      {/* <Button onClick={() => refetch()}>Refetch</Button> */}
      <CardEmployee id={id}></CardEmployee>
      <Flex justify={'start'} align={'center'} className='w-full h-20 gap-1'>
        <Select
          className='w-52'
          showSearch
          placeholder='Chọn dự án'
          onChange={(value: string) => {
            setProject(value);
          }}
          options={projectsEmployeeWithYear?.data

            ?.filter((e) => e.type !== TypeProject.LEAVE)
            ?.map((project) => {
              return { value: project.id, label: project.name };
            })}
          defaultValue={
            projectsEmployeeWithYear?.data?.find(
              (e) => e.type === TypeProject.PROJECT,
            )?.id
          }
        />
        <Select
          onChange={(value) =>
            setType(value as 'week' | 'month' | 'year' | 'quarter')
          }
          options={[
            {
              value: 'week',
              label: 'Theo tuần',
            },

            {
              value: 'month',
              label: 'Theo tháng',
            },

            {
              value: 'quarter',
              label: 'Theo quý',
            },
          ]}
          style={{ width: 150 }}
          defaultValue={'week'}
        />
        {type === 'week' && (
          <>
            <DatePicker
              picker={type}
              inputReadOnly={true}
              disabledDate={(current) => {
                return current.year() !== valueDatePicker.year();
              }}
              onChange={(date) => {
                setValueDatePicker(date);
              }}
              defaultValue={valueDatePicker}
            />
          </>
        )}
      </Flex>

      <Card className='w-full '>
        {barChart ? (
          <ChartStatistic typeChart='bar' data={barChart}></ChartStatistic>
        ) : (
          <Skeleton active></Skeleton>
        )}
      </Card>
      <div className='grid grid-cols-2  h-fit gap-2'>
        {chartLeave ? (
          <Card className='mt-5 '>
            <h1>Ngày nghỉ</h1>
            <ChartStatistic typeChart='pie' data={chartLeave}></ChartStatistic>
          </Card>
        ) : (
          <Skeleton active></Skeleton>
        )}
        {chartDetailHours ? (
          <Card className='mt-5 '>
            <h1>Chi tiết giờ công</h1>
            <ChartStatistic
              typeChart='bar'
              data={chartDetailHours}
            ></ChartStatistic>
          </Card>
        ) : (
          <Skeleton active></Skeleton>
        )}
      </div>
    </>
  );
};
