import React from "react";
import BaseMapInput from "../../common/Basemap";

/**
 * WalkPathMapView
 * 게시글 상세 페이지에서 경로 데이터를 지도에 표시하는 보기 전용 컴포넌트
 *
 * props:
 * - routes: [{ address, orderNo }] 형식의 배열
 */
const WalkPathMapView = ({ routes = [] }) => {
  if (!routes || routes.length === 0) {
    return (
      <div className="text-center my-4">
        <p className="text-muted">등록된 산책 경로가 없습니다.</p>
      </div>
    );
  }

  // BaseMapInput에 맞게 데이터 변환
  const markersData = routes.map((route, idx) => ({
    address: route.address,
    label: `산책 장소 ${route.orderNo || idx + 1}`,
  }));

  return (
    <div className="my-4">
      <BaseMapInput markersData={markersData} mapHeight={400} />
    </div>
  );
};

export default WalkPathMapView;
