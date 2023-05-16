// 마커를 담을 배열
let markers = [];
// 마커를 클릭하면 장소명을 표출할 인포윈도우
let infowindow = new kakao.maps.InfoWindow({zIndex: 1});

const options = {
    enableHighAccuracy: true, //정확도
    timeout: 5000,
    maximumAge: 0
};

// 위치 정보를 가져오는데 성공했을 때 호출되는 함수
function successLocation(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const mapContainer = document.getElementById('map');
    const mapOption = {
        center: new kakao.maps.LatLng(latitude, longitude),
        level: 1
    }

    // 지도 생성
    const map = new kakao.maps.Map(mapContainer, mapOption);

    // 장소 검색 객체 생성
    const ps = new kakao.maps.services.Places(map);
    // 카테고리로 편의점 검색
    ps.categorySearch('CS2', placesSearchCB, {
        location: new kakao.maps.LatLng(latitude, longitude)
    });

    // 편의점 분류한 후, 마커 목록 호출되는 콜백함수
    function placesSearchCB(data, status, pagination) {
        if (status === kakao.maps.services.Status.OK) {
            //다른 위치에서도 마커 표시
            let bounds = new kakao.maps.LatLngBounds();

            for (let i = 0; i < data.length; i++) {
                displayMarker(data[i]);
                bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
            }

            map.setBounds(bounds);

            let convenienceStores = {
                gs25: [],
                cu: [],
                emart24: [],
                sevenEleven: []
            };

            data.forEach(store => {
                const name = store.place_name.toLowerCase();
                if (name.includes('gs25')) {
                    convenienceStores.gs25.push(store);
                } else if (name.includes('cu')) {
                    convenienceStores.cu.push(store);
                } else if (name.includes('emart24') || name.includes('emart24')) {
                    convenienceStores.emart24.push(store);
                } else if (name.includes('7eleven') || name.includes('7-eleven') || name.includes('7-Eleven')) {
                    convenienceStores.sevenEleven.push(store);
                }
                const marker = displayMarker(store);
                store.marker = marker;
            });

            // 목록으로 분리
            addStoresToList(convenienceStores);

            //목록 하단 페이징
            displayPagination(pagination);

        } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
            alert('No search results exist');
            return;
        } else if (status === kakao.maps.services.Status.ERROR) {
            alert('There was an error in your search results');
            return;
        }
    }

    //목록에 편의점별 표시
    function addStoresToList(convenienceStores) {
        const markerList = document.getElementById('markerList');

        markerList.innerHTML = '';

        for (const category in convenienceStores) {
            const stores = convenienceStores[category];

            stores.forEach(store => {
                const listItem = document.createElement('li');

                //편의점별로 색상 다르게
                listItem.classList.add(`store-${category}`);

                const placeName = document.createElement('span');
                placeName.className = 'place_name';
                placeName.innerText = store.place_name;
                listItem.appendChild(placeName);
                //매장명 css
                placeName.classList.add('custom_placeName');

                const address = document.createElement('span');
                address.className = 'road_address_name';
                address.innerText = store.road_address_name;
                listItem.appendChild(address);
                //주소 css
                address.classList.add('custom_address');

                // markerList에 추가
                markerList.appendChild(listItem);

                const marker = store.marker;

                // 목록 클릭 시 마커에 표시
                listItem.addEventListener('click', function () {
                    kakao.maps.event.trigger(marker, 'click');
                });
            });
        }
    }


// 검색결과 목록 하단에 페이지번호를 표시는 함수
    function displayPagination(pagination) {
        let paginationEl = document.getElementById('pagination'),
            fragment = document.createDocumentFragment(),
            i;

        // 기존에 추가된 페이지번호를 삭제
        while (paginationEl.hasChildNodes()) {
            paginationEl.removeChild(paginationEl.lastChild);
        }

        for (i = 1; i <= pagination.last; i++) {
            let el = document.createElement('a');
            el.href = "#";
            el.innerHTML = i;

            if (i === pagination.current) {
                el.className = 'on';
            } else {
                el.onclick = (function (i) {
                    return function (e) {
                        e.preventDefault();
                        pagination.gotoPage(i);
                    }
                })(i);
            }
            fragment.appendChild(el);
        }
        paginationEl.appendChild(fragment);
    }

    function displayMarker(place) {
        const imageSrc = "../assets/images/stores-logo/location-icon.png",
            imageSize = new kakao.maps.Size(58, 61), // 마커이미지의 크기입니다
            imageOption = {offset: new kakao.maps.Point(27, 69)};

        const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption),
            markerPosition = position;

        let marker = new kakao.maps.Marker({
            map: map,
            position: new kakao.maps.LatLng(place.y, place.x),
            image: markerImage,
        });
        kakao.maps.event.addListener(marker, "click", function () {
            infowindow.setContent(
                '<div style="padding:5px;font-size:12px;">' + place.place_name + "</div>",
            );
            infowindow.open(map, marker);
        });
        return marker;
    }
};

// 위치 정보를 가져오는데 실패했을 때 호출되는 함수
function errorLocation(err) {
    alert('위치 정보를 가져올 수 없습니다\n기본 위치로 설정됩니다\n위치 재권한을 원하시면 수동으로 설정해주세요.');
    const defaultLatitude = 37.5665;
    const defaultLongitude = 126.9780;

    successLocation({
        coords: {
            latitude: defaultLatitude,
            longitude: defaultLongitude
        }
    });
}


// 현재 위치 정보를 가져오는 함수
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successLocation, errorLocation, options);
    } else {
        alert('이 브라우저에서는 Geolocation이 지원되지 않습니다');
    }
}

// 페이지 로드 완료 시 현재 위치 정보 가져오기
$(document).ready(function () {
    getCurrentLocation();
});
