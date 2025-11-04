import React, { useState } from 'react';
import axios from 'axios';
import './TsunamiPrediction.css';

const TsunamiPrediction = () => {
    // 1. 입력 폼 상태 관리
    const [inputs, setInputs] = useState({
        magnitude: '',
        depth: '',
        latitude: '',
        longitude: ''
    });

    // 2. API 응답 결과 및 오류 상태 관리
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { magnitude, depth, latitude, longitude } = inputs;

    // 입력 필드 값 변경 시 호출될 함수
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs({
            ...inputs,
            [name]: value
        });
    };

    // '예측' 버튼 클릭 시 호출될 함수
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        try {
            // 3. 로컬 스토리지에서 JWT 토큰 가져오기
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('로그인이 필요합니다. 먼저 로그인해주세요.');
            }

            // 4. 백엔드 API 호출
            const response = await axios.post(
                'http://localhost:8080/api/tsunami/predict',
                {
                    magnitude: parseFloat(magnitude),
                    depth: parseFloat(depth),
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude)
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // 헤더에 토큰 추가
                    }
                }
            );

            // 5. 결과 상태 업데이트
            console.log('Backend response:', response.data);
            setResult(response.data);

        } catch (err) {
            // 6. 오류 처리
            if (err.response) {
                setError(`서버 오류: ${err.response.status} - ${err.response.data.message || '알 수 없는 오류'}`);
            } else if (err.request) {
                setError('서버로부터 응답을 받을 수 없습니다. 백엔드 또는 플라스크 서버가 실행 중인지 확인하세요.');
            } else {
                setError(`요청 설정 중 오류 발생: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    // 확률이 50% 이상이면 위험하다고 판단하는 변수
    const isHighProbability = result && result.tsunami_probability >= 50.0;

    return (
        <div className="tsunami-container">
            <h2>실시간 쓰나미 예측</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">규모 (Magnitude) / 5.0 이상부터 입력</label>
                    <input className="form-input" type="number" name="magnitude" value={magnitude} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label className="form-label">깊이 (Depth):</label>
                    <input className="form-input" type="number" name="depth" value={depth} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label className="form-label">위도 (Latitude):</label>
                    <input className="form-input" type="number" name="latitude" value={latitude} onChange={handleChange} required step="any" />
                </div>
                <div className="form-group">
                    <label className="form-label">경도 (Longitude):</label>
                    <input className="form-input" type="number" name="longitude" value={longitude} onChange={handleChange} required step="any" />
                </div>
                <button type="submit" disabled={loading} className="submit-button">
                    {loading ? '예측 중...' : '예측'}
                </button>
            </form>

            {result && (
                <div className={`result-card ${isHighProbability ? 'high-prob' : 'low-prob'}`}>
                    <h3>
                        {isHighProbability ? '⚠️ 쓰나미 발생 가능성 높음' : '✅ 쓰나미 발생 가능성 낮음'}
                    </h3>
                    <p>
                        쓰나미 발생 확률: <strong>{(result.tsunami_probability).toFixed(2)}%</strong>
                    </p>
                    <p>
                        지진 발생 위치: <strong>{result.features.is_ocean === 1 ? '바다 (해양)' : '육지 (육상)'}</strong>
                    </p>
                    <p>
                        {/* is_steep_slope를 '유무' (0 또는 1)로 판단 */}
                        {result.features.is_steep_slope === 1
                            ? <>진앙 근처에 <strong>해저 급경사 존재</strong></>
                            : <>진앙 근처에 <strong>해저 급경사 없음</strong></>
                        }
                    </p>
                </div>
            )}

            {error && (
                <div className="error-card">
                    <h3>오류 발생</h3>
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
};

export default TsunamiPrediction;
