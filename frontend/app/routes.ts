import {
   type RouteConfig,
   index,
   prefix,
   route,
} from '@react-router/dev/routes';

export default [
   index('pages/index.tsx'),
   ...prefix('auth', [
      route('login', 'pages/auth/login.tsx'),
      route('signup', 'pages/auth/signup.tsx'),
   ]),
] satisfies RouteConfig;
