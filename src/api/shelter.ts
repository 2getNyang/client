import axios from '@/lib/axios.ts';
import { ShelterDetail } from '@/types/shelter.ts';
import { Shelter } from '@/types/shelter';

// 전체 보호소 목록 가져오기 (페이지네이션 적용)
export const fetchShelters = async (
    page: number,
    size: number = 12, // 기본 값은 12로 설정

): Promise<{ content: Shelter[]; totalElements: number; totalPages: number }> => {
    const response = await axios.get('/shelters', {
        params: {
            page: page,  // 페이지 번호
            size: size,  // 페이지당 항목 수
        },
    });

    console.log("API 응답 데이터: ", response.data);
    return {
        content: response.data.content || [],
        totalElements: response.data.totalElements,
        totalPages: response.data.totalPages,
    };
};



export const fetchShelterDetail = async (id: string): Promise<ShelterDetail> => {
    const response = await axios.get(`/shelters/${id}`);
    return response.data;
};