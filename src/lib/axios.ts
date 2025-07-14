import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8080/api/v1', // Spring Boot API 기본 주소
    withCredentials: true, // 쿠키 등 인증 정보가 필요하다면
});

export default instance;