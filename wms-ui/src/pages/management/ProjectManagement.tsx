import {
  useAddProjectMutation,
  useGetProjectsQuery,
  useRemoveProjectMutation,
  useUpdateProjectMutation,
  useSearchProjectQuery,
  usePaginateProjectsMutation,
} from '@/services';
import {
  Card,
  Flex,
  Table,
  Space,
  Button,
  Form,
  Tooltip,
  Pagination,
} from 'antd';
import { random } from 'lodash';
import { useEffect, useState } from 'react';
import { Project, StatusProject, TypeProject, TypeLeave } from 'wms-types';
import { SearchProps } from 'antd/es/input';
import { ColumnType } from 'antd/es/table';
import { ColumnExpand, EditableCell } from '@/components/shared/EditableCell';

import {
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SaveOutlined,
  StopOutlined,
} from '@ant-design/icons';
import SkeletonTable, {
  SkeletonTableColumnsType,
} from '@/components/shared/TableSkeleton';
import dayjs from 'dayjs';
export const ProjectManagement = () => {
  const [, paginatedProjects] = usePaginateProjectsMutation();

  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const { data: response, isLoading, refetch } = useGetProjectsQuery();
  const [removeProject, ProjectRemoved] = useRemoveProjectMutation();
  const [addProject, ProjectAdded] = useAddProjectMutation();

  const [updateProject, projectUpdated] = useUpdateProjectMutation();
  const [Projects, setProjects] = useState<Partial<Project>[]>([]);
  const [creatingKey, setCreatingKey] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const { data: projectSearch } = useSearchProjectQuery(search);

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<string>('');

  const isEditing = (record: Partial<Project>) => record.code === editingKey;
  const edit = (record: Partial<Project>) => {
    form.setFieldsValue({
      ...record,
      startDate: dayjs(record.startDate),
      endDate: dayjs(record.endDate),
    });
    setEditingKey(record.code!);
  };
  const save = async (record: Partial<Project>) => {
    setEditingKey('');
    const row = await form.validateFields();

    updateProject({ ...record, ...row });
  };

  useEffect(() => {
    if (response != undefined && response.data) {
      setProjects([...response?.data!]);
    }
  }, [response]);
  const cancel = () => {
    setEditingKey('');
  };
  const remove = (record: Partial<Project>) => {
    setCreatingKey('');
    setProjects(Projects.filter((e) => e.code !== record.code));
    if (record.id) removeProject(record.id);
  };
  const add = () => {
    const code = `P${random(100000000, 999999999)}`;
    const newProject = { fullname: '', code: code, password: '', email: '' };
    form.setFieldsValue({ ...newProject });
    setCreatingKey(code);
    setEditingKey(code);
    setProjects([newProject, ...Projects]);
  };
  const del = (record: Partial<Project>) => {
    setCreatingKey('');
    setEditingKey('');
    setProjects(Projects.filter((e) => e.code !== record.code));
  };

  const refetchAll = () => {
    refetch();
  };
  const applyAdd = async (key: string) => {
    try {
      const row = (await form.validateFields()) as Required<Project>;
      const {
        name,
        description,
        status,
        type,
        typeLeave,
        limit,
        startDate,
        endDate,
      } = row;
      const projectadd = {
        code: editingKey,
        name,
        description,
        status,
        type,
        typeLeave,
        limit,
        startDate: startDate || dayjs(),
        endDate: endDate || dayjs(),
      };
      const result = await addProject(projectadd);

      setProjects(
        Projects.map((e) =>
          e.code === editingKey
            ? { ...projectadd, id: result.data?.data?.id }
            : e,
        ),
      );
      setCreatingKey('');
      setEditingKey('');
    } catch (error) {}
  };
  const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
    if (!value) {
      setProjects([...response?.data!]);
    } else {
      setSearch(value);
      if (projectSearch != undefined) {
        setProjects([...projectSearch?.data!]);
      }
    }
  };
  const columns: (ColumnType<Partial<Project>> & ColumnExpand)[] = [
    {
      title: 'Mã dự án',
      dataIndex: 'code',
      editable: false,
      required: false,
    },
    {
      title: 'Tên dự án',
      dataIndex: 'name',
      editable: true,

      required: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      editable: true,
      type: 'select',

      required: true,
      values: [
        StatusProject.COMPLETED,
        StatusProject.NOT_STARTED,
        StatusProject.ONGOING,
      ],
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      editable: true,
      type: 'date',

      required: false,

      hideWhen: (record: Partial<Project>) => record.type === TypeProject.LEAVE,
      render: (date: string, record: Partial<Project>) => {
        if (record.type === TypeProject.LEAVE) return '';
        return dayjs(date).format('DD/MM/YYYY');
      },
    },

    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      editable: true,

      required: false,
      type: 'date',
      hideWhen: (record: Partial<Project>) => record.type === TypeProject.LEAVE,

      render: (date: string, record: Partial<Project>) => {
        if (record.type === TypeProject.LEAVE) return '';
        return dayjs(date).format('DD/MM/YYYY');
      },
    },

    {
      title: 'Loại dự án',
      dataIndex: 'type',
      editable: true,
      type: 'select',
      values: [TypeProject.LEAVE, TypeProject.PROJECT],

      required: true,
    },

    {
      title: 'Loại nghỉ',
      dataIndex: 'typeLeave',
      editable: true,
      type: 'select',
      hidden: true,

      required: false,
      values: [
        TypeLeave.ANNUAL,
        TypeLeave.CLASS_SCHEDULE,
        TypeLeave.INTERN,
        TypeLeave.SICK,
        TypeLeave.VACATION,
      ],
    },
    {
      title: 'Giới hạn nghỉ phép (Năm)',
      dataIndex: 'limit',
      editable: true,
      type: 'number',

      required: true,
    },
    {
      title: 'Hành động',
      key: 'action',

      required: false,
      render: (_: any, record: Partial<Project>) => {
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
      onCell: (record: Partial<Project>) => ({
        ...col,
        record,

        title: col.title,
        dataIndex: col.dataIndex,
        editing: isEditing(record) ? true : false,
        type: col.type || 'string',
        required: col.required,
        hideWhen: col.hideWhen,
        values: col?.values || null,
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
  return (
    <Card title='Bảng Dự Án' className='h-full'>
      <Flex vertical>
        <Flex className='justify-between items-start w-full h-12'>
          <Flex className='flex-row gap-5'>
            <Button
              onClick={refetchAll}
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
            loading={isLoading}
            columns={mappedColumn as SkeletonTableColumnsType[]}
          >
            <Form form={form} component={false}>
              <Table
                className='h-full w-full'
                rowKey={'code'}
                columns={mappedColumn}
                dataSource={Projects}
                pagination={false}
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
                total={paginatedProjects.data?.data?.meta?.total || 0}
              />
            </Form>
          </SkeletonTable>
        </div>
      </Flex>
    </Card>
  );
};
