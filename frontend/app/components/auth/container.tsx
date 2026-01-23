export const Container = (props: {
   title: string;
   children: React.ReactNode;
}) => {
   return (
      <div className="flex flex-col items-center justify-center h-screen">
         <h1 className="text-3xl font-bold mb-6">{props.title}</h1>
         <div className="w-96 p-6 border border-gray-300 rounded shadow-md">
            {props.children}
         </div>
      </div>
   );
};
