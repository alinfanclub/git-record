import React from 'react';
import { AiFillCloseCircle } from "react-icons/ai";
export default function WelcomePop({closeModal}) {
  return (
    <>
     <div className="w-full h-full fixed top-0 left-0 bg-black/50 flex items-center justify-center z-50">
          <div className="w-5/6 sm:w-1/5 h-auto bg-white aspect-video relative p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <h4 className="text-base text-lg">공지 사항</h4>
              <AiFillCloseCircle
                onClick={closeModal}
                className="cursor-pointer text-3xl"
              />
            </div>
            <div className="popup_text text-center flex flex-col h-full justify-center text-sm text-xs">
              <p>안녕하세요, 부스러기입니다.</p>
              <p>
                부스러기는 주로 시, 시각 예술을 수집하고 공유하는 사이트입니다.
              </p>
              <small>댓글 및 추가 기능은 개발 중입니다 ^^</small>
              <small>패치 예정 : 에디터 변경</small>
            </div>
          </div>
        </div> 
    </>
  );
}

