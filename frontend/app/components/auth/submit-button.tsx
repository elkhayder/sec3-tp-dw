export const SubmitButton = (props: { label: string }) => (
   <button
      type="submit"
      className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
   >
      {props.label}
   </button>
);
