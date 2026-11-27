import React, { useState, useEffect, useMemo } from 'react';
import { FIREBASE_DB_URL, isFirebaseConfigured } from './firebaseConfig';
import {
  SPECIES,
  SECRET_BY_BIOME,
  resolveIrFusionSecret,
} from './evolutionTree';
import { sfx } from './sound';

const BIOME_INFO = {
  forest: { label: '숲', icon: '🌲', color: '#15803d', bg: '#dcfce7' },
  land: { label: '땅', icon: '⛰️', color: '#b45309', bg: '#fef3c7' },
  water: { label: '바다', icon: '🌊', color: '#0369a1', bg: '#e0f2fe' },
  sky: { label: '하늘', icon: '☁️', color: '#6d28d9', bg: '#ede9fe' },
};

const MAKE_ROOM_ID = (idA, idB) => [idA, idB].sort().join('__');

export default function PlazaModal({
  userId,
  nickname = '다마친구',
  avatarId = 'BABY_MARUTCHI',
  mySpeciesId = 'EGG',
  petCoins = 0,
  irBattleWinsToday = 0,
  irBattleDailyLimit = 5,
  onUpdateProfile,
  onSendGiftCoin,
  onWinBattleCoin,
  onFuseSecret,
  onClose,
}) {
  const [tab, setTab] = useState('CHAT'); // CHAT | USERS | IR
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [onlineUsers, setOnlineUsers] = useState({});
  const [editNick, setEditNick] = useState(nickname);

  // IR 1:1 대전 & 합성 상태
  const [selectedPartnerId, setSelectedPartnerId] = useState('');
  const [fusionRoomData, setFusionRoomData] = useState(null);
  const [fusionNotice, setFusionNotice] = useState('');
  const [battleRoundResult, setBattleRoundResult] = useState('');
  const [practicePartnerSpeciesId, setPracticePartnerSpeciesId] = useState('');

  const mySpec = SPECIES[mySpeciesId] || SPECIES.EGG;
  const isMyAdult = mySpec.stage === 'ADULT' && !mySpec.isSecretVariant;
  const myBiomeMeta = BIOME_INFO[mySpec.biome] || BIOME_INFO.land;

  const otherUsers = useMemo(() => {
    return Object.entries(onlineUsers || {})
      .filter(([uid]) => uid !== userId)
      .map(([uid, info]) => ({ userId: uid, ...info }));
  }, [onlineUsers, userId]);

  // 광장 접속자 하트비트 & 목록 동기화
  useEffect(() => {
    if (!isFirebaseConfigured() || !userId) return;

    const syncPresence = async () => {
      try {
        await fetch(`${FIREBASE_DB_URL}/plaza/users/${userId}.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nickname,
            avatarId,
            speciesId: mySpeciesId,
            updatedAt: Date.now(),
          }),
        });

        const res = await fetch(`${FIREBASE_DB_URL}/plaza/users.json`);
        const data = await res.json();
        if (data) {
          const now = Date.now();
          const active = {};
          Object.entries(data).forEach(([uid, u]) => {
            if (u && now - (u.updatedAt || 0) < 120000) {
              active[uid] = u;
            }
          });
          setOnlineUsers(active);
        }
      } catch {
        // 무시
      }
    };

    syncPresence();
    const timer = setInterval(syncPresence, 4000);
    return () => clearInterval(timer);
  }, [userId, nickname, avatarId, mySpeciesId]);

  // 채팅 메시지 폴링
  useEffect(() => {
    if (!isFirebaseConfigured()) return;

    const loadMessages = async () => {
      try {
        const res = await fetch(`${FIREBASE_DB_URL}/plaza/messages.json?orderBy="$key"&limitToLast=30`);
        const data = await res.json();
        if (!data) {
          setMessages([]);
          return;
        }
        const list = Object.entries(data).map(([id, m]) => ({ id, ...m }));
        setMessages(list);
      } catch {
        // 무시
      }
    };

    loadMessages();
    const msgTimer = setInterval(loadMessages, 2500);
    return () => clearInterval(msgTimer);
  }, []);

  // IR 1:1 합성 방 동기화
  useEffect(() => {
    if (!isFirebaseConfigured() || !userId || !selectedPartnerId) {
      setFusionRoomData(null);
      return;
    }

    const roomId = MAKE_ROOM_ID(userId, selectedPartnerId);

    const syncFusionRoom = async () => {
      try {
        // 내 현재 제시 성체 정보 갱신
        await fetch(`${FIREBASE_DB_URL}/plaza/fusions/${roomId}/slots/${userId}.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            nickname,
            speciesId: mySpeciesId,
            updatedAt: Date.now(),
          }),
        });

        const res = await fetch(`${FIREBASE_DB_URL}/plaza/fusions/${roomId}.json`);
        const room = await res.json();
        setFusionRoomData(room || null);
      } catch {
        // 무시
      }
    };

    syncFusionRoom();
    const roomTimer = setInterval(syncFusionRoom, 2000);
    return () => clearInterval(roomTimer);
  }, [userId, nickname, mySpeciesId, selectedPartnerId]);

  const sendChatMessage = async (e) => {
    e?.preventDefault();
    const trimmed = chatInput.trim();
    if (!trimmed) return;
    sfx.beep();
    setChatInput('');

    if (!isFirebaseConfigured()) {
      setMessages((prev) => [
        ...prev,
        { id: String(Date.now()), sender: nickname, text: trimmed, ts: Date.now() },
      ]);
      return;
    }

    try {
      await fetch(`${FIREBASE_DB_URL}/plaza/messages.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: userId,
          sender: nickname,
          text: trimmed,
          ts: Date.now(),
        }),
      });
    } catch {
      // 무시
    }
  };

  const sendGift = async (targetUser, giftType) => {
    const cost = giftType === 'COIN' ? 20 : 0;
    if (cost > 0 && petCoins < cost) {
      sfx.beep();
      alert('20🪙가 부족합니다!');
      return;
    }

    sfx.win();
    if (cost > 0) onSendGiftCoin?.(cost);

    if (!isFirebaseConfigured()) {
      alert(`[${targetUser.nickname}]님에게 선물을 보냈습니다!`);
      return;
    }

    try {
      await fetch(`${FIREBASE_DB_URL}/plaza/gifts/${targetUser.userId}.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: nickname,
          type: giftType,
          amount: giftType === 'COIN' ? 20 : 1,
          ts: Date.now(),
        }),
      });
      alert(`🎁 [${targetUser.nickname}]님에게 선물을 보냈습니다!`);
    } catch {
      alert('선물 전송 중 오류가 발생했습니다.');
    }
  };

  // IR 1:1 통신 가위바위보 대전
  const playIrBattle = (myChoice) => {
    const choices = ['SCISSORS', 'ROCK', 'PAPER'];
    const labelMap = { SCISSORS: '✌️가위', ROCK: '✊바위', PAPER: '🖐️보' };
    const cpuChoice = choices[Math.floor(Math.random() * choices.length)];

    if (myChoice === cpuChoice) {
      sfx.beep();
      setBattleRoundResult(`나 ${labelMap[myChoice]} vs 상대 ${labelMap[cpuChoice]} → 무승부!`);
      return;
    }

    const win =
      (myChoice === 'SCISSORS' && cpuChoice === 'PAPER') ||
      (myChoice === 'ROCK' && cpuChoice === 'SCISSORS') ||
      (myChoice === 'PAPER' && cpuChoice === 'ROCK');

    if (win) {
      setBattleRoundResult(`나 ${labelMap[myChoice]} vs 상대 ${labelMap[cpuChoice]} → 승리! 🎉`);
      onWinBattleCoin?.(30);
    } else {
      sfx.beep();
      setBattleRoundResult(`나 ${labelMap[myChoice]} vs 상대 ${labelMap[cpuChoice]} → 패배!`);
    }
  };

  // 실제 온라인 파트너 슬롯 정보 계산
  const partnerSlot = fusionRoomData?.slots?.[selectedPartnerId] || null;
  const partnerUserObj = otherUsers.find((u) => u.userId === selectedPartnerId) || null;
  const partnerSpeciesId =
    partnerSlot?.speciesId || partnerUserObj?.speciesId || practicePartnerSpeciesId || '';
  const partnerSpec = partnerSpeciesId ? SPECIES[partnerSpeciesId] : null;

  const secretCandidateId = resolveIrFusionSecret(mySpeciesId, partnerSpeciesId);
  const secretCandidateSpec = secretCandidateId ? SPECIES[secretCandidateId] : null;

  const myAgreed = Boolean(fusionRoomData?.agree?.[userId]);
  const partnerAgreed = selectedPartnerId
    ? Boolean(fusionRoomData?.agree?.[selectedPartnerId])
    : Boolean(practicePartnerSpeciesId);

  const handleConfirmFusion = async () => {
    if (!secretCandidateId || !secretCandidateSpec) {
      sfx.beep();
      setFusionNotice('같은 필드의 일반 성체 2종이 제시되어야 합성할 수 있습니다.');
      return;
    }

    // 1인 연습 파트너 합성 모드
    if (!selectedPartnerId && practicePartnerSpeciesId) {
      onFuseSecret?.(secretCandidateId);
      return;
    }

    // 온라인 1:1 합성 방 동의 처리
    const roomId = MAKE_ROOM_ID(userId, selectedPartnerId);
    try {
      await fetch(`${FIREBASE_DB_URL}/plaza/fusions/${roomId}/agree/${userId}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(true),
      });

      if (partnerAgreed) {
        await fetch(`${FIREBASE_DB_URL}/plaza/messages.json`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            isSystem: true,
            text: `🧬 [${nickname}]님과 [${partnerUserObj?.nickname || '파트너'}]님의 ${myBiomeMeta.label} 성체 합성으로 시크릿 [${secretCandidateSpec.name}] 탄생!`,
            ts: Date.now(),
          }),
        });
        await fetch(`${FIREBASE_DB_URL}/plaza/fusions/${roomId}.json`, { method: 'DELETE' });
        onFuseSecret?.(secretCandidateId);
      } else {
        sfx.confirm();
        setFusionNotice('내 성체 제시 완료! 상대방이 [시크릿 합성 동의]를 누르면 즉시 발동합니다.');
      }
    } catch {
      setFusionNotice('합성 통신 중 오류가 발생했습니다.');
    }
  };

  // 상대방이 먼저 합성을 완료해 방이 삭제되었거나 동의가 모두 충족된 경우 자동 반영
  useEffect(() => {
    if (!selectedPartnerId || !myAgreed || !secretCandidateId) return;
    if (partnerAgreed) {
      const roomId = MAKE_ROOM_ID(userId, selectedPartnerId);
      fetch(`${FIREBASE_DB_URL}/plaza/fusions/${roomId}.json`, { method: 'DELETE' }).catch(() => {});
      onFuseSecret?.(secretCandidateId);
    }
  }, [selectedPartnerId, myAgreed, partnerAgreed, secretCandidateId, userId, onFuseSecret]);

  // 1인 테스트용 동일 필드 파트너 성체 찾기
  const spawnSameBiomePracticePartner = () => {
    if (!isMyAdult) {
      sfx.beep();
      setFusionNotice('먼저 내 캐릭터가 성체 단계여야 합성을 테스트할 수 있습니다.');
      return;
    }
    const sameBiomeAdult = Object.values(SPECIES).find(
      (sp) =>
        sp.stage === 'ADULT' &&
        !sp.isSecretVariant &&
        sp.biome === mySpec.biome &&
        sp.id !== mySpeciesId
    );
    if (sameBiomeAdult) {
      sfx.confirm();
      setSelectedPartnerId('');
      setPracticePartnerSpeciesId(sameBiomeAdult.id);
      setFusionNotice('');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.72)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '430px',
          maxHeight: '86dvh',
          background: '#f8fafc',
          border: '2px solid #38bdf8',
          borderRadius: '18px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 18px 40px rgba(15, 23, 42, 0.35)',
        }}
      >
        {/* 상단 헤더 */}
        <div
          style={{
            background: 'linear-gradient(90deg, #0284c7 0%, #0369a1 100%)',
            color: '#ffffff',
            padding: '10px 14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ fontWeight: '900', fontSize: '14px' }}>
            📡 실시간 통신 광장 · {petCoins}🪙
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: '#ffffff',
              borderRadius: '8px',
              padding: '4px 9px',
              fontWeight: '900',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        {/* 닉네임 변경 바 */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            padding: '8px 12px',
            background: '#e0f2fe',
            borderBottom: '1px solid #bae6fd',
          }}
        >
          <input
            value={editNick}
            onChange={(e) => setEditNick(e.target.value.slice(0, 10))}
            placeholder="닉네임"
            style={{
              flex: 1,
              border: '1px solid #7dd3fc',
              borderRadius: '8px',
              padding: '5px 8px',
              fontSize: '12px',
              fontWeight: '800',
            }}
          />
          <button
            onClick={() => {
              const clean = editNick.trim() || '다마친구';
              sfx.confirm();
              onUpdateProfile?.(clean, mySpeciesId !== 'EGG' ? mySpeciesId : avatarId);
            }}
            style={{
              background: '#0284c7',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '5px 10px',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            닉네임 저장
          </button>
        </div>

        {/* 탭 메뉴 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', background: '#f1f5f9', padding: '6px', gap: '6px' }}>
          {[
            { id: 'CHAT', label: '💬 광장채팅' },
            { id: 'USERS', label: `👥 접속자(${otherUsers.length})` },
            { id: 'IR', label: '🧬 IR 1:1·합성' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => {
                sfx.beep();
                setTab(t.id);
              }}
              style={{
                padding: '7px 4px',
                borderRadius: '9px',
                border: tab === t.id ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                background: tab === t.id ? '#0284c7' : '#ffffff',
                color: tab === t.id ? '#ffffff' : '#0f172a',
                fontSize: '12px',
                fontWeight: '900',
                cursor: 'pointer',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* 본문 영역 */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {tab === 'CHAT' && (
            <>
              <div
                style={{
                  flex: 1,
                  minHeight: '210px',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px',
                }}
              >
                {messages.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '12px', marginTop: '40px' }}>
                    아직 채팅 메시지가 없습니다. 첫 인사를 남겨보세요!
                  </div>
                ) : (
                  messages.map((m) => (
                    <div
                      key={m.id}
                      style={{
                        fontSize: '12px',
                        padding: '5px 8px',
                        borderRadius: '8px',
                        background: m.isSystem
                          ? '#fef3c7'
                          : m.senderId === userId
                          ? '#e0f2fe'
                          : '#f1f5f9',
                        color: '#0f172a',
                        fontWeight: m.isSystem ? '800' : '600',
                      }}
                    >
                      {!m.isSystem && <strong style={{ color: '#0369a1' }}>[{m.sender}] </strong>}
                      <span>{m.text}</span>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={sendChatMessage} style={{ display: 'flex', gap: '6px' }}>
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="광장 메시지 입력..."
                  style={{
                    flex: 1,
                    border: '1px solid #cbd5e1',
                    borderRadius: '9px',
                    padding: '8px 10px',
                    fontSize: '12.5px',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '9px',
                    padding: '0 14px',
                    fontWeight: '900',
                    fontSize: '12.5px',
                    cursor: 'pointer',
                  }}
                >
                  전송
                </button>
              </form>
            </>
          )}

          {tab === 'USERS' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {otherUsers.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#64748b', fontSize: '12.5px', padding: '30px 10px' }}>
                  현재 광장에 접속 중인 다른 친구가 없습니다.
                </div>
              ) : (
                otherUsers.map((u) => {
                  const uSpec = SPECIES[u.speciesId || u.avatarId] || SPECIES.BABY_MARUTCHI;
                  const bMeta = BIOME_INFO[uSpec.biome] || BIOME_INFO.land;
                  return (
                    <div
                      key={u.userId}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '11px',
                        padding: '8px 10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '900', color: '#0f172a' }}>
                          {u.nickname}
                        </div>
                        <div style={{ fontSize: '11px', fontWeight: '700', color: bMeta.color }}>
                          {bMeta.icon} {uSpec.name} ({uSpec.stageLabel})
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button onClick={() => sendGift(u, 'HEART')} style={miniGiftBtn}>
                          ❤️
                        </button>
                        <button onClick={() => sendGift(u, 'CAKE')} style={miniGiftBtn}>
                          🍰
                        </button>
                        <button onClick={() => sendGift(u, 'COIN')} style={miniGiftBtn}>
                          20🪙
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {tab === 'IR' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* 섹션 1: IR 1:1 필드 시크릿 합성 */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1.5px solid #a855f7',
                  borderRadius: '12px',
                  padding: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: '900', color: '#6b21a8' }}>
                    🧬 IR 1:1 필드 시크릿 합성
                  </span>
                  <span style={{ fontSize: '10.5px', fontWeight: '800', color: '#7e22ce' }}>
                    동일 필드 성체 2종 제시
                  </span>
                </div>

                {/* 파트너 선택 */}
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <select
                    value={selectedPartnerId}
                    onChange={(e) => {
                      setSelectedPartnerId(e.target.value);
                      setPracticePartnerSpeciesId('');
                      setFusionNotice('');
                    }}
                    style={{
                      flex: 1,
                      padding: '6px 8px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '12px',
                      fontWeight: '800',
                    }}
                  >
                    <option value="">-- 합성할 접속 유저 선택 --</option>
                    {otherUsers.map((u) => {
                      const sp = SPECIES[u.speciesId || u.avatarId] || SPECIES.BABY_MARUTCHI;
                      return (
                        <option key={u.userId} value={u.userId}>
                          {u.nickname} ({sp.name})
                        </option>
                      );
                    })}
                  </select>

                  <button
                    type="button"
                    onClick={spawnSameBiomePracticePartner}
                    style={{
                      background: '#f3e8ff',
                      border: '1px solid #c084fc',
                      color: '#6b21a8',
                      borderRadius: '8px',
                      padding: '6px 8px',
                      fontSize: '11px',
                      fontWeight: '900',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    연습파트너
                  </button>
                </div>

                {/* 제시된 성체 슬롯 2개 비교 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '6px', alignItems: 'center' }}>
                  <div
                    style={{
                      background: myBiomeMeta.bg,
                      border: `1px solid ${myBiomeMeta.color}`,
                      borderRadius: '9px',
                      padding: '7px',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '10px', fontWeight: '800', color: '#475569' }}>나 ({nickname})</div>
                    <div style={{ fontSize: '12px', fontWeight: '900', color: '#0f172a', marginTop: '2px' }}>
                      {myBiomeMeta.icon} {mySpec.name}
                    </div>
                    <div style={{ fontSize: '10px', fontWeight: '800', color: isMyAdult ? '#15803d' : '#dc2626' }}>
                      {isMyAdult ? '성체 제시 가능' : '성체 필요'}
                    </div>
                  </div>

                  <div style={{ fontSize: '16px', fontWeight: '900', color: '#7e22ce' }}>➕</div>

                  <div
                    style={{
                      background: partnerSpec ? (BIOME_INFO[partnerSpec.biome]?.bg || '#f1f5f9') : '#f1f5f9',
                      border: '1px solid #94a3b8',
                      borderRadius: '9px',
                      padding: '7px',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '10px', fontWeight: '800', color: '#475569' }}>
                      {selectedPartnerId ? partnerUserObj?.nickname || '파트너' : practicePartnerSpeciesId ? '연습 파트너' : '미선택'}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: '900', color: '#0f172a', marginTop: '2px' }}>
                      {partnerSpec
                        ? `${BIOME_INFO[partnerSpec.biome]?.icon || ''} ${partnerSpec.name}`
                        : '상대 성체 대기'}
                    </div>
                    <div style={{ fontSize: '10px', fontWeight: '800', color: partnerSpec?.stage === 'ADULT' ? '#15803d' : '#64748b' }}>
                      {partnerSpec ? partnerSpec.stageLabel : '-'}
                    </div>
                  </div>
                </div>

                {/* 합성 예측 결과 및 실행 버튼 */}
                <div
                  style={{
                    background: secretCandidateSpec ? '#faf5ff' : '#f8fafc',
                    border: '1px dashed #c084fc',
                    borderRadius: '8px',
                    padding: '6px 8px',
                    fontSize: '11.5px',
                    fontWeight: '800',
                    color: secretCandidateSpec ? '#6b21a8' : '#64748b',
                    textAlign: 'center',
                  }}
                >
                  {secretCandidateSpec
                    ? `✨ 합성 조건 충족! 출현 시크릿: ${myBiomeMeta.icon} ${secretCandidateSpec.name}`
                    : `숲→${SPECIES[SECRET_BY_BIOME.forest].name} · 땅→${SPECIES[SECRET_BY_BIOME.land].name} · 바다→${SPECIES[SECRET_BY_BIOME.water].name} · 하늘→${SPECIES[SECRET_BY_BIOME.sky].name}`}
                </div>

                {fusionNotice && (
                  <div style={{ fontSize: '11px', fontWeight: '800', color: '#b45309', textAlign: 'center' }}>
                    {fusionNotice}
                  </div>
                )}

                <button
                  type="button"
                  disabled={!secretCandidateSpec}
                  onClick={handleConfirmFusion}
                  style={{
                    width: '100%',
                    padding: '9px',
                    borderRadius: '9px',
                    border: 'none',
                    background: secretCandidateSpec
                      ? 'linear-gradient(90deg, #9333ea 0%, #6d28d9 100%)'
                      : '#cbd5e1',
                    color: '#ffffff',
                    fontSize: '12.5px',
                    fontWeight: '900',
                    cursor: secretCandidateSpec ? 'pointer' : 'not-allowed',
                  }}
                >
                  {secretCandidateSpec
                    ? `🧬 [${secretCandidateSpec.name}] 시크릿 합성 실행`
                    : '같은 필드의 성체 2종을 제시하세요'}
                </button>
              </div>

              {/* 섹션 2: IR 1:1 통신 대전 (특수 쉘 드랍) */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '7px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: '900', color: '#0f172a' }}>
                    ⚔️ IR 1:1 통신 대전 (승리 시 특수 쉘 드랍)
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#0284c7' }}>
                    오늘 {irBattleWinsToday}/{irBattleDailyLimit}승
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                  <button onClick={() => playIrBattle('SCISSORS')} style={battleBtnStyle}>
                    ✌️ 가위
                  </button>
                  <button onClick={() => playIrBattle('ROCK')} style={battleBtnStyle}>
                    ✊ 바위
                  </button>
                  <button onClick={() => playIrBattle('PAPER')} style={battleBtnStyle}>
                    🖐️ 보
                  </button>
                </div>

                {battleRoundResult && (
                  <div style={{ fontSize: '11.5px', fontWeight: '800', color: '#0369a1', textAlign: 'center' }}>
                    {battleRoundResult}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const miniGiftBtn = {
  background: '#f1f5f9',
  border: '1px solid #cbd5e1',
  borderRadius: '7px',
  padding: '4px 7px',
  fontSize: '11.5px',
  fontWeight: '800',
  cursor: 'pointer',
};

const battleBtnStyle = {
  background: '#e0f2fe',
  border: '1px solid #38bdf8',
  borderRadius: '8px',
  padding: '8px 4px',
  fontSize: '12px',
  fontWeight: '900',
  color: '#0369a1',
  cursor: 'pointer',
};
