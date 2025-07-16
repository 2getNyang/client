import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchShelters } from '@/api/shelter';  // 백엔드 API 호출 함수
import AppHeader from '@/components/AppHeader';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '@/components/ui/pagination';
import { Search, MapPin, Phone } from 'lucide-react';
import {RegionDTO, Shelter, SubRegionDTO} from '@/types/shelter';
import axios from '@/lib/axios.ts';

const Shelters = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProvince, setSelectedProvince] = useState('all'); // 시/도 선택
    const [selectedCity, setSelectedCity] = useState('all'); // 시/군/구 선택
    const [shelters, setShelters] = useState<Shelter[]>([]); // 보호소 데이터
    const [regions, setRegions] = useState<RegionDTO[]>([]); // 시도 데이터
    const [subRegions, setSubRegions] = useState<SubRegionDTO[]>([]); // 시군구 데이터
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalShelters, setTotalShelters] = useState(0); // 전체 보호소 수
    const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수

    const itemsPerPage = 12;

    // 지금 여기서 /regions에 있는 시/도 이름을 json이 아니라 html로 불러오는 오류가 있는것 같다(해결)
    // 시도 목록 가져오기
    useEffect(() => {
        const loadRegions = async () => {
            try {
                const response = await axios.get('/regions');
                console.log("API 응답 데이터:", response.data); // 응답 데이터 확인

                if (Array.isArray(response.data)) {
                    setRegions(response.data); // 배열이면 상태에 설정
                } else {
                    console.error("Expected an array but received:", response.data);
                    setError('시도 데이터를 배열로 받아올 수 없습니다.');
                }
            } catch (err) {
                setError('시도 데이터를 불러오지 못했습니다.');
                console.error('❌ API 요청 실패:', err);
            }
        };

        loadRegions();
    }, []);

    // 시도 선택 시, 해당 시도의 시군구 목록 가져오기
    // 이 함수를 통해서 해당 시/도에 대한 시/군/구 이름은 잘 가져오고 있음(백엔드로 로그찍어서 확인해봄)
    useEffect(() => {
        if (selectedProvince !== 'all') {
            const loadSubRegions = async () => {
                try {
                    const response = await axios.get(`/regions/${selectedProvince}`);  // 시군구 데이터 API 호출
                    // 빈 문자열이나 "정보 없음" 값이 있는 항목을 제외하고 필터링
                    setSubRegions(response.data.filter((subRegion: SubRegionDTO) => subRegion.subRegionName && subRegion.subRegionName !== "정보없음"));
                    setSelectedCity('all'); // 시도 변경 시 시군구를 "전체 시군구"로 초기화
                } catch (err) {
                    setError('시군구 데이터를 불러오지 못했습니다.');
                    console.error('❌ API 요청 실패:', err);
                }
            };

            loadSubRegions();
        } else {
            setSubRegions([]); // '전체 지역' 선택 시, 시군구 목록 초기화
            setSelectedCity(''); // 시군구 선택 초기화
        }
    }, [selectedProvince]);

    // 페이지 로드 시 보호소 목록 로드(필터 제외하고 그냥 진짜 보호소 목록만 가져오는 기능 필터, 검색 된 보호소 목록 로드는 따로 또 만들어야함)
    useEffect(() => {
        const loadShelters = async () => {
            try {
                setIsLoading(true);

                // fetchShelters 호출하여 데이터 가져오기
                const data = await fetchShelters(currentPage - 1, itemsPerPage);

                setShelters(data.content);
                setTotalShelters(data.totalElements);  // 전체 보호소 수 설정
                setTotalPages(data.totalPages);  // 전체 페이지 수 설정
            } catch (err) {
                setError('보호소 데이터를 불러오지 못했습니다.');
                console.error('❌ API 요청 실패:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadShelters();
    }, [currentPage]);


    const handlePageChange = (page: number) => {
        setCurrentPage(page);  // 페이지 번호 갱신
        window.scrollTo({ top: 0, behavior: 'smooth' });  // 페이지 변경 시 화면 상단으로 이동
    };

    if (isLoading) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <AppHeader
                onLoginClick={() => setIsLoggedIn(!isLoggedIn)}
                isLoggedIn={isLoggedIn}
                userName="김철수"
                onLogout={() => setIsLoggedIn(false)}
            />

            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div className="space-y-4">
                        {/* 검색바 */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="보호소 이름으로 검색해보세요."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    // setCurrentPage(1); // 검색 시 첫 페이지로
                                }}
                                className="pl-10 pr-4 py-3 w-full rounded-xl border-gray-200 text-base"
                            />
                        </div>

                        {/* 지역 선택 */}
                        <div className="flex space-x-4">
                            {/* 시/도 선택 */}
                            <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="전체 지역" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">전체 지역</SelectItem>
                                    {regions.map((region, index) => (
                                        <SelectItem key={index} value={region.regionName}>
                                            {region.regionName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* 시/군/구 선택 */}
                            {selectedProvince !== 'all' && (  // 시도에서 '전체 지역'이 아니면 시군구를 보여줌
                                <Select value={selectedCity} onValueChange={setSelectedCity}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="전체" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">전체</SelectItem>
                                        {subRegions.map((subRegion, index) => (
                                            <SelectItem key={index} value={subRegion.subRegionName}>
                                                {subRegion.subRegionName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    </div>
                </div>





                {/* 보호소 목록 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {shelters.map((shelter) => (
                        <Link key={shelter.careRegNumber} to={`/shelter/${shelter.careRegNumber}`}>
                            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold text-gray-800">
                                        {shelter.careName}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <MapPin className="w-4 h-4 mr-2" />
                                            <span>{shelter.regionName} {shelter.subRegionName}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Phone className="w-4 h-4 mr-2" />
                                            <span>{shelter.careTel}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* 페이징 처리 */}
                {totalPages > 1 && (
                    <Pagination className="mb-8">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                />
                            </PaginationItem>

                            {[...Array(totalPages)].map((_, index) => {
                                const page = index + 1;
                                const shouldShow =
                                    page === 1 ||
                                    page === totalPages ||
                                    (page >= currentPage - 1 && page <= currentPage + 1);

                                if (!shouldShow) {
                                    if (page === currentPage - 2 || page === currentPage + 2) {
                                        return (
                                            <PaginationItem key={page}>
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                        );
                                    }
                                    return null;
                                }

                                return (
                                    <PaginationItem key={page}>
                                        <PaginationLink
                                            onClick={() => handlePageChange(page)}
                                            isActive={currentPage === page}
                                            className="cursor-pointer"
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            })}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}

                {shelters.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">검색 조건에 맞는 보호소가 없습니다.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Shelters;




