let latitude, longitude;
let markers = []; //마커를 담을 배열

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

// 검색 결과 목록을 표출하는 함수
function displayPlaces(places) {
  const listEl = document.getElementById('placesList');
  let bounds = new kakao.maps.LatLngBounds();

  for (let i = 0; i < places.length; i++) {
    // 마커 생성
    let marker = new kakao.maps.Marker({
      map: map,
      position: new kakao.maps.LatLng(places[i].y, places[i].x)
    });

    // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기 위해 LatLngBounds 객체에 좌표 추가
    bounds.extend(new kakao.maps.LatLng(places[i].y, places[i].x));

    // 장소명과 주소 정보를 가지고 있는 div 엘리먼트 생성
    let itemEl = `<li class="item">
                        <span class="title">${places[i].place_name}</span>
                        <span class="address">${places[i].address_name}</span>
                      </li>`;

    // 검색 결과 목록 엘리먼트 추가
    listEl.innerHTML += itemEl;
  }

  // 검색된 장소 위치를 기준으로 지도 범위 재설정
  map.setBounds(bounds);
}

// 카카오맵 API 장소 검색 함수
function searchPlaces() {
  const mapContainer = document.getElementById('map');
  const mapOption = {
    center: new kakao.maps.LatLng(latitude, longitude),
    level: 3
  };

  // 지도 생성
  const map = new kakao.maps.Map(mapContainer, mapOption);

  // 장소 검색 서비스 생성
  const ps = new kakao.maps.services.Places();

  // 검색 요청
  ps.keywordSearch('편의점', function (data, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {
      // 검색 결과 목록 출력
      displayPlaces(data);
    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
      alert('검색 결과가 존재하지 않습니다');
      return;
    } else if (status === kakao.maps.services.Status.ERROR) {
      alert('검색 결과 중 오류가 발생했습니다');
      return;
    }
  }, {
    location: new kakao.maps.LatLng(latitude, longitude),
    radius: 2000
  });
}

// 페이지 로드 완료 시 현재 위치 정보 가져오기
window.onload = function () {
  getCurrentLocation();
};