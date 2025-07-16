export interface Shelter {
  careRegNumber: string;
  careName: string;
  careTel: string;
  regionName: string;
  subRegionName: string;
}

// 보호소 상세정보
export interface ShelterDetail {
  careName: string;
  careTel: string;
  careAddress: string;
  latitude: number;
  longitude: number;
  regionName: string;
  subRegionName: string;
}

export interface RegionDTO {
  regionName: string; // 시도 이름
}

export interface SubRegionDTO {
  subRegionName: string; // 시군구 이름
}