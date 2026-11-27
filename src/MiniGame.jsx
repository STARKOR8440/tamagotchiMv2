import React, { useState, useEffect } from 'react';
import { sfx } from './sound';

const GAME_TYPES = ['CATCH', 'HIGHLOW', 'WHACK', 'MEMORY', 'RPS'];
const MEMORY_ICONS = ['🍎', '⭐', '💧'];
const MEMORY_TONES = [523, 659, 784];
const RPS_CHOICES = [
  { id: 'ROCK', icon: '✊', label: '바위' },
  { id: 'SCISSORS', icon: '✌️', label: '가위' },
  { id: 'PAPER', icon: '🖐️', label: '보' },
];

export default function MiniGame({ winStreak = 0, onFinish, onClose }) {
  const [gameType] = useState(
    () => GAME_TYPES[Math.floor(Math.random() * GAME_TYPES.length)]
  );

  // 1) 퍼펙트 캐치 상태 (노란 판정 영역 16%로 축소)
  const [cursorPos, setCursorPos] = useState(0);
  const [cursorDir, setCursorDir] = useState(1);

  // 2) 하이로우 숫자 예측 상태
  const [baseNum] = useState(() => Math.floor(Math.random() * 7) + 2); // 2~8

  // 3) 유령 팡팡 상태
  const [targetIdx, setTargetIdx] = useState(() => Math.floor(Math.random() * 6));
  const [isBomb, setIsBomb] = useState(false);
  const [hits, setHits] = useState(0);
  const [timeLeft, setTimeLeft] = useState(6);

  // 4) 3단계 기억력 램프 상태
  const [seq] = useState(() => [
    Math.floor(Math.random() * 3),
    Math.floor(Math.random() * 3),
    Math.floor(Math.random() * 3),
  ]);
  const [litIdx, setLitIdx] = useState(-1);
  const [isShowingSeq, setIsShowingSeq] = useState(true);
  const [userStep, setUserStep] = useState(0);

  // 5) 3판 2선승 가위바위보 상태
  const [rpsScore, setRpsScore] = useState({ win: 0, lose: 0 });
  const [rpsStatus, setRpsStatus] = useState('무엇을 낼까?');

  useEffect(() => {
    if (gameType === 'CATCH') {
      const t = setInterval(() => {
        setCursorPos((p) => {
          if (p >= 92) {
            setCursorDir(-1);
            return 86;
          }
          if (p <= 0) {
            setCursorDir(1);
            return 6;
          }
          return p + cursorDir * 8;
        });
      }, 55);
      return () => clearInterval(t);
    }

    if (gameType === 'WHACK') {
      const moveTimer = setInterval(() => {
        setTargetIdx(Math.floor(Math.random() * 6));
        setIsBomb(Math.random() < 0.28);
      }, 750);

      const countdown = setInterval(() => {
        setTimeLeft((sec) => {
          if (sec <= 1) {
            clearInterval(moveTimer);
            clearInterval(countdown);
            finishGame(false, '시간 초과!');
            return 0;
          }
          return sec - 1;
        });
      }, 1000);

      return () => {
        clearInterval(moveTimer);
        clearInterval(countdown);
      };
    }

    if (gameType === 'MEMORY') {
      const timers = [];
      seq.forEach((btnIdx, step) => {
        timers.push(
          setTimeout(() => {
            setLitIdx(btnIdx);
            sfx.playTone(MEMORY_TONES[btnIdx], 0.14, 'square', 0);
          }, 350 + step * 550)
        );
        timers.push(
          setTimeout(() => {
            setLitIdx(-1);
          }, 700 + step * 550)
        );
      });
      timers.push(
        setTimeout(() => {
          setIsShowingSeq(false);
        }, 350 + seq.length * 550)
      );
      return () => timers.forEach(clearTimeout);
    }
  }, [gameType, cursorDir, seq]);

  const finishGame = (isWin, label) => {
    if (isWin) {
      sfx.win();
      const nextStreak = winStreak + 1;
      const isStreakBonus = nextStreak >= 3;
      const coins = isStreakBonus ? 30 : 15;
      const bonusWins = isStreakBonus ? 2 : 1;
      onFinish(
        25,
        isStreakBonus ? `${label} (${nextStreak}연승! 승+2)` : label,
        coins,
        bonusWins,
        true
      );
    } else {
      sfx.beep();
      onFinish(10, label, 5, 0, false);
    }
  };

  // 1) 퍼펙트 캐치 UI (노란 성공 존 42% ~ 58%로 축소)
  if (gameType === 'CATCH') {
    const handleStop = (e) => {
      e.stopPropagation();
      const cursorCenter = cursorPos + 4;
      const isHit = cursorCenter >= 42 && cursorCenter <= 58;
      finishGame(isHit, isHit ? '퍼펙트 캐치!' : '아깝다!');
    };

    return (
      <div style={wrapStyle}>
        <div style={titleStyle}>[퍼펙트 캐치]</div>
        <div style={{ fontSize: '7.5px' }}>좁은 노란 칸에 정확히 멈춰라!</div>
        <div
          style={{
            width: '92%',
            height: '14px',
            border: '1.5px solid #1e293b',
            borderRadius: '4px',
            position: 'relative',
            background: 'rgba(255,255,255,0.45)',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', left: '42%', width: '16%', height: '100%', background: '#facc15' }} />
          <div style={{ position: 'absolute', left: `${cursorPos}%`, width: '8%', height: '100%', background: '#ef4444' }} />
        </div>
        <div style={{ display: 'flex', gap: '4px', width: '92%' }}>
          <button onClick={handleStop} style={btnStyle}>🎯 멈춤!</button>
          <button onClick={onClose} style={subBtnStyle}>닫기</button>
        </div>
      </div>
    );
  }

  // 2) 하이로우 숫자 예측 UI
  if (gameType === 'HIGHLOW') {
    const handleGuess = (guessHigh) => {
      let nextNum = Math.floor(Math.random() * 9) + 1;
      if (nextNum === baseNum) nextNum = baseNum < 5 ? baseNum + 1 : baseNum - 1;
      const isWin = guessHigh ? nextNum > baseNum : nextNum < baseNum;
      finishGame(isWin, `${baseNum}→${nextNum} ${isWin ? '적중!' : '실패!'}`);
    };

    return (
      <div style={wrapStyle}>
        <div style={titleStyle}>[하이 & 로우]</div>
        <div style={{ fontSize: '13px', fontWeight: '900' }}>기준: {baseNum} vs ?</div>
        <div style={{ display: 'flex', gap: '4px', width: '94%' }}>
          <button onClick={() => handleGuess(true)} style={btnStyle}>▲ 크다</button>
          <button onClick={() => handleGuess(false)} style={btnStyle}>▼ 작다</button>
        </div>
      </div>
    );
  }

  // 3) 유령 팡팡 UI
  if (gameType === 'WHACK') {
    const handleCellClick = (e, idx) => {
      e.stopPropagation();
      if (idx !== targetIdx) return;

      if (isBomb) {
        finishGame(false, '폭탄 터졌다! 💥');
        return;
      }

      sfx.eat();
      const nextHits = hits + 1;
      if (nextHits >= 3) {
        finishGame(true, '유령 퇴치 완료!');
      } else {
        setHits(nextHits);
        setTargetIdx((prev) => (prev + 2) % 6);
      }
    };

    return (
      <div style={wrapStyle}>
        <div style={{ width: '94%', display: 'flex', justifyContent: 'space-between', fontSize: '8px', fontWeight: '900' }}>
          <span>[유령팡팡 {hits}/3]</span>
          <span>⏱{timeLeft}s</span>
        </div>
        <div
          style={{
            width: '94%',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '3px',
          }}
        >
          {[0, 1, 2, 3, 4, 5].map((idx) => {
            const active = idx === targetIdx;
            return (
              <button
                key={idx}
                onClick={(e) => handleCellClick(e, idx)}
                style={{
                  height: '22px',
                  background: active ? 'rgba(255,255,255,0.85)' : 'rgba(15,23,42,0.12)',
                  border: '1px solid #1e293b',
                  borderRadius: '4px',
                  fontSize: '12px',
                  padding: 0,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {active ? (isBomb ? '💣' : '👻') : '·'}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // 4) 3단계 기억력 램프 UI
  if (gameType === 'MEMORY') {
    const handleMemoryPress = (e, idx) => {
      e.stopPropagation();
      if (isShowingSeq) return;

      sfx.playTone(MEMORY_TONES[idx], 0.12, 'square', 0);
      setLitIdx(idx);
      setTimeout(() => setLitIdx(-1), 160);

      if (seq[userStep] !== idx) {
        finishGame(false, '순서가 틀렸어!');
        return;
      }

      const nextStep = userStep + 1;
      if (nextStep >= seq.length) {
        finishGame(true, '기억력 천재!');
      } else {
        setUserStep(nextStep);
      }
    };

    return (
      <div style={wrapStyle}>
        <div style={titleStyle}>[기억력 램프 {userStep}/3]</div>
        <div style={{ fontSize: '7.5px' }}>
          {isShowingSeq ? '순서를 잘 기억해! 👀' : '순서대로 눌러봐! 👆'}
        </div>
        <div style={{ display: 'flex', gap: '5px', width: '92%', justifyContent: 'center' }}>
          {MEMORY_ICONS.map((icon, idx) => {
            const isLit = litIdx === idx;
            return (
              <button
                key={idx}
                onClick={(e) => handleMemoryPress(e, idx)}
                style={{
                  flex: 1,
                  height: '28px',
                  background: isLit ? '#facc15' : 'rgba(255,255,255,0.55)',
                  border: isLit ? '2px solid #dc2626' : '1.5px solid #1e293b',
                  borderRadius: '6px',
                  fontSize: '13px',
                  transform: isLit ? 'scale(1.08)' : 'scale(1)',
                  transition: 'all 0.1s',
                  cursor: isShowingSeq ? 'default' : 'pointer',
                  padding: 0,
                }}
              >
                {icon}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // 5) 3판 2선승 가위바위보 UI
  const handleRpsPlay = (e, myId) => {
    e.stopPropagation();
    const cpu = RPS_CHOICES[Math.floor(Math.random() * 3)];
    if (myId === cpu.id) {
      sfx.beep();
      setRpsStatus(`상대 ${cpu.icon} 비김! 다시!`);
      return;
    }

    const isRoundWin =
      (myId === 'ROCK' && cpu.id === 'SCISSORS') ||
      (myId === 'SCISSORS' && cpu.id === 'PAPER') ||
      (myId === 'PAPER' && cpu.id === 'ROCK');

    if (isRoundWin) {
      sfx.eat();
      const nextWin = rpsScore.win + 1;
      if (nextWin >= 2) {
        finishGame(true, `상대 ${cpu.icon} 2승 승리!`);
      } else {
        setRpsScore({ ...rpsScore, win: nextWin });
        setRpsStatus(`상대 ${cpu.icon} 승! (1승 더!)`);
      }
    } else {
      sfx.beep();
      const nextLose = rpsScore.lose + 1;
      if (nextLose >= 2) {
        finishGame(false, `상대 ${cpu.icon} 2패 아쉽!`);
      } else {
        setRpsScore({ ...rpsScore, lose: nextLose });
        setRpsStatus(`상대 ${cpu.icon} 패.. 힘내!`);
      }
    }
  };

  return (
    <div style={wrapStyle}>
      <div style={titleStyle}>
        [가위바위보 {rpsScore.win}승:{rpsScore.lose}패]
      </div>
      <div style={{ fontSize: '7.8px', fontWeight: 'bold' }}>{rpsStatus}</div>
      <div style={{ display: 'flex', gap: '4px', width: '94%' }}>
        {RPS_CHOICES.map((c) => (
          <button
            key={c.id}
            onClick={(e) => handleRpsPlay(e, c.id)}
            style={{
              flex: 1,
              height: '26px',
              background: 'rgba(255,255,255,0.65)',
              border: '1.5px solid #1e293b',
              borderRadius: '5px',
              fontSize: '12px',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            {c.icon}
          </button>
        ))}
      </div>
    </div>
  );
}

const wrapStyle = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px',
  color: '#0f172a',
};

const titleStyle = {
  fontSize: '9px',
  fontWeight: '900',
};

const btnStyle = {
  flex: 1,
  background: '#1e293b',
  color: '#f8fafc',
  border: 'none',
  borderRadius: '4px',
  padding: '3px 4px',
  fontSize: '8.5px',
  fontWeight: 'bold',
  cursor: 'pointer',
};

const subBtnStyle = {
  background: 'rgba(15,23,42,0.15)',
  color: '#0f172a',
  border: '1px solid #334155',
  borderRadius: '4px',
  padding: '3px 6px',
  fontSize: '8px',
  cursor: 'pointer',
};