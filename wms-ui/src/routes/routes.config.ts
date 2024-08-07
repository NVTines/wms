import path from 'path';

export const config = {
  auth: {
    root: '/auth',
    login: '/auth/login',
  },
  root: '/',
  logout: '/logout',
  system: {
    root: '/',
    employee: {
      profile: {
        path: '/employee/profile',
        key: 'profile',
      },
      schedule: {
        path: '/employee/schedule',
        key: 'schedule',
      },
    },
    dashboard: {
      path: '/employee/dashboard',
      name: 'Dashboard',
      key: 'dashboard',
    },
    management: {
      root: {
        path: '/management',
        name: 'Management',
        title: 'Management',
        key: 'management',
      },
      project: {
        path: '/management/project',
        name: 'Management Project',
        title: 'Management Project',

        key: 'project_management',
      },
      schedule: {
        path: '/management/schedule',
        name: 'Management Schedule',
        title: 'Management Schedule',
        key: 'schedule_management',
      },
      employee: {
        path: '/management/employee',
        name: 'Management Employee',
        title: 'Management Employee',
        key: 'employee_management',
      },
    },
  },
};
