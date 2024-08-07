import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import BaseLayout from './BaseLayout';
import { Avatar, Layout, Menu, MenuProps, theme } from 'antd';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/redux/features/auth/auth.slice';
import { useEffect } from 'react';

import {
  CalendarOutlined,
  DashboardOutlined,
  LaptopOutlined,
  ProjectOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { config } from '@/routes';
import { useGetEmployeeQuery } from '@/services';
import { Role } from 'wms-types';

const { Header, Sider, Content } = Layout;

export default function MainLayout() {
  const user = useSelector(selectCurrentUser);
  const { data: response , refetch} = useGetEmployeeQuery();

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();

  const location = useLocation();
  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
    }
    refetch()
  }, [user]);

  const headerItem: MenuProps['items'] = [
    {
      key: 'headerName',
      label: 'Workforce Management System',
      className: 'mr-auto',
    },
    {
      className: 'ml-auto',
      key: 'fullnameHeaderItem',
      label: (
        <Avatar
          size='large'
          style={{ backgroundColor: 'grey' }}
          icon={<UserOutlined />}
        />
      ),
      children: [
        // {
        //   key: config.system.employee.profile.path,
        //   label: (
        //     <Link to={config.system.employee.profile.path}>
        //       Cài đặt thông tin
        //     </Link>
        //   ),
        // },
        {
          key: 'logout',
          label: <Link to={config.logout}>Đăng xuất</Link>,
        },
      ],
    },
  ];
  const siderItemsForAdmin: MenuProps['items'] = [
    {
      key: config.system.management.root.key,
      label: 'Quản lý',
      icon: <LaptopOutlined />,
      children: [
        {
          key: config.system.management.project.path,
          label: <Link to={config.system.management.project.path}>Dự án</Link>,
          icon: <ProjectOutlined />,
        },
        {
          key: config.system.management.employee.path,
          label: (
            <Link to={config.system.management.employee.path}>Nhân viên</Link>
          ),
          icon: <UsergroupAddOutlined />,
        },

        {
          key: config.system.management.schedule.path,
          label: (
            <Link to={config.system.management.schedule.path}>Điểm danh</Link>
          ),
          icon: <CalendarOutlined />,
        },
      ],
    },
  ];
  const siderItemsForEmployee: MenuProps['items'] = [
    {
      key: config.system.dashboard.path,
      label: <Link to={config.system.dashboard.path}>Dashboard </Link>,
      icon: <DashboardOutlined />,
    },
    {
      key: config.system.employee.schedule.path,
      label: <Link to={config.system.employee.schedule.path}>Chấm công </Link>,
      icon: <CalendarOutlined />,
    },
  ];
  const siderItems =    
    response?.data?.role === Role.MANAGER
      ? [...siderItemsForEmployee, ...siderItemsForAdmin]
      : siderItemsForEmployee;

  return (
    user && (
      <BaseLayout>
        <Header className='fixed top-0 left-0 z-10 w-full'>
          <Menu
            theme='dark'
            className='flex w-full h-full'
            mode='horizontal'
            selectable={false}
            items={headerItem}
            style={{ width: '100%' }}
          />
        </Header>
        <Layout>
          <Sider
            className='fixed top-16 left-0 z-10'
            width={200}
            style={{
              background: colorBgContainer,
              overflow: 'auto',
              height: '100vh',
              position: 'fixed',
            }}
            breakpoint='xs'
            collapsedWidth='50'
          >
            <Menu
              mode='inline'
              defaultSelectedKeys={[location.pathname]}
              style={{ height: '100%', borderRight: 0 }}
              items={siderItems}
            />
          </Sider>
          <Layout
            className='p-6'
            style={{ marginLeft: '12rem', marginTop: '3rem' }}
          >
            <Content>
              <Outlet />
            </Content>
          </Layout>
        </Layout>
      </BaseLayout>
    )
  );
}
