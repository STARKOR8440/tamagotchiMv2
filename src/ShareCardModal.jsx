import React, { useRef, useState } from 'react';
import PetSprite from './PetSprite';
import { SPECIES, SHELL_ITEMS } from './evolutionTree';
import { sfx } from './sound';

export default function ShareCardModal({ pet = {}, onClose }) {
  const cardRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const speciesId = pet.speciesId || 'EGG';
  const spec = SPECIES[speciesId] || SPECIES.EGG;
  const generation = pet.generation || 1;
  const coins = pet.coins ?? 0;

  const careStats = {
    land: pet.careStats?.land ?? 1,
    forest: pet.careStats?.forest ?? 1,
    water: pet.careStats?.water ?? 1,
    sky: pet.careStats?.sky ?? 1,
  };

  const shells = {
    forest: pet.shells?.forest ?? 0,
    land: pet.shells?.land ?? 0,
    water: pet.shells?.water ?? 0,
    sky: pet.shells?.sky ?? 0,
  };

  const handleDownloadCardImage = async () => {
    try {
      setSaving(true);
      setStatusMsg('');
      sfx.confirm();

      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 820;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const grad = ctx.createLinearGradient(0, 0, 640, 820);
      grad.addColorStop(0, '#38bdf8');
      grad.addColorStop(0.5, '#e0f2fe');
      grad.addColorStop(1, '#fef08a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 640, 820);

      // 카드 본체
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.roundRect(36, 36, 568, 748, 36);
      ctx.fill();
      ctx.stroke();

      // 헤더
      ctx.fillStyle = '#0369a1';
      ctx.font = 'bold 30px sans-serif';
      ctx.fillText('TAMAGOTCHI PARADISE CARD', 76, 98);

      ctx.fillStyle = '#475569';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(`${generation}세대 · ${spec.stageLabel || spec.stage}`, 76, 134);

      ctx.fillStyle = '#b45309';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(`🪙 ${coins}`, 470, 114);

      // 스프라이트 영역 배경
      ctx.fillStyle = '#ecfdf5';
      ctx.strokeStyle = '#0f766e';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.roundRect(76, 165, 488, 250, 24);
      ctx.fill();
      ctx.stroke();

      // DOM 내 PetSprite SVG/Canvas 또는 이미지 복사 시도
      const svgEl = cardRef.current?.querySelector('svg');
      if (svgEl) {
        const serializer = new XMLSerializer();
        const svgStr = serializer.serializeToString(svgEl);
        const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        await new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, 236, 206, 168, 168);
            URL.revokeObjectURL(url);
            resolve();
          };
          img.onerror = () => {
            URL.revokeObjectURL(url);
            resolve();
          };
          img.src = url;
        });
      }

      // 캐릭터 이름 & 설명
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 34px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(spec.name, 320, 465);

      ctx.fillStyle = '#334155';
      ctx.font = '19px sans-serif';
      ctx.fillText(spec.desc || '파라다이스에서 함께 성장 중인 캐릭터입니다.', 320, 502);
      ctx.textAlign = 'left';

      // 필드 케어 스탯
      const statEntries = [
        { label: `⛰️ 땅 ${careStats.land}`, x: 76, y: 560 },
        { label: `🌲 숲 ${careStats.forest}`, x: 330, y: 560 },
        { label: `🌊 바다 ${careStats.water}`, x: 76, y: 602 },
        { label: `☁️ 하늘 ${careStats.sky}`, x: 330, y: 602 },
      ];
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 21px sans-serif';
      statEntries.forEach((st) => ctx.fillText(st.label, st.x, st.y));

      // 4종 쉘 획득 수량
      const shellEntries = [
        `${SHELL_ITEMS.forest.icon} ${shells.forest}`,
        `${SHELL_ITEMS.land.icon} ${shells.land}`,
        `${SHELL_ITEMS.water.icon} ${shells.water}`,
        `${SHELL_ITEMS.sky.icon} ${shells.sky}`,
      ];
      shellEntries.forEach((txt, idx) => {
        const bx = 76 + idx * 124;
        ctx.fillStyle = '#dcfce7';
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(bx, 642, 114, 54, 14);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#14532d';
        ctx.font = 'bold 22px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(txt, bx + 57, 677);
        ctx.textAlign = 'left';
      });

      const link = document.createElement('a');
      link.download = `tamagotchi_${spec.id}_gen${generation}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      sfx.win();
      setStatusMsg('PNG 인증 카드가 저장되었습니다! 📸');
    } catch {
      sfx.beep();
      setStatusMsg('이미지 저장 중 문제가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.72)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '14px',
        boxSizing: 'border-box',
      }}
    >
      <div
        ref={cardRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '390px',
          background: '#ffffff',
          borderRadius: '24px',
          border: '3px solid #38bdf8',
          boxShadow: '0 20px 45px rgba(15, 23, 42, 0.35)',
          padding: '16px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          color: '#0f172a',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <strong style={{ fontSize: '15px', color: '#0369a1' }}>📸 캐릭터 인증 카드</strong>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#ef4444',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '5px 10px',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            ✕ 닫기
          </button>
        </div>

        <div
          style={{
            background: '#ecfdf5',
            border: '2px solid #0f766e',
            borderRadius: '16px',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#0f766e' }}>
            {generation}세대 · {spec.stageLabel || spec.stage} · 🪙 {coins}
          </div>
          <div style={{ transform: 'scale(1.2)', margin: '8px 0' }}>
            <PetSprite speciesId={speciesId} frame={0} lcdMode={false} />
          </div>
          <div style={{ fontSize: '16px', fontWeight: '900', color: '#0f172a' }}>{spec.name}</div>
          <div style={{ fontSize: '11px', color: '#334155', textAlign: 'center' }}>{spec.desc}</div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '6px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '8px',
            fontSize: '11px',
            fontWeight: '800',
            textAlign: 'center',
          }}
        >
          <div>⛰️ {careStats.land}</div>
          <div>🌲 {careStats.forest}</div>
          <div>🌊 {careStats.water}</div>
          <div>☁️ {careStats.sky}</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
          {[
            { key: 'forest', val: shells.forest },
            { key: 'land', val: shells.land },
            { key: 'water', val: shells.water },
            { key: 'sky', val: shells.sky },
          ].map((item) => (
            <div
              key={item.key}
              style={{
                background: '#dcfce7',
                border: '1px solid #86efac',
                borderRadius: '10px',
                padding: '6px 4px',
                fontSize: '11.5px',
                fontWeight: '900',
                color: '#14532d',
                textAlign: 'center',
              }}
            >
              {SHELL_ITEMS[item.key].icon} <strong>{item.val}</strong>
            </div>
          ))}
        </div>

        {statusMsg && (
          <div style={{ fontSize: '11.5px', fontWeight: '800', color: '#0369a1', textAlign: 'center' }}>
            {statusMsg}
          </div>
        )}

        <button
          type="button"
          disabled={saving}
          onClick={handleDownloadCardImage}
          style={{
            background: '#0284c7',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            padding: '9px',
            fontSize: '12.5px',
            fontWeight: '900',
            cursor: 'pointer',
          }}
        >
          {saving ? '저장 중...' : '📥 PNG 카드로 저장'}
        </button>
      </div>
    </div>
  );
}
