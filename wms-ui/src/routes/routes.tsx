import { Route, Routes } from 'react-router-dom';
import Login from '@/pages/Login';
import MainLayout from '@/layouts/MainLayout';
import { config } from './routes.config';
import AuthLayout from '@/layouts/AuthLayout';
import {
  Logout,
  EmployeeManagement,
  NotFound,
  ProjectManagement,
  Profile,
} from '@/pages';
import { useSelector } from 'react-redux';
import { selectCurrentCode } from '@/redux/features/auth/auth.slice';
import { Role } from 'wms-types';
import { ScheduleManagement } from '@/pages/management/ScheduleManagement';
import { EmployeeSchedule } from '@/pages/EmployeeSchedule';
import { Dashboard } from '@/pages/Dashboard';
import { useGetEmployeeQuery } from '@/services';

export const RoutesConfig = () => {
  const { data: currentuser } = useGetEmployeeQuery();
  const t = true;

  return (
    <Routes>
      <Route path={config.logout} element={<Logout />}></Route>
      <Route path={config.system.root} Component={MainLayout}>
        <Route
          path={config.system.employee.profile.path}
          element={<Profile />}
          key='profile'
        />
        <Route
          path={config.system.dashboard.path}
          element={<Dashboard />}
          key='dasboard'
          index
        />
        <Route
          path={config.system.employee.schedule.path}
          element={<EmployeeSchedule />}
          key='employee_schedule'
        />

        {/* {t == true ? ( */}
        <Route path={config.system.management.root.path}>
          <>
            <Route
              path={config.system.management.project.path}
              key='project_management'
              element={<ProjectManagement />}
            />
            <Route
              path={config.system.management.schedule.path}
              key='schedule_management'
              element={<ScheduleManagement />}
            />
            <Route
              key='employee_management'
              path={config.system.management.employee.path}
              element={<EmployeeManagement />}
            />
          </>
        </Route>
        {/* ) : ( */}
        {/*   <> </> */}
        {/* )} */}
      </Route>
      <Route path='/auth' Component={AuthLayout}>
        <Route index path='/auth/login' element={<Login />} />
      </Route>
      {/* <Route path='/auth' Component={AuthLayout}>
        <Route index path='/auth/login' element={<Login />} />
      </Route> */}

      <Route path='*' Component={NotFound} />
    </Routes>
  );
};
