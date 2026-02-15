import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from '~/components/ui/card';

export const Container = (props: {
   title: string;
   description?: string;
   children: React.ReactNode;
}) => {
   return (
      <Card>
         <CardHeader>
            <CardTitle className="text-center">{props.title}</CardTitle>
            <CardDescription className="text-center text-xs">
               {props.description}
            </CardDescription>
         </CardHeader>
         <CardContent>{props.children}</CardContent>
      </Card>
   );
};
