
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { Link } from "react-router-dom";
// import NavBar from "@/components/layout/NavBar";
// import { useTranslation } from "react-i18next";

// const CompliancePage = () => {
//   const { t } = useTranslation();

//   return (
//     <div className="min-h-screen bg-background">
//       <NavBar />

//       <div className="container mx-auto px-4 py-8">
//         <Card className="max-w-4xl mx-auto">
//           <CardHeader>
//             <CardTitle>{t('compliance.title')}</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <p className="text-muted-foreground">
//               {t('compliance.description')}
//             </p>

//             <Separator />

//             <div>
//               <h3 className="text-xl font-semibold mb-4">{t('compliance.included')}</h3>
//               <div className="grid md:grid-cols-2 gap-4">
//                 <div className="border border-border rounded-lg p-4">
//                   <h4 className="font-medium mb-2">{t('compliance.documentation.title')}</h4>
//                   <p className="text-sm text-muted-foreground">{t('compliance.documentation.description')}</p>
//                 </div>
//                 <div className="border border-border rounded-lg p-4">
//                   <h4 className="font-medium mb-2">{t('compliance.customs.title')}</h4>
//                   <p className="text-sm text-muted-foreground">{t('compliance.customs.description')}</p>
//                 </div>
//                 <div className="border border-border rounded-lg p-4">
//                   <h4 className="font-medium mb-2">{t('compliance.tax.title')}</h4>
//                   <p className="text-sm text-muted-foreground">{t('compliance.tax.description')}</p>
//                 </div>
//                 <div className="border border-border rounded-lg p-4">
//                   <h4 className="font-medium mb-2">{t('compliance.regulatory.title')}</h4>
//                   <p className="text-sm text-muted-foreground">{t('compliance.regulatory.description')}</p>
//                 </div>
//               </div>
//             </div>

//             <Separator />

//             <div>
//               <h3 className="text-xl font-semibold mb-4">{t('compliance.pricing')}</h3>
//               <div className="bg-muted p-4 rounded-lg">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <h4 className="font-medium">{t('compliance.package')}</h4>
//                     <p className="text-sm text-muted-foreground">{t('compliance.addedTo')}</p>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-xl font-bold">€2.00</p>
//                     <p className="text-sm text-muted-foreground">{t('compliance.perPackage')}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <Separator />

//             <div>
//               <h3 className="text-xl font-semibold mb-4">{t('compliance.faq')}</h3>
//               <div className="space-y-4">
//                 <div>
//                   <h4 className="font-medium">{t('compliance.whenNeeded.question')}</h4>
//                   <p className="text-sm text-muted-foreground">{t('compliance.whenNeeded.answer')}</p>
//                 </div>
//                 <div>
//                   <h4 className="font-medium">{t('compliance.guarantee.question')}</h4>
//                   <p className="text-sm text-muted-foreground">{t('compliance.guarantee.answer')}</p>
//                 </div>
//                 <div>
//                   <h4 className="font-medium">{t('compliance.howToAdd.question')}</h4>
//                   <p className="text-sm text-muted-foreground">{t('compliance.howToAdd.answer')}</p>
//                 </div>
//               </div>
//             </div>

//             <div className="flex justify-center pt-4">
//               <Link to="/dashboard" className="text-primary hover:underline">
//                 {t('compliance.viewStatus')}
//               </Link>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default CompliancePage;
