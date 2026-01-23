import clsx from 'clsx';

export const Input = (
   props: React.InputHTMLAttributes<HTMLInputElement> & { error?: string },
) => (
   <div className="flex flex-col flex-1 gap-2">
      <input
         {...props}
         className={clsx(
            props.className,
            'border border-gray-300 p-2 rounded',
            { 'border-red-500': props.error },
         )}
      />
      {props.error && (
         <div className="text-red-500  text-xs">{props.error}</div>
      )}
   </div>
);
