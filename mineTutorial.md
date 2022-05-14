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

4. Geth 초기화
> $ geth init --datadir node genesis.json

5. Geth 클라이언트 생성
> $ geth --datadir node --nodiscover --networkid 2022 --http --http.addr "본인IP주소" --http.port 30305 --allow-insecure-unlock console  

6. 채굴용 계좌 생성
> $ personal.newAccount(“<패스워드>”)

7. 메인 노드에 연동 및 확인
> $ admin.addPeer("enode://c4a4aedd2b0ca49ba9b08ebced9c0b1e09f2fc9e1c4fa1d6e786f56860178a52b6f67d573defca468ef374720cebb26350302ae1390e488c8f43aca6cb6cae2b@14.39.137.164:30303?discport=0")

> $ admin.peers -> 연결시 리스트 생성

8. 채굴시작 및 종료
> $ miner.start(<작업쓰레드개수>)

> $ miner.stop()

9. 획득 이더리움 확인
> $ eth.getBalance(eth.accounts[0])

10. Geth 종료
> $ exit

</br>

## Windows

1. 블록데이터 저장 폴더 생성

2. Geth(이더리움 네트워크) 설치 및 확인
> https://geth.ethereum.org/

3. genesis.json 파일 다운로드
> Blockchain 폴더 -> genesis.json 다운로드 -> 1번에서 생성한 폴더로 파일 이동

4. 1번에서 생성한 폴더에서 커맨드창 생성 (환경변수 사용하지 않음)

5. Geth 초기화
> $ geth init --datadir node genesis.json

5. Geth 클라이언트 생성
> $ geth --datadir node --nodiscover --networkid 2022 --http --http.addr "본인IP주소" --http.port 30305 --allow-insecure-unlock console  

6. 채굴용 계좌 생성
> $ personal.newAccount(“<패스워드>”)

7. 메인 노드에 연동 및 확인
> $ admin.addPeer("enode://c4a4aedd2b0ca49ba9b08ebced9c0b1e09f2fc9e1c4fa1d6e786f56860178a52b6f67d573defca468ef374720cebb26350302ae1390e488c8f43aca6cb6cae2b@14.39.137.164:30303?discport=0")
> $ admin.peers

8. 채굴시작 및 종료
> $ miner.start(<작업쓰레드개수>)

> $ miner.stop()

9. 획득 이더리움 확인
> $ eth.getBalance(eth.accounts[0])

10. Geth 종료
> $ exit
