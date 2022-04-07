# 국민을 국회로
<img width="400" alt="logo" src="https://ifh.cc/g/MSGhF8.png">

## 프로젝트 소개
### 💡 국민이 직접 참여하는 입법과정

국회의원은 더 나은 사회를 만들기 위해 국민을 대표해 법안을 만드는 역할을 하고 있습니다.
그러나 법안의 심사과정에서 국민들의 의견을 수집하는 창구가 본연의 기능을 상실했고 그 방식이 개선되지 않아 국민들의 참여율이 매우 저조합니다.
국민을 위한 법안을 만드는 과정에 국민들이 참여하기 어렵다는 것이다.

"국민을 국회로"는 현재 발의된 법안을 정리하고 여론형성의 도구를 사용자에게 제공함으로서 국민들의 권리를 보장하고자 합니다.

### Abstract
The fate of member of parliament is creating legislation on behalf of the people to make a better society.
However, in the process of reviewing the bill, the window for collecting and converging opinions from the public is not well-known. Furthermore, the method of collecting opinions is old-fashioned. In short, it is difficult for the people to participate in making bills even though bills are for the people.

The project aims to guarantee the people's suffrage by organizing the open bill proposals and providing a tool which forms public opinion.

</br>

## 소개 영상 링크

[![Video Label](https://user-images.githubusercontent.com/24891555/161373041-e14a691c-7c36-4e96-a95c-1ae679c534eb.png)](https://youtu.be/kUm5M0ekxXQ)

</br>

## 시스템 설계도
<img width="800" alt="system_structure" src="https://user-images.githubusercontent.com/24891555/161218670-38e50b23-3b82-4820-9347-f041003300b5.png">

</br>

## Prototype
<img width="180" alt="메인페이지" src="https://user-images.githubusercontent.com/24891555/161413555-bc01523e-cbdc-4fbb-8cec-a89b54a9acaa.png" align="left">
<img width="180" alt="발의법안페이지" src="https://user-images.githubusercontent.com/24891555/161413598-350a6150-3e4c-4aed-8318-fedd65f03d5d.png" align="left">
<img width="180" alt="상세보기페이지" src="https://user-images.githubusercontent.com/24891555/161413559-9425efea-9e27-476f-b3a1-b3f30edeb540.png" align="left">
<img width="180" alt="투표페이지" src="https://user-images.githubusercontent.com/24891555/161413561-5ba90913-d5c4-4833-ad59-21e9d83fe221.png">

</br>

## 프로젝트 기대효과
- 법안 모아보기를 통해 국민에게 편리성을 제공 <br/>
- 어플리케이션을 통해 사회취약계층에게 투표의 접근성을 제공 <br/>
- 투표 기능을 통해 국민들의 여론을 법안결정자에게 전달 <br/>
- 블록체인 기술을 통해 안전하고 신뢰할 수 있는 여론 제공 <br/>

</br>

## 팀 소개


|<img src="https://ifh.cc/g/J9csdn.jpg" width="250" height="250">|<img src="https://user-images.githubusercontent.com/24891555/160340738-9ab2ce92-001f-44a6-a4cf-e6c6597be2b4.jpeg" width="250">|<img src="https://user-images.githubusercontent.com/24891555/160343995-d313df3f-b252-4271-800e-4ff67111336f.jpg" width="250">|
|:--|:--|:--|
|이름: 김상윤 </br> 학번: ****3092 </br> Email: skwk50000@gmail.com </br> 역할 : 웹크롤링 API, 서버, DB|이름: 민태식 </br> 학번: ****3106 </br> Email: rth2443@kookmin.ac.kr </br> 역할 : 앱, UX, UI|이름: 안성열 </br> 학번: ****3121 </br> Email: zxcv123594@gmail.com </br> 역할 : 블록체인 API, 서버|

</br>

## 채굴 작업 참여

| 관리자의 AWS 서버 실행 후 가능합니다.

| 채굴에 참여함으로써 얻는 보상은 없습니다.

</br>

### Geth 클라이언트 이용

| Mac OS 기반으로 작성되었습니다.

1. Geth(이더리움 네트워크) 설치 및 확인
> $ brew install ethereum

> $ geth version

2. 블록데이터를 저장할 공간 생성 및 이동
> $ mkdir mine_directory

> $ cd mine_directory

3. genesis 파일 생성
> 깃허브 저장소의 genesis.json file download

> $ mv genesis.json ~/mine_directory

4. Geth 초기화 (port,bootnodes hash code는 추후 업데이트 될 예정입니다.)
> $ geth —datadir node —networkid 2022 —port 0000 —bootnodes “———————“ console

5. 채굴에 참여할 계정 생성
> $ personal.newAccount(“<패스워드>”)

6. 채굴시작 및 종료
> $ miner.start(<작업쓰레드개수>)

> $ miner.stop()

7. 획득 이더리움 확인
> $ eth.getBalance(eth.accounts[0])


### Ganache 플랫폼 이용

1. Ganache 다운로드

> https://trufflesuite.com/ganache/

2. Ganache 실행 

> QUICKSTART
<img width="800" alt="스크린샷 2022-04-06 오후 4 46 41" src="https://user-images.githubusercontent.com/24891555/161922974-b8d04a9c-dcad-4bb1-93b5-8416eedb158f.png">

3. 네트워크 설정

> 톱니바퀴 아이콘 -> 상단 Server -> HOSTNAME : 00.00.00.00 -> NETWORKID : 2022 -> AUTOMINE OFF -> RESTART

<img width="800" alt="스크린샷 2022-04-06 오후 4 44 08" src="https://user-images.githubusercontent.com/24891555/161923602-bbb4121f-287b-4f17-aa30-b7ac418eb175.png">
<img width="800" alt="스크린샷 2022-04-06 오후 4 44 19" src="https://user-images.githubusercontent.com/24891555/161923924-927bc25d-e80e-433e-9531-3bbddd0fe88b.png">




