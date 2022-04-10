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

