<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import carImageSrc from '../../assets/CarMoving-ETP.png';
import layer2      from '../../assets/Layer2-ETP.jpg';

/* Remove white background from PNG via canvas (matches design's useTransparentPng) */
const carImage = ref(null);
function makeTransparent(src) {
  const img = new Image();
  img.onload = () => {
    const c = document.createElement('canvas');
    c.width = img.width; c.height = img.height;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const d = ctx.getImageData(0, 0, c.width, c.height);
    for (let i = 0; i < d.data.length; i += 4) {
      if (d.data[i] > 228 && d.data[i+1] > 228 && d.data[i+2] > 228)
        d.data[i+3] = 0;
    }
    ctx.putImageData(d, 0, 0);
    carImage.value = c.toDataURL();
  };
  img.src = src;
}

const outerRef = ref(null);
const progress = ref(0);
const vw = ref(typeof window !== 'undefined' ? window.innerWidth : 1440);

const STATS = [
  { target: 3,     suffix: '+', label: 'Years of\nExperience', pos: 0.15 },
  { target: 2000,  suffix: '+', label: 'Rides\nCompleted',     pos: 0.50 },
  { target: 10000, suffix: '+', label: 'Happy\nCustomers',     pos: 0.82 },
];

const carW = computed(() => Math.min(500, Math.max(vw.value * 0.42, 280)));
const carX = computed(() => -carW.value + progress.value * (vw.value + carW.value * 2));

function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

function statActivationP(stat) {
  return (stat.pos * vw.value + carW.value * 0.5) / (vw.value + carW.value * 2);
}

function countVal(stat) {
  const ap = statActivationP(stat);
  if (progress.value < ap) return 0;
  const t = Math.min(1, (progress.value - ap) / 0.16);
  return Math.round(stat.target * easeOut(t));
}

function isActive(stat) {
  return progress.value >= statActivationP(stat);
}

function onScroll() {
  if (!outerRef.value) return;
  const rect   = outerRef.value.getBoundingClientRect();
  const total  = outerRef.value.offsetHeight - window.innerHeight;
  const scrolled = Math.max(0, -rect.top);
  progress.value = Math.min(1, scrolled / total);
}

function onResize() { vw.value = window.innerWidth; }

onMounted(() => {
  makeTransparent(carImageSrc);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  onScroll();
});
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onResize);
});
</script>

