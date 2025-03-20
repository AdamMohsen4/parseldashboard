
// import React from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// interface CollaborationsTableProps {
//   collaborations: any[];
//   isLoading: boolean;
//   formatDate: (dateString: string) => string;
// }

// const CollaborationsTable: React.FC<CollaborationsTableProps> = ({
//   collaborations,
//   isLoading,
//   formatDate,
// }) => {
//   if (isLoading) {
//     return <div className="text-center py-8">Loading collaborations...</div>;
//   }

//   if (collaborations.length === 0) {
//     return <div className="text-center py-8 text-muted-foreground">No collaborations found</div>;
//   }

//   return (
//     <div className="overflow-x-auto">
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Business Name</TableHead>
//             <TableHead>Destination</TableHead>
//             <TableHead>Volume</TableHead>
//             <TableHead>Frequency</TableHead>
//             <TableHead>Next Shipment</TableHead>
//             <TableHead>Contact Email</TableHead>
//             <TableHead>Contact Phone</TableHead>
//             <TableHead>Created</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {collaborations.map((collab) => (
//             <TableRow key={collab.id}>
//               <TableCell className="font-medium">{collab.business_name || "N/A"}</TableCell>
//               <TableCell>{collab.destination || "N/A"}</TableCell>
//               <TableCell>{collab.volume || "N/A"}</TableCell>
//               <TableCell>{collab.frequency || "N/A"}</TableCell>
//               <TableCell>{collab.next_shipment_date || "N/A"}</TableCell>
//               <TableCell>{collab.contact_email || "N/A"}</TableCell>
//               <TableCell>{collab.contact_phone || "N/A"}</TableCell>
//               <TableCell>{formatDate(collab.created_at)}</TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// };

// export default CollaborationsTable;
