import { Employee, Role } from 'wms-types';
import {
  Card,
  Flex,
  Table,
  Input,
  Space,
  Button,
  Form,
  Tooltip,
  Pagination,
} from 'antd';
import { useEffect, useState } from 'react';
import {
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SaveOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { ColumnExpand, EditableCell } from '@/components/shared/EditableCell';
import { ColumnType } from 'antd/es/table';
import {
  useAddEmployeeMutation,
  usePaginateEmployeesMutation,
  useRemoveEmployeeMutation,
  useUpdateEmployeeMutation,
} from '@/services';
import SkeletonTable, {
  SkeletonTableColumnsType,
} from '@/components/shared/TableSkeleton';
import { random } from 'lodash';
import dayjs from 'dayjs';
// import dayjs from 'dayjs';

export const EmployeeManagement = () => {
  const [paginateEmployees, paginatedEmployees] =
    usePaginateEmployeesMutation();
  const [removeEmployee, employeeRemoved] = useRemoveEmployeeMutation();
  const [updateEmployee, employeeUpdated] = useUpdateEmployeeMutation();
  const [addEmployee, employeeAdded] = useAddEmployeeMutation();
  const [employees, setEmployees] = useState<Partial<Employee>[]>([]);
  const [creatingKey, setCreatingKey] = useState<string>('');
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);

  const isEditing = (record: Partial<Employee>) => record.code === editingKey;
  const edit = (record: Partial<Employee>) => {
    form.setFieldsValue({ ...record, password: '',      
      internship_start_time: dayjs(record.internship_start_time),
      internship_end_time: dayjs(record.internship_end_time), });
    setEditingKey(record.code!);
  };

  useEffect(() => {
    paginateEmployees({ body: {}, paginate: { page, perPage } });
  }, [page, perPage]);

  const save = async (record: Partial<Employee>) => {
    setEditingKey('');
    const row = await form.validateFields();

    updateEmployee({ ...record, ...row });
  };
  useEffect(() => {
    if (
      paginatedEmployees != undefined &&
      paginatedEmployees.data?.data?.result
    ) {
      setEmployees([...paginatedEmployees?.data?.data?.result!]);
    }
  }, [paginatedEmployees]);

  const cancel = () => {
    setEditingKey('');
  };

  const remove = (record: Partial<Employee>) => {
    setCreatingKey('');
    setEmployees(employees.filter((e) => e.code !== record.code));
    if (record.id) removeEmployee(record.id);
  };
  const add = () => {
    const code = `E${random(100000000, 999999999)}`;
    const newEmployee = { fullname: '', code: code, password: '', email: '' };
    form.setFieldsValue({ ...newEmployee });

    setCreatingKey(code);
    setEditingKey(code);
    setEmployees([newEmployee, ...employees]);
  };

  const del = (record: Partial<Employee>) => {
    setCreatingKey('');
    setEditingKey('');
    setEmployees(employees.filter((e) => e.code !== record.code));
  };

  const formatDateToISO = (dateStr: any): Date => {
    const [day, month, year] = dateStr.split('/');
    const monthPadded = month.padStart(2, '0');
    const dayPadded = day.padStart(2, '0');
    return new Date(`${year}-${monthPadded}-${dayPadded}T00:00:00.000Z`);
  };

  const applyAdd = async (key: string) => {
    try {
      const row = (await form.validateFields()) as Required<Employee> & {
        password: string;
      };
      const { role, fullname, password, email, current_school, internship_position, internship_start_time, internship_end_time, skills } = row;

      const employee = {
        code: editingKey,
        role,
        email,
        fullname,
        password,
        current_school,
        internship_position,
        internship_start_time,
        internship_end_time,
        skills
      };

      const result = await addEmployee(employee);

      setEmployees(
        employees.map((e) =>
          e.code === editingKey
            ? { ...employee, id: result.data?.data?.id }
            : e,
        ),
      );
      setCreatingKey('');
      setEditingKey('');
    } catch (error) {
      //
    }
  };


  // Hàm định dạng ngày
  // const formatDateToDisplay = (dateStr: string | Date | undefined): string => {
  //   if (!dateStr) return '';
  //   return dayjs(dateStr).format('YYYY-MM-DD');
  // };

  const columns: (ColumnType<Partial<Employee>> & ColumnExpand)[] = [
    {
      title: 'Mã nhân viên',
      dataIndex: 'code',
      editable: false,

      required: false,
    },
    {
      title: 'Mật khẩu',
      dataIndex: 'password',
      editable: true,
      hide: true,
      render: () => {
        return '****';
      },

      required: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      editable: true,
      type: 'string',

      required: true,
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullname',
      editable: true,
      type: 'string',

      required: true,
    },
    {
      title: 'Vị trí',
      dataIndex: 'internship_position',
      editable: true,
      type: 'string',

      required: true,
    },
    {
      title: 'School/class',
      dataIndex: 'current_school',
      editable: true,
      type: 'string',

      required: true,
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'internship_start_time',
      editable: true,
      type: 'date',
      render: (date: string, record: Partial<Employee>) => {
        return dayjs(date).format('DD/MM/YYYY');
      },
      // render: (date: string | Date) => formatDateToDisplay(date),
      required: true,
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'internship_end_time',
      editable: true,
      type: 'date',
      // render: (date: string | Date) => formatDateToDisplay(date),
      render: (date: string, record: Partial<Employee>) => {
        return dayjs(date).format('DD/MM/YYYY');
      },
      required: true,
    },
    {
      title: 'Skills',
      dataIndex: 'skills',
      editable: true,
      type: 'string',

      required: true,
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      editable: true,
      type: 'select',
      values: [Role.EMPLOYEE, Role.MANAGER],
      required: true,
    },
    {
      title: 'Hành động',
      key: 'action',
      required: false,
      render: (_: any, record: Partial<Employee>) => {
        const editable = isEditing(record);
        if (record?.id === undefined) {
          return (
            <Space>
              <Tooltip placement='topLeft' title={'Thêm'}>
                <Button
                  type='primary'
                  shape='round'
                  className='h-10 w-10 flex items-center justify-center'
                  onClick={() => {
                    applyAdd(record.code!);
                  }}
                >
                  <CheckOutlined />
                </Button>
              </Tooltip>

              <Tooltip placement='topLeft' title={'Xóa'}>
                <Button
                  danger
                  type='primary'
                  shape='round'
                  onClick={() => {
                    del(record);
                  }}
                  className='h-10 w-10 flex items-center justify-center'
                >
                  <DeleteOutlined />
                </Button>
              </Tooltip>
            </Space>
          );
        }
        return !editable ? (
          <Space>
            <Tooltip placement='topLeft' title={'Chỉnh sửa'}>
              <Button
                type='primary'
                shape='round'
                disabled={editingKey != ''}
                className='h-10 w-10 flex items-center justify-center'
                onClick={() => {
                  edit(record);
                }}
              >
                <EditOutlined />
              </Button>
            </Tooltip>

            <Tooltip placement='topLeft' title={'Xóa'}>
              <Button
                danger
                type='primary'
                shape='round'
                onClick={() => remove(record)}
                className='h-10 w-10 flex items-center justify-center'
              >
                <DeleteOutlined />
              </Button>
            </Tooltip>
          </Space>
        ) : (
          <Space>
            <Tooltip placement='topLeft' title={'Lưu'}>
              <Button
                type='primary'
                shape='round'
                className='h-10 w-10 flex items-center justify-center'
                onClick={() => save(record)}
              >
                <SaveOutlined />
              </Button>
            </Tooltip>
            <Tooltip placement='topLeft' title={'Hủy'}>
              <Button
                danger
                type='primary'
                shape='round'
                onClick={cancel}
                className='h-10 w-10 flex items-center justify-center'
              >
                <StopOutlined />
              </Button>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const mappedColumn: any = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record: Partial<Employee>) => ({
        ...col,
        record,
        title: col.title,
        dataindex: col.dataIndex,
        editing: isEditing(record) ? true : false,
        type: col.type || 'string',
        values: col.hide === true ? '' : col?.values,
        hide: col.hide === true,
      }),
    };
  });

  const onChangePage = (page: number) => {
    setPage(page);
  };

  const onPerPageChange = (current: number, size: number) => {
    setPage(current);
    setPerPage(size);
  };

  // const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  // const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
  //   setSelectedRowKeys(newSelectedRowKeys);
  // };
  // const rowSelection = {
  //   selectedRowKeys,
  //   onChange: onSelectChange,
  // };

  return (
    <Card title='Bảng Nhân viên' className='h-full'>
      <Flex vertical>
        <Flex className='justify-between items-start w-full h-12'>
          <Flex className='flex-row gap-5'>
            <Button
              disabled={creatingKey != ''}
              type='primary'
              shape='round'
              className='w-10 h-10 flex items-center justify-center'
            >
              <ReloadOutlined />
            </Button>

            <Button
              onClick={add}
              disabled={creatingKey != ''}
              type='primary'
              shape='round'
              className='w-10 h-10 flex items-center justify-center'
            >
              <PlusOutlined />
            </Button>
          </Flex>
        </Flex>
        <div className='w-full h-full'>
          <SkeletonTable
            loading={paginatedEmployees.isLoading}
            columns={mappedColumn as SkeletonTableColumnsType[]}
          >
            <Form form={form} component={false}>
              <Table
                className='h-full w-full'
                rowKey={'code'}
                pagination={false}
                columns={mappedColumn}
                dataSource={employees}
                components={{
                  body: {
                    cell: EditableCell,
                  },
                }}
              />

              <Pagination
                onShowSizeChange={onPerPageChange}
                defaultCurrent={page}
                className='mt-5 w-full flex justify-end'
                onChange={onChangePage}
                defaultPageSize={perPage}
                showSizeChanger
                total={paginatedEmployees.data?.data?.meta?.total || 0}
              />
            </Form>
          </SkeletonTable>
        </div>
      </Flex>
    </Card>
  );
};
