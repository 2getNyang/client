
import axios from '@/lib/axios.ts';
import { ShelterDetail } from '@/types/shelter.ts';

export const fetchShelterDetail = async (id: string): Promise<ShelterDetail> => {
    const response = await axios.get(`/shelters/${id}`);
    return response.data;
};
