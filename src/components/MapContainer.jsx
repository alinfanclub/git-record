import React, { useEffect } from "react";
import "./MapContainer.css";
export default function MapContainer() {
  const { kakao } = window;
  useEffect(() => {
    let mapContainer = document.getElementById("map"),
      mapOption = {
        center: new kakao.maps.LatLng(33.451475, 126.570528),
        level: 3,
      };

    let map = new kakao.maps.Map(mapContainer, mapOption);

    let marker = new kakao.maps.Marker({
      map: map,
      position: new kakao.maps.LatLng(33.450701, 126.573427),
      zIndex: 2,
    });

    kakao.maps.event.addListener(map, "click", function (mouseEvent) {
      let latlng = mouseEvent.latLng;
      marker.setPosition(latlng);
      overlay.setMap(null);
      localStorage.setItem("location", latlng);
    });

    kakao.maps.event.addListener(marker, "click", function () {
      const markerLocatin = marker.getPosition();
      overlay.setPosition(markerLocatin);
      overlay.setMap(map);
    });

    let content = `
      <div class="wrap">
        <div class="info">
          <div class="title">
            kakao
            <div class="close" title="닫기"></div>
          </div>
          <div class="body"> 
            <div class="img">
                <img src="https://cfile181.uf.daum.net/image/250649365602043421936D" width="73" height="70">
            </div> 
            <div class="desc"> 
                <div class="ellipsis">제주특별자치도 제주시 첨단로 242</div> 
                <div class="jibun ellipsis">(우) 63309 (지번) 영평동 2181</div> 
                <div><a href="https://www.kakaocorp.com/main" target="_blank" class="link">홈페이지</a></div> 
            </div> 
          </div>
        </div>
      </div>
    `;

    let overlay = new kakao.maps.CustomOverlay({
      content: content,
      map: map,
      position: marker.getPosition(),
      zIndex: 10,
      clickable: true,
    });

    const close = document.querySelectorAll(".close");

    close.forEach((element) => {
      element.addEventListener("click", function () {
        overlay.setMap(null);
      });
    });
    overlay.setMap(null);
  }, [kakao]);
  return (
    <div>
      <div
        id="map"
        style={{
          width: "1000px",
          height: "1000px",
        }}
      ></div>
    </div>
  );
}
