import axios from 'axios';

// 환경 변수로 baseURL 설정 (환경에 맞춰 변경 가능)
const instance = axios.create({
    baseURL: 'http://localhost:8080/api/v1',  // .env에서 읽어오거나 기본값 설정
    withCredentials: true, // 쿠키 등 인증 정보가 필요하다면
});

// 요청 인터셉터 (선택적)
instance.interceptors.request.use(
    (config) => {
        // 예: 인증 토큰을 헤더에 자동으로 추가하는 방법
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // 요청 오류 처리
        return Promise.reject(error);
    }
);

// 응답 인터셉터 (선택적)
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        // 응답 오류 처리
        if (error.response && error.response.status === 401) {
            // 예: 로그인 만료 시 처리
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default instance;