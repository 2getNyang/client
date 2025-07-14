//
// import React, { useState, useMemo } from 'react';
// import { Link } from 'react-router-dom';
// import AppHeader from '@/components/AppHeader';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
//   PaginationEllipsis
// } from '@/components/ui/pagination';
// import { Search, MapPin, Phone } from 'lucide-react';
// import { Shelter } from '@/types/shelter';
// import { provinces, cities, shelters } from '@/data/shelterData';
//
// const Shelters = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedProvince, setSelectedProvince] = useState('all');
//   const [selectedCity, setSelectedCity] = useState('');
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//
//   const itemsPerPage = 12; // 4열 x 3행
//
//   // 선택된 시/도에 따른 시/군/구 필터링
//   const filteredCities = selectedProvince
//     ? cities.filter(city => city.provinceCode === selectedProvince)
//     : [];
//
//   // 보호소 필터링
//   const filteredShelters = shelters.filter(shelter => {
//     const matchesSearch = shelter.name.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesProvince = !selectedProvince || selectedProvince === 'all' || shelter.province === selectedProvince;
//     const matchesCity = !selectedCity || selectedCity === 'all' || shelter.city === selectedCity;
//
//     return matchesSearch && matchesProvince && matchesCity;
//   });
//
//   // 페이징 계산
//   const totalPages = Math.ceil(filteredShelters.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentShelters = filteredShelters.slice(startIndex, endIndex);
//
//   // 페이지 변경 시 처리
//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };
//
//   const handleProvinceChange = (value: string) => {
//     setSelectedProvince(value);
//     setSelectedCity(''); // 시/도 변경시 시/군/구 초기화
//     setCurrentPage(1); // 필터 변경시 첫 페이지로
//   };
//
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <AppHeader
//         onLoginClick={() => setIsLoggedIn(!isLoggedIn)}
//         isLoggedIn={isLoggedIn}
//         userName="김철수"
//         onLogout={() => setIsLoggedIn(false)}
//       />
//
//       <div className="container mx-auto px-4 py-8">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-800 mb-4">보호소 찾기</h1>
//           <p className="text-gray-600">우리 지역의 동물보호소를 찾아보세요</p>
//         </div>
//
//         {/* 검색 및 필터 섹션 */}
//         <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
//           <div className="space-y-4">
//             {/* 검색바 */}
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <Input
//                 placeholder="보호소 이름으로 검색해보세요..."
//                 value={searchTerm}
//                 onChange={(e) => {
//                   setSearchTerm(e.target.value);
//                   setCurrentPage(1); // 검색 시 첫 페이지로
//                 }}
//                 className="pl-10 pr-4 py-3 w-full rounded-xl border-gray-200 text-base"
//               />
//             </div>
//
//             {/* 지역 선택 */}
//             <div className="flex gap-4">
//               {/* 시/도 선택 */}
//               <div className="flex-1">
//                 <Select value={selectedProvince} onValueChange={handleProvinceChange}>
//                   <SelectTrigger className="w-full">
//                     <SelectValue placeholder="전체 지역" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">전체 지역</SelectItem>
//                     {provinces.map((province) => (
//                       <SelectItem key={province.code} value={province.code}>
//                         {province.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//
//               {/* 시/군/구 선택 - 시/도가 선택되었고 'all'이 아닐 때만 표시 */}
//               {selectedProvince && selectedProvince !== 'all' && (
//                 <div className="flex-1">
//                   <Select value={selectedCity} onValueChange={(value) => {
//                     setSelectedCity(value);
//                     setCurrentPage(1); // 시/군/구 변경 시 첫 페이지로
//                   }}>
//                     <SelectTrigger className="w-full">
//                       <SelectValue placeholder="시/군/구 선택" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="all">전체</SelectItem>
//                       {filteredCities.map((city) => (
//                         <SelectItem key={city.code} value={city.code}>
//                           {city.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//
//         {/* 보호소 목록 */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           {currentShelters.map((shelter) => (
//             <Link key={shelter.id} to={`/shelter/${shelter.id}`}>
//               <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
//                 <CardHeader>
//                   <CardTitle className="text-lg font-semibold text-gray-800">
//                     {shelter.name}
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-2">
//                     <div className="flex items-center text-sm text-gray-600">
//                       <MapPin className="w-4 h-4 mr-2" />
//                       <span>
//                         {provinces.find(p => p.code === shelter.province)?.name} {cities.find(c => c.code === shelter.city)?.name}
//                       </span>
//                     </div>
//                     <div className="flex items-center text-sm text-gray-600">
//                       <Phone className="w-4 h-4 mr-2" />
//                       <span>{shelter.phone}</span>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </Link>
//           ))}
//         </div>
//
//         {/* 페이징 */}
//         {totalPages > 1 && (
//           <Pagination className="mb-8">
//             <PaginationContent>
//               <PaginationItem>
//                 <PaginationPrevious
//                   onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
//                   className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
//                 />
//               </PaginationItem>
//
//               {[...Array(totalPages)].map((_, index) => {
//                 const page = index + 1;
//                 const shouldShow =
//                   page === 1 ||
//                   page === totalPages ||
//                   (page >= currentPage - 1 && page <= currentPage + 1);
//
//                 if (!shouldShow) {
//                   if (page === currentPage - 2 || page === currentPage + 2) {
//                     return (
//                       <PaginationItem key={page}>
//                         <PaginationEllipsis />
//                       </PaginationItem>
//                     );
//                   }
//                   return null;
//                 }
//
//                 return (
//                   <PaginationItem key={page}>
//                     <PaginationLink
//                       onClick={() => handlePageChange(page)}
//                       isActive={currentPage === page}
//                       className="cursor-pointer"
//                     >
//                       {page}
//                     </PaginationLink>
//                   </PaginationItem>
//                 );
//               })}
//
//               <PaginationItem>
//                 <PaginationNext
//                   onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
//                   className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
//                 />
//               </PaginationItem>
//             </PaginationContent>
//           </Pagination>
//         )}
//
//         {filteredShelters.length === 0 && (
//           <div className="text-center py-12">
//             <p className="text-gray-500 text-lg">검색 조건에 맞는 보호소가 없습니다.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
//
// export default Shelters;
