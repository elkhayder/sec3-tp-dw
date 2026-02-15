import {
   type RouteConfig,
   index,
   layout,
   prefix,
   route,
} from '@react-router/dev/routes';

export default [
   index('pages/index.tsx'),

   layout('layouts/default.tsx', [
      ...prefix('events', [
         route('/', 'pages/events/index.tsx'),
         route('/:id', 'pages/events/[id].tsx'),
      ]),
   ]),

   layout(
      'layouts/auth.tsx',
      prefix('auth', [
         route('login', 'pages/auth/login.tsx'),
         route('signup', 'pages/auth/signup.tsx'),
      ]),
   ),
] satisfies RouteConfig;
