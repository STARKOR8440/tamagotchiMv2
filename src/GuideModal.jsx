import React, { useState } from 'react';
import { sfx } from './sound';

const GUIDE_TABS = [
  { id: 'BASIC', label: '🎮 조작·육성' },
  { id: 'EVOLVE', label: '✨ 진화·시크릿' },
  { id: 'GAME', label: '🕹️ 게임·상점' },
  { id: 'PLAZA', label: '📡 광장·공유' },
];

export default function GuideModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('BASIC');

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.78)',
        backdropFilter: 'blur(5px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '14px',
        boxSizing: 'border-box',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '92dvh',
          background: '#ffffff',
          borderRadius: '26px',
          border: '3.5px solid #38bdf8',
          boxShadow: '0 24px 50px rgba(0, 0, 0, 0.45)',
          padding: '18px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          color: '#0f172a',
          userSelect: 'none',
        }}
      >
        {/* 상단 헤더 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px', fontWeight: '900', color: '#0369a1' }}>
              📘 다마고치 육성 가이드
            </span>
            <span
              style={{
                background: '#e0f2fe',
                color: '#0284c7',
                fontSize: '12px',
                fontWeight: '800',
                padding: '3px 9px',
                borderRadius: '12px',
              }}
            >
              최신 통합판
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#ef4444',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '7px 13px',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            ✕ 닫기
          </button>
        </div>

        {/* 카테고리 탭 바 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
          {GUIDE_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sfx.beep();
                  setActiveTab(tab.id);
                }}
                style={{
                  padding: '8px 4px',
                  borderRadius: '12px',
                  border: isActive ? '2px solid #0284c7' : '1.5px solid #cbd5e1',
                  background: isActive ? '#0284c7' : '#f8fafc',
                  color: isActive ? '#ffffff' : '#334155',
                  fontSize: '12.5px',
                  fontWeight: '800',
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 탭별 상세 안내 본문 */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            background: '#f8fafc',
            border: '1.5px solid #e2e8f0',
            borderRadius: '18px',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            fontSize: '13.5px',
            lineHeight: 1.55,
          }}
        >
          {activeTab === 'BASIC' && (
            <>
              <SectionCard title="🔘 기기 물리 버튼 & 화면 조작">
                <ul style={listStyle}>
                  <li><strong>A 버튼 (좌):</strong> 상단 메뉴 아이콘 이동 / 상점·식사 페이지 전환</li>
                  <li><strong>B 버튼 (중):</strong> 선택한 메뉴 실행 및 확인</li>
                  <li><strong>C 버튼 (우):</strong> 이전 화면으로 취소 / 메인 LCD 복귀</li>
                  <li><strong>직접 터치:</strong> LCD 상단 아이콘(🍖🎾🧹🏪📊📖)을 직접 눌러도 바로 실행됩니다.</li>
                </ul>
              </SectionCard>

              <SectionCard title="🍙 식사(3종) & 🍰 간식(3종) 메뉴·가격표">
                <ul style={listStyle}>
                  <li>
                    <strong>식사류 (소화 쿨타임 3분 실시간 표시 / 포만 95 미만 섭취):</strong>
                    <br />• <strong>🍙 주먹밥 (무료):</strong> 포만+20, 체력+15, 대지+1
                    <br />• <strong>🍣 초밥 (7🪙):</strong> 포만+25, 행복+10, 체력+20, 바다+2
                    <br />• <strong>🍜 라멘 (9🪙):</strong> 포만+35, 행복+5, 체력+25, 대지+2
                  </li>
                  <li>
                    <strong>간식류 (하루 최대 6회 / 쿨타임 없음):</strong>
                    <br />• <strong>🍰 케이크 (3🪙):</strong> 행복+20, 포만+10, 체력+5, 하늘+1
                    <br />• <strong>🥛 우유 (5🪙):</strong> 포만+15, 행복+8, 체력+15, 청결+10, 바다+1
                    <br />• <strong>🍨 파르페 (7🪙):</strong> 행복+25, 포만+12, 체력+10, 하늘+2
                  </li>
                  <li>보유 코인이 부족하거나 소화 대기 중인 메뉴는 흐리게 표시됩니다.</li>
                </ul>
              </SectionCard>

              <SectionCard title="📊 상태 확인 · 청소 · 야간 수면 모드">
                <ul style={listStyle}>
                  <li><strong>상태창(📊):</strong> 포만·행복·체력 게이지와 함께 현재 <strong>☁️하늘 · 🌱대지 · 💧바다</strong> 속성 스탯을 확인할 수 있습니다.</li>
                  <li><strong>청소 보너스:</strong> 배변(💩)을 치우면 <strong>1개당 +10🪙</strong>와 <strong>바다(+1)</strong> 스탯을 얻습니다.</li>
                  <li><strong>야간 수면(🌙):</strong> 밤 11시~오전 6시 사이에는 액정이 어두워지며 캐릭터가 잠듭니다.</li>
                </ul>
              </SectionCard>
            </>
          )}

          {activeTab === 'EVOLVE' && (
            <>
              <SectionCard title="🌱 4단계 성장 진화 조건">
                <ul style={listStyle}>
                  <li><strong>0단계 (알 → 베이비):</strong> 부화까지 <strong>5분</strong> 소요</li>
                  <li><strong>1단계 (베이비 → 키드):</strong> <strong>1시간</strong> 경과 + 포만 50↑ & 행복 50↑</li>
                  <li><strong>2단계 (키드 → 성장기):</strong> <strong>6시간</strong> 경과 + 미니게임 <strong>2승</strong> 이상</li>
                  <li><strong>3단계 (성장기 → 성체):</strong> <strong>24시간</strong> 경과 + 배변 0개 & 포만 40↑</li>
                </ul>
              </SectionCard>

              <SectionCard title="🧭 3대 육성 속성 (하늘 · 대지 · 바다)">
                <ul style={listStyle}>
                  <li><strong>하늘(SKY):</strong> 케이크·파르페 간식 및 미니게임 승리 시 상승</li>
                  <li><strong>대지(LAND):</strong> 주먹밥·라멘 식사 시 상승</li>
                  <li><strong>바다(WATER):</strong> 초밥·우유 섭취 및 배변 청소 시 상승</li>
                  <li>가장 높게 키운 속성 계열(70% 확률) 또는 2순위 속성(30% 확률) 성체로 진화합니다.</li>
                </ul>
              </SectionCard>

              <SectionCard title="🎁 전설 5종 & 시크릿 에디션 5종 해금">
                <ul style={listStyle}>
                  <li><strong>해금 조건:</strong> 성체 진화 시 <strong>하늘·대지·바다 모두 50 이상 & 미니게임 50승 이상</strong>이면 전설·히든 캐릭터가 출현합니다.</li>
                  <li><strong>시크릿 스페이스 당첨 시:</strong> <strong>보안관 우디 · 베이비 그로구 · 리본 헬로키티 · 드로이드 R2-D2 · 피너츠 스누피</strong> 5종 중 하나로 랜덤 변신하며, <strong>전용 콜라보 기기 스킨</strong>이 영구 해금·장착됩니다!</li>
                </ul>
              </SectionCard>
            </>
          )}

          {activeTab === 'GAME' && (
            <>
              <SectionCard title="🕹️ 5종 랜덤 미니게임 & 연승 보너스">
                <ul style={listStyle}>
                  <li>입장 시 체력 <strong>12</strong>가 소모되며, 아래 5종 게임 중 1개가 랜덤 출제됩니다.</li>
                  <li><strong>🎯 퍼펙트 캐치:</strong> 좁은 중앙 노란 칸(16%)에 맞춰 정확히 정지</li>
                  <li><strong>🔢 하이 & 로우:</strong> 기준 숫자보다 다음 숫자가 클지 작을지 예측</li>
                  <li><strong>👻 유령 팡팡:</strong> 6초 안에 폭탄(💣)을 피해 유령(👻) 3마리 터치</li>
                  <li><strong>💡 기억력 램프:</strong> 🍎⭐💧 3단계 불빛 순서를 기억해 그대로 입력</li>
                  <li><strong>✊ 가위바위보:</strong> 상대와 겨뤄 3판 2선승 달성</li>
                  <li><strong>🔥 연승 보너스:</strong> <strong>3연승 이상</strong> 달성 시 <strong>승리 카운트 +2승 & 코인 2배(+30🪙)</strong> 지급!</li>
                </ul>
              </SectionCard>

              <SectionCard title="🏪 상점 스킨 & 특수 아이템">
                <ul style={listStyle}>
                  <li><strong>기기 스킨(8종+시크릿 5종):</strong> 코인으로 구매해 기기 외형과 액정 색상을 교체할 수 있습니다.</li>
                  <li><strong>⚡ 파워 드링크 (15🪙):</strong> 체력 즉시 +50 회복</li>
                  <li><strong>🍎 속성 열매 (30🪙):</strong> 원하는 속성(하늘/대지/바다) 스탯 +3 즉시 상승</li>
                  <li><strong>🔮 성체 환생구슬 (1000🪙):</strong> 최종 성체 상태에서 미수집 다른 성체로 즉시 환생 (전설 조건 충족 시 시크릿 변신 가능)</li>
                </ul>
              </SectionCard>
            </>
          )}

          {activeTab === 'PLAZA' && (
            <>
              <SectionCard title="📡 다마고치 커넥션 광장 & 네온 전광판">
                <ul style={listStyle}>
                  <li>상단 <strong>[📡 광장]</strong> 버튼 또는 네온 전광판을 터치하면 접속 중인 친구들과 만날 수 있습니다.</li>
                  <li><strong>✏️ 프로필 변경:</strong> 내 닉네임(최대 8자)과 광장에 표시될 대표 캐릭터 아바타를 자유롭게 변경할 수 있습니다.</li>
                  <li><strong>🎁 선물 주고받기:</strong> 친구 캐릭터를 눌러 <strong>❤️ 하트(행복+15)</strong>, <strong>🍰 케이크(포만+15)</strong>, <strong>🪙 20코인</strong>을 실시간으로 보낼 수 있습니다.</li>
                  <li><strong>📺 실시간 전광판:</strong> 새 채팅이나 선물 알림이 올라오면 메인 화면 상단 네온 간판에 강조 표시됩니다.</li>
                </ul>
              </SectionCard>

              <SectionCard title="⚡ 1:1 IR 적외선 통신 대전">
                <ul style={listStyle}>
                  <li>광장 내 <strong>[⚡ 1:1 IR 대전]</strong> 탭에서 친구와 약속한 <strong>4자리 숫자 초대코드</strong>를 입력해 입장합니다.</li>
                  <li>두 캐릭터가 화면에 나란히 등장해 실시간 가위바위보 대결을 펼치며, 승리 시 <strong>+50🪙</strong>를 획득합니다.</li>
                </ul>
              </SectionCard>

              <SectionCard title="📸 인증샷 자랑 & 2세대 계승">
                <ul style={listStyle}>
                  <li><strong>📸 자랑 버튼:</strong> 현재 기기 스킨·캐릭터·나이·도감 달성률이 담긴 레트로 카드를 PNG 이미지로 저장하거나 카카오톡 등으로 공유할 수 있습니다.</li>
                  <li><strong>🥚 2세대 독립:</strong> 성체 진화 후 24시간이 지나면 [📊 상태]에서 코인·스킨·도감을 유지한 채 2세대 새 알을 물려받을 수 있습니다.</li>
                </ul>
              </SectionCard>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '14px',
        padding: '11px 13px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}
    >
      <div style={{ fontSize: '14px', fontWeight: '900', color: '#0369a1' }}>{title}</div>
      {children}
    </div>
  );
}

const listStyle = {
  margin: 0,
  paddingLeft: '18px',
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
  color: '#334155',
};