<template>
  <!-- 300vh outer section gives plenty of scroll room for the car journey -->
  <section ref="outerRef" style="height:300vh; position:relative;">
    <div style="position:sticky; top:0; height:100vh; overflow:hidden;">

      <!-- Layer2 parallax background -->
      <div :style="{
        position:'absolute', inset:0, zIndex:0,
        backgroundImage:`url(${layer2})`,
        backgroundSize:'cover', backgroundPosition:'center 60%',
        backgroundAttachment:'fixed',
      }" />

      <!-- Navy overlay for contrast -->
      <div style="position:absolute;inset:0;z-index:1;
        background:linear-gradient(160deg,rgba(13,33,55,0.88) 0%,rgba(13,33,55,0.78) 50%,rgba(13,33,55,0.65) 100%);" />

      <!-- Subtle grid texture -->
      <div style="position:absolute;inset:0;z-index:2;pointer-events:none;
        background-image:linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),
          linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px);
        background-size:90px 90px;" />

      <!-- Header -->
      <div style="position:absolute;top:60px;width:100%;text-align:center;z-index:5;pointer-events:none;">
        <div style="font-family:'DM Sans',sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:var(--gold);font-weight:600;margin-bottom:12px;">
          By the Numbers
        </div>
        <h2 style="font-family:'Cormorant Garamond',serif;font-size:clamp(30px,3.5vw,52px);font-weight:600;color:#fff;margin:0;line-height:1.1;">
          Experience You Can Trust
        </h2>
      </div>

      <!-- Ground line -->
      <div style="position:absolute;left:0;right:0;bottom:34%;height:1px;z-index:4;pointer-events:none;
        background:linear-gradient(to right,transparent,rgba(232,201,126,0.15) 15%,rgba(232,201,126,0.15) 85%,transparent);" />

      <!-- Stats positioned at fixed horizontal percentages -->
      <div style="position:absolute;inset:0;z-index:5;pointer-events:none;">
        <div
          v-for="(stat, i) in STATS"
          :key="i"
          :style="{ position:'absolute', left:`${stat.pos*100}%`, top:'42%', transform:'translate(-50%,-50%)', textAlign:'center' }"
        >
          <div :style="{
            position:'absolute',inset:'-60px -80px',
            background:'radial-gradient(ellipse,rgba(13,33,55,0.6) 0%,transparent 65%)',
            opacity:isActive(stat)?1:0, transition:'opacity 0.7s ease', borderRadius:'50%',
          }"/>
          <div :style="{
            fontFamily:'\'Cormorant Garamond\',serif',
            fontSize:'clamp(52px,6.5vw,100px)', fontWeight:600,
            color:isActive(stat)?'#fff':'rgba(255,255,255,0.09)',
            lineHeight:1, transition:'color 0.5s ease', position:'relative',
            textShadow:isActive(stat)?'0 2px 24px rgba(13,33,55,0.4)':'none',
          }">
            {{ countVal(stat).toLocaleString() }}{{ stat.suffix }}
          </div>
          <div :style="{
            fontFamily:'\'DM Sans\',sans-serif',
            fontSize:'clamp(11px,1.1vw,13px)', letterSpacing:'0.14em',
            textTransform:'uppercase',
            color:isActive(stat)?'rgba(255,255,255,0.7)':'rgba(255,255,255,0.1)',
            marginTop:'10px', transition:'color 0.5s ease',
            whiteSpace:'pre-line', lineHeight:1.5,
          }">{{ stat.label }}</div>
          <div :style="{
            width:'1px', height:isActive(stat)?'48px':'0px',
            background:'linear-gradient(to bottom,rgba(232,201,126,0.8),transparent)',
            margin:'14px auto 0', transition:'height 0.6s ease 0.1s',
          }"/>
        </div>
      </div>

      <!-- Car (scaleX flipped so it faces right) -->
      <div :style="{
        position:'absolute', bottom:'33%', left:0, zIndex:6,
        width:`${carW}px`,
        transform:`translateX(${carX}px)`,
        willChange:'transform', pointerEvents:'none',
      }">
        <div style="position:absolute;right:-160px;top:20%;width:160px;height:55%;
          background:linear-gradient(to right,rgba(255,230,140,0.25),rgba(255,210,80,0.08) 50%,transparent);
          filter:blur(10px);clip-path:polygon(0 30%,100% 0%,100% 100%,0 70%);"/>
        <div style="position:absolute;bottom:-12px;left:8%;right:8%;height:20px;
          background:radial-gradient(ellipse at center,rgba(0,0,0,0.65),transparent 70%);
          filter:blur(8px);"/>
        <img :src="carImage" alt="Mercedes Vito" style="width:100%;height:auto;display:block;transform:scaleX(-1);" />
      </div>

      <!-- Scroll nudge -->
      <div :style="{
        position:'absolute',bottom:'28px',left:'50%',transform:'translateX(-50%)',
        opacity:Math.max(0,1-progress*5),
        display:'flex',flexDirection:'column',alignItems:'center',gap:'6px',
        pointerEvents:'none',zIndex:8,
      }">
        <span style="font-family:'DM Sans',sans-serif;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(255,255,255,0.3);">Keep Scrolling</span>
        <div style="width:1px;height:32px;background:linear-gradient(to bottom,rgba(255,255,255,0.3),transparent);animation:scrollPulse 2s infinite;"/>
      </div>

    </div>
  </section>
</template>
