import React, { useEffect, useRef } from 'react'
import { KAKAO_JS_KEY } from "@/config/kakao";

declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoMapProps {
  latitude: number;
  longitude: number;
  address: string;
  name: string;
}

const KakaoMap: React.FC<KakaoMapProps> = ({ latitude, longitude, address, name }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('KakaoMap 컴포넌트 마운트됨:', { latitude, longitude, name });

    const initializeMap = () => {
      console.log('지도 초기화 시작');
      if (!mapRef.current) {
        console.error('mapRef.current가 없습니다');
        return;
      }

      if (!window.kakao || !window.kakao.maps) {
        console.error('카카오맵 API가 로드되지 않았습니다');
        return;
      }

      console.log('지도 생성 중...');
      
      try {
        const mapOption = {
          center: new window.kakao.maps.LatLng(latitude, longitude),
          level: 3
        };

        const map = new window.kakao.maps.Map(mapRef.current, mapOption);
        console.log('지도 생성 완료');

        // 마커 생성
        const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
        const marker = new window.kakao.maps.Marker({
          position: markerPosition
        });

        marker.setMap(map);
        console.log('마커 생성 완료');

        // 인포윈도우 생성
        const infowindow = new window.kakao.maps.InfoWindow({
          content: `
            <div style="padding:10px; min-width:200px;">
              <div style="font-weight:bold; margin-bottom:5px;">${name}</div>
              <div style="font-size:12px; color:#666;">${address}</div>
            </div>
          `
        });

        // 마커 클릭 시 인포윈도우 표시
        window.kakao.maps.event.addListener(marker, 'click', () => {
          infowindow.open(map, marker);
        });

        // 지도 타입 컨트롤 추가
        const mapTypeControl = new window.kakao.maps.MapTypeControl();
        map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);

        // 줌 컨트롤 추가
        const zoomControl = new window.kakao.maps.ZoomControl();
        map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);
        
        console.log('지도 초기화 완료');
      } catch (error) {
        console.error('지도 초기화 중 오류:', error);
      }
    };

    const loadKakaoMap = () => {
      console.log('카카오맵 로딩 시작');
      
      // 이미 스크립트가 로드되어 있는지 확인
      if (window.kakao && window.kakao.maps) {
        console.log('카카오맵 API 이미 로드됨');
        initializeMap();
        return;
      }

      // 기존 스크립트 확인
      const existingScript = document.querySelector('script[src*="dapi.kakao.com"]');
      
      if (existingScript) {
        console.log('카카오맵 스크립트 이미 존재, 로딩 대기중...');
        
        const checkKakaoLoaded = () => {
          if (window.kakao && window.kakao.maps) {
            console.log('카카오맵 API 로드 완료');
            initializeMap();
          } else {
            setTimeout(checkKakaoLoaded, 100);
          }
        };
        
        checkKakaoLoaded();
      } else {
        console.log('카카오맵 스크립트 새로 로드');
        
        const script = document.createElement('script');
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}&autoload=false`;
        script.type = 'text/javascript';
        
        script.onload = () => {
          console.log('카카오맵 스크립트 로드 성공');
          if (window.kakao && window.kakao.maps) {
            window.kakao.maps.load(() => {
              console.log('카카오맵 라이브러리 로드 완료');
              initializeMap();
            });
          }
        };
        
        script.onerror = (error) => {
          console.error('카카오맵 스크립트 로딩 실패:', error);
          console.error('API 키 또는 도메인 설정을 확인해주세요');
        };
        
        document.head.appendChild(script);
      }
    };

    // 컴포넌트 마운트 후 로딩 시작
    loadKakaoMap();
  }, [latitude, longitude, address, name]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-64 rounded-lg border border-yellow-300"
      style={{ minHeight: '256px' }}
    />
  );
};

export default KakaoMap;