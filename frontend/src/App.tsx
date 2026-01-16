export const Login = () => {
   const onSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      const username = formData.get('username') as string;
      const password = formData.get('password') as string;

      fetch('/api/auth/login', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({ username, password }),
      })
         .then((res) => {
            if (res.ok) {
               alert('Login successful');
            } else {
               alert('Login failed');
            }
         })
         .catch(() => {
            alert('An error occurred');
         });
   };

   return (
      <div className="flex flex-col items-center justify-center h-screen">
         <h1 className="text-3xl font-bold mb-6">Login</h1>
         <div className="w-96 p-6 border border-gray-300 rounded shadow-md">
            <form className="flex flex-col gap-4" onSubmit={onSubmit}>
               <input
                  type="text"
                  placeholder="Username"
                  name="username"
                  className="border border-gray-300 p-2 rounded"
               />
               <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  className="border border-gray-300 p-2 rounded"
               />
               <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
               >
                  Login
               </button>
            </form>
         </div>
      </div>
   );
};
