| 채굴에 참여함으로써 얻는 보상은 없습니다.

</br>

## Mac OS, Ubuntu

1. Geth(이더리움 네트워크) 설치 및 확인
> $ brew install geth

> $ geth version

2. 블록데이터 저장 공간 생성
> $ mkdir blockchain_net

> $ cd blockchain_net

3. genesis.json 파일 다운로드
> 깃허브 저장소 -> genesis.json 다운로드 -> 2번에서 생성한 디렉토리로 파일 이동

4. automine.js 스크립트 다운로드
> 깃허브 저장소 -> automine.js 다운로드 -> 2번에서 생성한 디렉토리로 파일 이동
> pwd 후 파일 경로 저장

5. Geth 초기화
> $ geth init --datadir node genesis.json

6. Geth 클라이언트 실행
> $ geth --datadir node --nodiscover --networkid 2022 --http --http.addr "본인IP주소" --http.port 30305 --preload "<automine.js 파일경로>" console  

7. 채굴용 계좌 생성
> $ personal.newAccount(“<패스워드>”)

8. 메인 노드에 연동 및 확인
> $ admin.addPeer("enode://4055f124a7396b5646f43fb3dbaedfeff3cca082aadc5bca61a43f8aa1fcad25edf7febd291e9fd0fdd79154645a1b2ec63bb75fdfc16a20f43a773a075ddff0@222.110.152.194:30303?discport=0")

> $ admin.peers -> 연결시 리스트 생성됨

9. 채굴시작 및 종료
> $ miner.start(<작업쓰레드개수>)
> 트랜잭션 생성 시 자동으로 채굴됩니다.

> $ miner.stop()

10. 획득 이더리움 확인
> $ eth.getBalance(eth.coinbase)

11. Geth 종료
> $ exit

</br>

## Windows

1. 블록데이터 저장 폴더 생성

2. Geth(이더리움 네트워크) 설치 및 확인
> https://geth.ethereum.org/

3. genesis.json 파일 다운로드
> 깃허브 저장소 -> genesis.json 다운로드 -> 1번에서 생성한 폴더로 파일 이동

4. automine.json 스크립트 다운로드
> 깃허브 저장소 -> automine.js 다운로드 -> 1번에서 생성한 폴더로 파일 이동

5. 1번에서 생성한 폴더에서 커맨드창 생성 (환경변수 사용하지 않음)

6. Geth 초기화
> $ geth init --datadir node genesis.json

7. Geth 클라이언트 생성
> $ geth --datadir node --nodiscover --networkid 2022 --http --http.addr "본인IP주소" --http.port 30305 --preload "<automine.js 파일위치>" console  

8. 채굴용 계좌 생성
> $ personal.newAccount(“<패스워드>”)

9. 메인 노드에 연동 및 확인
> $ admin.addPeer("enode://4055f124a7396b5646f43fb3dbaedfeff3cca082aadc5bca61a43f8aa1fcad25edf7febd291e9fd0fdd79154645a1b2ec63bb75fdfc16a20f43a773a075ddff0@222.110.152.194:30303?discport=0")

> $ admin.peers -> 연결시 리스트 생성

10. 채굴시작 및 종료
> $ miner.start(<작업쓰레드개수>)
> 트랜잭션 생성 시 자동으로 채굴됩니다.

> $ miner.stop()

11. 획득 이더리움 확인
> $ eth.getBalance(eth.accounts[0])

12. Geth 종료
> $ exit
