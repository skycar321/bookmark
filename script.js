/**
 * SQMS 북마크 메인 스크립트
 * 
 * 이 파일은 SQMS 북마크의 주요 기능을 담당하는 JavaScript 파일입니다.
 * - 탭 전환 기능
 * - 테마 변경 기능
 * - 그라데이션 토글 기능
 * - 게임 기능 (주사위, 룰렛)
 */

document.addEventListener('DOMContentLoaded', async () => {
    // 룰렛 게임 전역 변수들
    let rouletteCanvas = null;
    let rouletteCtx = null;
    let rouletteOptions = ['옵션1', '옵션2', '옵션3', '옵션4'];
    let rouletteRotation = Math.PI / rouletteOptions.length;
    let isRouletteSpinning = false;
    let optionInputs = null;
    let optionCount = null;

    // =========================================
    // 탭 전환 기능
    // =========================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const sections = document.querySelectorAll('.bookmark-section');

    // 초기 상태 설정 - 개발 섹션을 기본으로 표시
    document.getElementById('dev-section').classList.add('active');

    // 탭 버튼 클릭 이벤트 처리
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 모든 탭 비활성화
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // 클릭된 탭 활성화
            button.classList.add('active');

            // 모든 섹션 숨기기
            sections.forEach(section => section.classList.remove('active'));
            
            // 선택된 탭에 해당하는 섹션 표시
            const targetSection = document.getElementById(`${button.dataset.tab}-section`);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });

    // =========================================
    // 테마 변경 기능
    // =========================================
    const themeButtons = document.querySelectorAll('.theme-btn');
    const html = document.documentElement;

    // 저장된 테마 불러오기
    const savedTheme = localStorage.getItem('theme') || 'default';
    html.setAttribute('data-theme', savedTheme);
    
    // 테마 버튼 상태 업데이트
    themeButtons.forEach(btn => {
        if (btn.dataset.theme === savedTheme) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // 테마 버튼 클릭 이벤트 처리
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            themeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const theme = button.dataset.theme;
            html.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        });
    });

    // =========================================
    // 게임 모달 기능
    // =========================================
    const modal = document.getElementById('gameModal');
    const gameIcon = document.querySelector('.game-icon');
    const closeBtn = modal.querySelector('.close-btn');
    const gameButtons = modal.querySelectorAll('.game-btn');
    const gameContainer = modal.querySelector('.game-container');

    // 게임 아이콘 클릭 시 모달 열기
    gameIcon.addEventListener('click', () => {
        modal.classList.add('active');
        loadGame('dice'); // 기본값: 주사위 게임
    });

    // 모달 닫기 이벤트
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });

    // 게임 선택 이벤트
    gameButtons.forEach(button => {
        button.addEventListener('click', () => {
            gameButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            loadGame(button.dataset.game);
        });
    });

    // =========================================
    // 그라데이션 토글 기능
    // =========================================
    const gradientToggle = document.getElementById('gradientToggle');
    const bookmarkCards = document.querySelectorAll('.bookmark-card');

    // 저장된 그라데이션 설정 불러오기
    const isGradientEnabled = localStorage.getItem('gradientEnabled') === 'true';
    if (isGradientEnabled) {
        gradientToggle.classList.add('active');
        bookmarkCards.forEach(card => card.classList.add('gradient-enabled'));
    }

    // 그라데이션 토글 이벤트
    gradientToggle.addEventListener('click', function() {
        // 현재 상태 확인
        const isEnabled = this.classList.contains('active');
        
        // 토글 상태 변경
        this.classList.toggle('active');
        
        // 북마크 카드에 그라데이션 적용/제거
        bookmarkCards.forEach(card => {
            if (!isEnabled) {
                card.classList.add('gradient-enabled');
            } else {
                card.classList.remove('gradient-enabled');
            }
        });
        
        // 설정 저장
        localStorage.setItem('gradientEnabled', !isEnabled);
    });

    // =========================================
    // 게임 로드 함수
    // =========================================
    function loadGame(game) {
        const gameContainer = document.querySelector('.game-container');
        gameContainer.innerHTML = '';
        
        if (game === 'dice') {
                loadDiceGame();
        } else if (game === 'roulette') {
                loadRouletteGame();
        }
    }

    // =========================================
    // 주사위 게임 로드 함수
    // =========================================
    function loadDiceGame() {
        const diceGame = document.createElement('div');
        diceGame.className = 'dice-game active';
        diceGame.innerHTML = `
            <div class="game-header">
                <h3>🎲 주사위 게임</h3>
                <p>각 플레이어가 3개의 주사위를 굴려 합계를 겨루는 게임입니다.</p>
            </div>
            <div class="dice-content">
                <div class="dice-setup">
                    <div class="player-setup">
                        <div class="setup-header">
                            <h4>👥 참가자 설정</h4>
                        </div>
                        <div class="player-count-wrapper">
                            <label for="playerCountDice">참가자 수:</label>
                            <div class="number-input">
                                <button class="number-down">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <input type="number" class="game-input" id="playerCountDice" min="2" max="15" value="2">
                                <button class="number-up">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>
                        <div id="playerNames" class="player-names">
                            <div class="player-name-input">
                                <label>플레이어 1:</label>
                                <input type="text" class="game-input" placeholder="이름 입력">
                            </div>
                            <div class="player-name-input">
                                <label>플레이어 2:</label>
                                <input type="text" class="game-input" placeholder="이름 입력">
                            </div>
                        </div>
                        <button class="game-btn primary" id="startDiceGame">
                            <i class="fas fa-play"></i> 게임 시작
                        </button>
                    </div>
                </div>
                <div class="dice-container">
                    <div class="player-info">플레이어 1의 차례</div>
                    <div class="dice-controls">
                        <button class="dice-btn" id="rollOneDice">
                            <i class="fas fa-dice-one"></i> 하나씩 굴리기
                        </button>
                        <button class="dice-btn" id="rollAllDice">
                            <i class="fas fa-dice"></i> 한번에 굴리기
                        </button>
                    </div>
                    <div class="dice-grid">
                        <div class="dice" data-player="0">⚀</div>
                        <div class="dice" data-player="0">⚀</div>
                        <div class="dice" data-player="0">⚀</div>
                    </div>
                    <div class="dice-result"></div>
                </div>
            </div>
        `;
        gameContainer.appendChild(diceGame);

        // 이벤트 리스너 추가
        const playerCountInput = diceGame.querySelector('#playerCountDice');
        const playerNamesDiv = diceGame.querySelector('#playerNames');
        const startButton = diceGame.querySelector('#startDiceGame');
        const rollOneButton = diceGame.querySelector('#rollOneDice');
        const rollAllButton = diceGame.querySelector('#rollAllDice');
        const dices = diceGame.querySelectorAll('.dice');
        const playerInfo = diceGame.querySelector('.player-info');
        const resultsDiv = diceGame.querySelector('.dice-result');
        const numberDown = diceGame.querySelector('.number-down');
        const numberUp = diceGame.querySelector('.number-up');

        let currentPlayer = 1;
        let gameStarted = false;
        let players = [];

        // 주사위 기호 함수
        function getDiceSymbol(value) {
            const symbols = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
            return symbols[value - 1];
        }

        // 참가자 수 조절 버튼 이벤트
        numberDown.addEventListener('click', () => {
            let value = parseInt(playerCountInput.value);
            if (value > parseInt(playerCountInput.min)) {
                playerCountInput.value = value - 1;
                updatePlayerInputs();
            }
        });

        numberUp.addEventListener('click', () => {
            let value = parseInt(playerCountInput.value);
            if (value < parseInt(playerCountInput.max)) {
                playerCountInput.value = value + 1;
                updatePlayerInputs();
            }
        });

        // 참가자 수 변경 시 입력 필드 업데이트
        function updatePlayerInputs() {
            const count = parseInt(playerCountInput.value);
            playerNamesDiv.innerHTML = '';
            
            for (let i = 1; i <= count; i++) {
                const inputDiv = document.createElement('div');
                inputDiv.className = 'player-name-input';
                inputDiv.innerHTML = `
                    <label>플레이어 ${i}:</label>
                    <input type="text" class="game-input" placeholder="이름 입력">
                `;
                playerNamesDiv.appendChild(inputDiv);
            }
        }

        // 게임 시작 버튼 이벤트
        startButton.addEventListener('click', () => {
            if (!gameStarted) {
                // 게임 시작
                const playerInputs = playerNamesDiv.querySelectorAll('.game-input');
                players = Array.from(playerInputs).map(input => ({
                    name: input.value.trim() || `플레이어 ${Array.from(playerInputs).indexOf(input) + 1}`,
                    results: [0, 0, 0],
                    sum: 0
                }));
                
                if (players.length >= 2) {
                    gameStarted = true;
                    currentPlayer = 1;
                    playerInfo.textContent = `${players[currentPlayer - 1].name}의 차례`;
                    rollOneButton.disabled = false;
                    rollAllButton.disabled = false;
                    startButton.innerHTML = '<i class="fas fa-stop"></i> 게임 중지';
                    startButton.classList.add('active');
                    
                    // 입력 필드 비활성화
                    playerCountInput.disabled = true;
                    numberDown.disabled = true;
                    numberUp.disabled = true;
                    playerInputs.forEach(input => input.disabled = true);
                }
            } else {
                // 게임 중지
                gameStarted = false;
                startButton.innerHTML = '<i class="fas fa-play"></i> 게임 시작';
                startButton.classList.remove('active');
                rollOneButton.disabled = true;
                rollAllButton.disabled = true;
                
                // 입력 필드 활성화
                playerCountInput.disabled = false;
                numberDown.disabled = false;
                numberUp.disabled = false;
                playerInputs.forEach(input => input.disabled = false);
                
                // 주사위 초기화
                dices.forEach(dice => {
                    dice.textContent = '⚀';
                    dice.classList.remove('rolling', 'rolled');
                    dice.dataset.player = '0';
                });
                
                // 결과 초기화
                resultsDiv.innerHTML = '';
                players = [];
            }
        });

        // 주사위 굴리기 함수
        function rollDice(dice) {
            return new Promise(resolve => {
                dice.classList.add('rolling');
                setTimeout(() => {
                    const result = Math.floor(Math.random() * 6) + 1;
                    dice.textContent = getDiceSymbol(result);
                    dice.classList.remove('rolling');
                    dice.dataset.value = result;
                    
                    // 실시간 결과 업데이트
                    updateRealTimeResult();
                    
                    resolve(result);
                }, 1000);
            });
        }

        // 실시간 결과 업데이트 함수
        function updateRealTimeResult() {
            const diceValues = Array.from(dices).map(dice => parseInt(dice.dataset.value) || 0);
            const currentPlayerData = players[currentPlayer - 1];
            
            // 현재까지 굴린 주사위의 결과만 필터링
            const rolledResults = diceValues.filter(value => value > 0);
            
            if (rolledResults.length > 0) {
                // 결과 표시
                let resultsHTML = '<div class="all-results">';
                players.forEach((player, index) => {
                    if (index === currentPlayer - 1) {
                        // 현재 플레이어의 실시간 결과
                        resultsHTML += `
                            <div class="player-result-item current">
                                <span class="player-name">${player.name}</span>
                                <span class="dice-result">${rolledResults.join(' + ')}</span>
                            </div>
                        `;
                    } else if (player.results.some(r => r > 0)) {
                        // 다른 플레이어의 완료된 결과
                        resultsHTML += `
                            <div class="player-result-item">
                                <span class="player-name">${player.name}</span>
                                <span class="dice-result">${player.results.join(' + ')} = ${player.sum}</span>
                            </div>
                        `;
                    }
                });
                resultsHTML += '</div>';
                
                resultsDiv.innerHTML = resultsHTML;
            }
        }

        // 결과 표시 함수
        function showResults() {
            const resultDiv = document.querySelector('.dice-result');
            const diceValues = Array.from(dices).map(dice => parseInt(dice.dataset.value) || 0);
            const sum = diceValues.reduce((a, b) => a + b, 0);
            
            // 현재 플레이어의 결과를 저장
            players[currentPlayer - 1].results = diceValues;
            players[currentPlayer - 1].sum = sum;
            
            // 결과 표시
            let resultsHTML = '<div class="all-results">';
            players.forEach((player, index) => {
                if (player.results.some(r => r > 0)) {
                    const isCurrentPlayer = index === currentPlayer - 1;
                    resultsHTML += `
                        <div class="player-result-item ${isCurrentPlayer ? 'current' : ''}">
                            <span class="player-name">${player.name}</span>
                            <span class="dice-result">${player.results.join(' + ')} = ${player.sum}</span>
                        </div>
                    `;
                }
            });
            resultsHTML += '</div>';
            
            resultDiv.innerHTML = resultsHTML;
            
            // 모든 플레이어가 주사위를 굴렸는지 확인
            if (players.every(player => player.results.every(r => r > 0))) {
                // 최종 결과 팝업 표시
                showDiceGameResult(players);
                return;
            }
            
            // 2초 후에 다음 플레이어로 이동
            setTimeout(() => {
                // 다음 플레이어로 이동
                currentPlayer = currentPlayer % players.length + 1;
                playerInfo.textContent = `${players[currentPlayer - 1].name}의 차례`;
                
                // 주사위 초기화
                dices.forEach(dice => {
                    dice.textContent = '⚀';
                    dice.classList.remove('rolled');
                    dice.dataset.value = '';
                    dice.dataset.player = (currentPlayer - 1).toString();
                });
            }, 2000);
        }

        // 한번에 굴리기 버튼 이벤트
        rollAllButton.addEventListener('click', async () => {
            if (!gameStarted) return;
            
            // 아직 굴리지 않은 주사위만 선택
            const unrolledDices = Array.from(dices).filter(dice => !dice.classList.contains('rolled'));
            
            if (unrolledDices.length > 0) {
                const rollPromises = unrolledDices.map(dice => rollDice(dice));
                await Promise.all(rollPromises);
                
                // 모든 주사위를 rolled 상태로 변경
                unrolledDices.forEach(dice => dice.classList.add('rolled'));
                
                // 모든 주사위가 굴려졌는지 확인
                if (Array.from(dices).every(dice => dice.classList.contains('rolled'))) {
                    showResults();
                }
            }
        });

        // 하나씩 굴리기 버튼 이벤트
        rollOneButton.addEventListener('click', async () => {
            if (!gameStarted) return;
            
            const unrolledDice = Array.from(dices).find(dice => !dice.classList.contains('rolled'));
            if (unrolledDice) {
                await rollDice(unrolledDice);
                unrolledDice.classList.add('rolled');
                
                // 모든 주사위가 굴려졌는지 확인
                if (Array.from(dices).every(dice => dice.classList.contains('rolled'))) {
                    showResults();
                }
            }
        });

        return diceGame;
    }

    // =========================================
    // 주사위 결과 표시 함수
    // =========================================
    function showDiceGameResult(scores) {
        let resultHTML = '<div class="final-rankings">';
        resultHTML += '<h4>🎲 최종 순위</h4>';
        
        // 점수별로 플레이어 정렬 (내림차순)
        const sortedScores = [...scores].sort((a, b) => b.sum - a.sum);
        
        let currentRank = 1;
        let currentScore = null;
        let sameRankCount = 0;
        
        sortedScores.forEach((score, index) => {
            if (score.sum !== currentScore) {
                currentRank = index + 1 - sameRankCount;
                currentScore = score.sum;
                sameRankCount = 0;
            } else {
                sameRankCount++;
            }
            
            const isWinner = currentRank === 1;
            const isLoser = currentRank === scores.length;
            
            resultHTML += `
                <div class="ranking-item ${isWinner ? 'winner' : isLoser ? 'loser' : ''}">
                    <div class="rank-info">
                        <span class="rank">${currentRank}위</span>
                        ${isWinner ? '<span class="rank-icon">👑</span>' : isLoser ? '<span class="rank-icon">😢</span>' : ''}
                    </div>
                    <div class="player-result">
                        <span class="player-name">${score.name}</span>
                        <span class="dice-result">${score.results.join(' + ')} = ${score.sum}</span>
                    </div>
                </div>
            `;
        });
        
        resultHTML += '</div>';
        
        createResultPopup(resultHTML, 'dice');
        
        // 승자가 있을 경우 파티클 효과 추가
        if (sortedScores.length > 0) {
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    const x = Math.random() * window.innerWidth;
                    const y = Math.random() * window.innerHeight;
                    createFirework(x, y);
                }, i * 300);
            }
        }
    }

    // =========================================
    // 룰렛 게임 로드 함수
    // =========================================
    function loadRouletteGame() {
        const rouletteGame = document.createElement('div');
        rouletteGame.className = 'roulette-game active';
        rouletteGame.innerHTML = `
            <div class="game-header">
                <h3>🎡 룰렛 게임</h3>
                <p>원하는 항목을 입력하고 룰렛을 돌려보세요!</p>
            </div>
            <div class="roulette-content">
                <div class="roulette-setup">
                    <div class="option-count-wrapper">
                        <label>옵션 개수:</label>
                        <div class="number-input">
                            <button class="number-down">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="number" class="game-input" id="optionCount" min="2" max="15" value="4">
                            <button class="number-up">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    <div class="options-container">
                        <div id="optionInputs" class="option-inputs">
                            <div class="option-input-wrapper">
                                <label>옵션 1:</label>
                                <input type="text" class="game-input" placeholder="옵션1">
                            </div>
                            <div class="option-input-wrapper">
                                <label>옵션 2:</label>
                                <input type="text" class="game-input" placeholder="옵션2">
                            </div>
                            <div class="option-input-wrapper">
                                <label>옵션 3:</label>
                                <input type="text" class="game-input" placeholder="옵션3">
                            </div>
                            <div class="option-input-wrapper">
                                <label>옵션 4:</label>
                                <input type="text" class="game-input" placeholder="옵션4">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="roulette-main">
                    <div class="roulette-wheel-container">
                        <div class="roulette-pointer"></div>
                        <canvas id="rouletteCanvas"></canvas>
                    </div>
                    <button class="game-btn accent spin-btn" id="spinWheel">
                        <i class="fas fa-sync-alt"></i> 룰렛 돌리기
                    </button>
                    <div class="roulette-result"></div>
                </div>
            </div>
        `;
        gameContainer.appendChild(rouletteGame);

        // 변수 초기화
        rouletteCanvas = document.getElementById('rouletteCanvas');
        if (rouletteCanvas) {
            rouletteCtx = rouletteCanvas.getContext('2d');
        }
        optionCount = rouletteGame.querySelector('#optionCount');
        optionInputs = rouletteGame.querySelector('#optionInputs');
        const spinButton = rouletteGame.querySelector('#spinWheel');
        const resultDiv = rouletteGame.querySelector('.roulette-result');
        const numberDown = rouletteGame.querySelector('.number-down');
        const numberUp = rouletteGame.querySelector('.number-up');

        // 숫자 조절 버튼 이벤트
        numberDown.addEventListener('click', () => {
            const currentValue = parseInt(optionCount.value);
            if (currentValue > parseInt(optionCount.min)) {
                optionCount.value = currentValue - 1;
                updateRouletteOptions();
            }
        });

        numberUp.addEventListener('click', () => {
            const currentValue = parseInt(optionCount.value);
            if (currentValue < parseInt(optionCount.max)) {
                optionCount.value = currentValue + 1;
                updateRouletteOptions();
            }
        });

        // 이벤트 리스너 설정
        optionCount.addEventListener('change', updateRouletteOptions);
        spinButton.addEventListener('click', spinRouletteWheel);
        window.addEventListener('resize', resizeRouletteCanvas);

        // 초기 설정 (DOM이 완전히 로드된 후 실행)
        requestAnimationFrame(() => {
            if (rouletteCanvas && rouletteCtx) {
                updateRouletteOptions();
                resizeRouletteCanvas();
            }
        });
    }

    // =========================================
    // 결과 팝업 생성 함수
    // =========================================
    function createResultPopup(result, type) {
        // 기존 팝업이 있다면 제거
        const existingPopup = document.querySelector('.result-popup');
        if (existingPopup) {
            existingPopup.remove();
        }

        const popup = document.createElement('div');
        popup.className = 'result-popup';
        popup.style.position = 'fixed';
        popup.style.top = '0';
        popup.style.left = '0';
        popup.style.width = '100%';
        popup.style.height = '100%';
        popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        popup.style.display = 'flex';
        popup.style.justifyContent = 'center';
        popup.style.alignItems = 'center';
        popup.style.zIndex = '9999';
        
        const content = document.createElement('div');
        content.className = 'result-popup-content';
        content.style.backgroundColor = 'var(--card-bg, #2a2a2a)';
        content.style.padding = '30px';
        content.style.borderRadius = '16px';
        content.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.5)';
        content.style.minWidth = '300px';
        content.style.maxWidth = '90vw';
        content.style.color = 'var(--text-color, #ffffff)';
        content.style.position = 'relative';
        
        // 결과 내용 설정
        if (type === 'dice') {
            content.innerHTML = `
                <h3 style="color: var(--accent-color, #50e3c2); font-size: 24px; margin-bottom: 20px; text-align: center;">
                    🎲 주사위 게임 결과
                </h3>
                ${result}
                <button class="game-btn close-result" style="
                    width: 100%;
                    margin-top: 20px;
                    padding: 12px;
                    font-size: 16px;
                    font-weight: bold;
                    background: var(--accent-color, #50e3c2);
                    color: #ffffff;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                ">닫기</button>
            `;
        } else if (type === 'roulette') {
            content.innerHTML = `
                <h3 style="color: var(--accent-color, #50e3c2); font-size: 24px; margin-bottom: 20px; text-align: center;">
                    🎡 룰렛 게임 결과
                </h3>
                <div class="winner-announcement" style="
                    font-size: 20px;
                    text-align: center;
                    margin: 20px 0;
                    padding: 20px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                ">
                    🎉 당첨: ${result}
                </div>
                <button class="game-btn close-result" style="
                    width: 100%;
                    margin-top: 20px;
                    padding: 12px;
                    font-size: 16px;
                    font-weight: bold;
                    background: var(--accent-color, #50e3c2);
                    color: #ffffff;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                ">닫기</button>
            `;
        }
        
        popup.appendChild(content);
        document.body.appendChild(popup);
        
        // 파티클 효과 생성
        createFireworks();
        
        // 닫기 버튼 이벤트
        const closeButton = content.querySelector('.close-result');
        closeButton.addEventListener('click', () => {
            popup.remove();
        });
        
        // 팝업 외부 클릭 시 닫기
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.remove();
            }
        });
    }

    // =========================================
    // 파티클 효과 생성 함수
    // =========================================
    function createFireworks() {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight;
                
                for (let j = 0; j < 30; j++) {
                    const particle = document.createElement('div');
                    particle.style.position = 'fixed';
                    particle.style.left = x + 'px';
                    particle.style.top = y + 'px';
                    particle.style.width = '8px';
                    particle.style.height = '8px';
                    particle.style.borderRadius = '50%';
                    particle.style.backgroundColor = getRandomColor();
                    particle.style.zIndex = '10000';
                    document.body.appendChild(particle);
                    
                    const angle = (Math.PI * 2 * j) / 30;
                    const velocity = 3 + Math.random() * 3;
                    const distance = 100 + Math.random() * 100;
                    
                    particle.animate([
                        {
                            transform: 'translate(0, 0) scale(1)',
                            opacity: 1
                        },
                        {
                            transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
                            opacity: 0
                        }
                    ], {
                        duration: 1000,
                        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                        fill: 'forwards'
                    }).onfinish = () => particle.remove();
                }
            }, i * 300);
        }
    }

    // =========================================
    // 랜덤 색상 생성 함수
    // =========================================
    function getRandomColor() {
        const colors = [
            '#FF0000', '#00FF00', '#0000FF', 
            '#FFFF00', '#FF00FF', '#00FFFF',
            '#FFA500', '#FF69B4', '#7B68EE'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // =========================================
    // 룰렛 회전 함수 수정
    // =========================================
    function spinRouletteWheel() {
        if (!rouletteCtx || !optionInputs || isRouletteSpinning) return;
        isRouletteSpinning = true;

        const spinButton = document.getElementById('spinWheel');
        if (!spinButton) return;
        
        spinButton.disabled = true;

        rouletteOptions = Array.from(optionInputs.querySelectorAll('input')).map(input => 
            input.value.trim() || input.placeholder
        );

        // 랜덤성 강화: 최소 회전 수를 랜덤하게 설정
        const minSpins = 5 + Math.floor(Math.random() * 5); // 5~9바퀴
        const randomAngle = Math.random() * Math.PI * 2; // 0~360도 랜덤
        const additionalRotation = (Math.PI * 2 * minSpins) + randomAngle;
        
        // 회전 시작 시 항상 0도에서 시작하도록 수정
        rouletteRotation = 0;
        const totalRotation = additionalRotation;
        
        const startTime = performance.now();
        const spinDuration = 5000;

        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / spinDuration, 1);
            
            const easeOut = t => 1 - Math.pow(1 - t, 4); // 감속 효과 강화
            const currentRotation = rouletteRotation + (totalRotation - rouletteRotation) * easeOut(progress);
            
            drawRouletteWheel(rouletteCtx, rouletteOptions, currentRotation);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // 최종 회전각을 0~2π 범위로 정규화
                rouletteRotation = currentRotation % (Math.PI * 2);
                if (rouletteRotation < 0) rouletteRotation += Math.PI * 2;
                
                isRouletteSpinning = false;
                spinButton.disabled = false;

                // 결과 계산 로직 수정
                const anglePerOption = (Math.PI * 2) / rouletteOptions.length;
                
                // 12시 방향(위)을 기준으로 결과 계산
                // 회전 방향이 시계 방향이므로, 실제 선택된 영역은 반대 방향
                let selectedIndex = Math.floor(rouletteRotation / anglePerOption);
                selectedIndex = (rouletteOptions.length - selectedIndex - 1) % rouletteOptions.length;
                
                // 인덱스가 음수인 경우 보정
                if (selectedIndex < 0) selectedIndex += rouletteOptions.length;
                
                const selectedOption = rouletteOptions[selectedIndex];
                showRouletteGameResult(selectedOption);
            }
        }

        requestAnimationFrame(animate);
    }

    // 룰렛 옵션 업데이트 함수 수정
    function updateRouletteOptions() {
        if (!optionCount || !optionInputs || !rouletteCtx) return;
        
        const count = parseInt(optionCount.value);
        optionInputs.innerHTML = '';
        rouletteOptions = [];
        
        for (let i = 0; i < count; i++) {
            const div = document.createElement('div');
            div.className = 'option-input-wrapper';
            div.innerHTML = `
                <label>옵션 ${i + 1}:</label>
                <input type="text" class="game-input" placeholder="옵션${i + 1}" value="옵션${i + 1}">
            `;
            optionInputs.appendChild(div);
            rouletteOptions.push(`옵션${i + 1}`);
        }

        // 회전각 초기화 (12시 방향 시작)
        rouletteRotation = 0;
        
        const inputs = optionInputs.querySelectorAll('input');
        inputs.forEach((input, index) => {
            input.addEventListener('input', () => {
                rouletteOptions[index] = input.value.trim() || input.placeholder;
                drawRouletteWheel(rouletteCtx, rouletteOptions, rouletteRotation);
            });
        });

        // 옵션 변경 후 즉시 다시 그리기
        requestAnimationFrame(() => {
            drawRouletteWheel(rouletteCtx, rouletteOptions, rouletteRotation);
        });
    }

    // 룰렛 휠 그리기 함수 수정
    function drawRouletteWheel(ctx, options, currentRotation) {
        if (!ctx || !options || options.length === 0) return;
        
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const radius = Math.min(width, height) / 2;
        const center = { x: width / 2, y: height / 2 };
        const anglePerOption = (Math.PI * 2) / options.length;

        ctx.clearRect(0, 0, width, height);

        // 배경 원 그리기
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius - 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 시작 각도를 -90도(-Math.PI/2)로 설정하여 12시 방향부터 시작
        const startOffset = -Math.PI / 2;

        options.forEach((option, index) => {
            const startAngle = startOffset + index * anglePerOption + currentRotation;
            const endAngle = startOffset + (index + 1) * anglePerOption + currentRotation;

            ctx.beginPath();
            ctx.moveTo(center.x, center.y);
            ctx.arc(center.x, center.y, radius - 2, startAngle, endAngle);
            ctx.closePath();

            const gradient = ctx.createRadialGradient(
                center.x, center.y, 0,
                center.x, center.y, radius
            );

            const hue = (360 / options.length) * index;
            gradient.addColorStop(0, `hsla(${hue}, 80%, 65%, 0.9)`);
            gradient.addColorStop(0.5, `hsla(${hue}, 75%, 55%, 0.9)`);
            gradient.addColorStop(1, `hsla(${hue}, 70%, 45%, 0.9)`);

            ctx.fillStyle = gradient;
            ctx.fill();

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // 텍스트 그리기 개선
            ctx.save();
            ctx.translate(center.x, center.y);
            ctx.rotate(startAngle + anglePerOption / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 18px Arial';
            
            // 텍스트 테두리 효과 추가
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.lineWidth = 4;
            ctx.strokeText(option, radius - 30, 6);
            
            // 텍스트 그림자 효과
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.fillText(option, radius - 30, 6);
            
            ctx.restore();
        });

        // 중앙 원 그리기
        ctx.beginPath();
        ctx.arc(center.x, center.y, 20, 0, Math.PI * 2);
        const centerGradient = ctx.createRadialGradient(
            center.x, center.y, 0,
            center.x, center.y, 20
        );
        centerGradient.addColorStop(0, '#ffffff');
        centerGradient.addColorStop(1, '#e0e0e0');
        ctx.fillStyle = centerGradient;
        ctx.fill();
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 화살표 그리기 (12시 방향)
        ctx.save();
        ctx.translate(center.x, center.y - radius + 15);
        
        // 화살표 그림자
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        // 화살표 본체
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(-10, 10);
        ctx.lineTo(10, 10);
        ctx.closePath();
        ctx.fillStyle = '#ff4444';
        ctx.strokeStyle = '#cc0000';
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();
        
        ctx.restore();
    }

    // 룰렛 크기 조정 함수
    function resizeRouletteCanvas() {
        if (!rouletteCanvas || !rouletteCtx) return;
        
        const size = 400;
        rouletteCanvas.width = size;
        rouletteCanvas.height = size;
        drawRouletteWheel(rouletteCtx, rouletteOptions, rouletteRotation);
    }

    // 테마 선택기 토글 기능
    document.querySelector('.theme-toggle-btn').addEventListener('click', function() {
        const sidebar = this.closest('.sidebar');
        sidebar.classList.toggle('active');
    });

    // 테마 버튼 클릭 시 active 클래스 추가
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // 모든 테마 버튼에서 active 클래스 제거
            document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
            // 클릭된 버튼에 active 클래스 추가
            this.classList.add('active');
        });
    });

    // 룰렛 게임 결과 표시 함수
    function showRouletteGameResult(selectedOption) {
        // 결과 팝업 표시
        createResultPopup(selectedOption, 'roulette');
        
        // 결과 텍스트 표시
        const resultDiv = document.querySelector('.roulette-result');
        if (resultDiv) {
            resultDiv.innerHTML = `<div class="winner-announcement">🎉 결과: ${selectedOption}</div>`;
        }
    }
}); 