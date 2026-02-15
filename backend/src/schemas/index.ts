import * as authSchemas from './auth.schema.js';
import * as eventSchemas from './event.schema.js';

export default {
   auth: {
      login: authSchemas.login,
      signup: authSchemas.signup,
   },
   event: {
      create: eventSchemas.create,
      update: eventSchemas.update,
      listQuery: eventSchemas.listQuery,
   },
};
