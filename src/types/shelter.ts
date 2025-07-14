
export interface Shelter {
  id: string;
  name: string;
  introduction: string;
  province: string;
  city: string;
  address: string;
  phone: string;
  latitude?: number;
  longitude?: number;
}

// 보호소 상세정보
export interface ShelterDetail {
  careRegNumber: string;
  careName: string;
  careTel: string;
  careAddress: string;
  latitude: number;
  longitude: number;
  regionName: string;
  subRegionName: string;
}

export interface Province {
  code: string;
  name: string;
}

export interface City {
  code: string;
  name: string;
  provinceCode: string;
}
