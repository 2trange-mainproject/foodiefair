// 마커를 클릭하면 장소명을 표출할 인포윈도우
let infowindow = new kakao.maps.InfoWindow({zIndex:1});
let latitude, longitude;
let map;

// 위치 정보를 가져오는데 성공했을 때 호출되는 함수
function successLocation(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  searchPlaces();
}

// 위치 정보를 가져오는데 실패했을 때 호출되는 함수
function errorLocation() {
  alert('위치 정보를 가져올 수 없습니다');
}

// 현재 위치 정보를 가져오는 함수
function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successLocation, errorLocation);
  } else {
    alert('이 브라우저에서는 Geolocation이 지원되지 않습니다');
  }
}

// 카카오맵 API 장소 검색 함수
function searchPlaces() {
  const mapContainer = document.getElementById('map');
  const mapOption = {
    center: new kakao.maps.LatLng(latitude, longitude),
    level: 5
  };

  // 지도 생성
  map = new kakao.maps.Map(mapContainer, mapOption);

  // 장소 검색 객체 생성
  const ps = new kakao.maps.services.Places(map);

  // 카테고리로 편의점 검색
  // {useMapBounds:true} : 지도 영역 내에서만 검색
  ps.categorySearch('CS2', placesSearchCB, {useMapBounds: true});
}
  // 키워드 검색 완료 시 호출되는 콜백함수
  function placesSearchCB(data, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {
      // 검색 결과 목록 출력
      for (let i = 0; i < data.length; i++) {
        displayMarker(data[i]);
      }
    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
      alert('검색 결과가 존재하지 않습니다');
      return;
    } else if (status === kakao.maps.services.Status.ERROR) {
      alert('검색 결과 중 오류가 발생했습니다');
      return;
    }
  }

// 지도에 마커를 표시하는 함수입니다
function displayMarker(place) {
  // 마커를 생성하고 지도에 표시합니다
  let marker = new kakao.maps.Marker({
    map: map,
    position: new kakao.maps.LatLng(place.y, place.x)
  });

  // 마커에 클릭이벤트를 등록합니다
  kakao.maps.event.addListener(marker, 'click', function() {
    // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
    infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
    infowindow.open(map, marker);
  });

  // 마커에 이벤트를 등록하는 함수 만들고 즉시 호출하여 클로저를 만듭니다
  // 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
  (function(marker, infowindow) {
    // 마커에 mouseover 이벤트를 등록하고 마우스 오버 시 인포윈도우를 표시합니다
    kakao.maps.event.addListener(marker, 'mouseover', function() {
      infowindow.open(map, marker);
    });

    // 마커에 mouseout 이벤트를 등록하고 마우스 아웃 시 인포윈도우를 닫습니다
    kakao.maps.event.addListener(marker, 'mouseout', function() {
      infowindow.close();
    });
  })(marker, infowindow);
}

// 페이지 로드 완료 시 현재 위치 정보 가져오기
window.onload = function () {
  getCurrentLocation();
};
