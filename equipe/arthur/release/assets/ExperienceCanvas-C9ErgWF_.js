import{r,a as j,j as e,C as A,P as R}from"./r3f-Dz6ofJS-.js";import{d as S,w as D,q as k}from"./post-B9Q5ukyc.js";import{X as U,g as l,Y as L,Z as N,e as O,_ as B,$ as c,A as F}from"./three-Be3Q2bJX.js";const I=`
  uniform float uTime;
  uniform float uChapter;
  uniform float uEnergy;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDirection;

  void main() {
    vUv = uv;
    vec3 transformed = position;
    float ribbon = sin(uv.x * 18.0 + uTime * 0.16 + uChapter * 1.7);
    float secondary = cos(uv.x * 9.0 - uChapter * 0.85);
    transformed.x += ribbon * (0.055 + uEnergy * 0.12);
    transformed.z += secondary * (0.04 + uEnergy * 0.16);

    vec4 modelPosition = modelMatrix * vec4(transformed, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vNormal = normalize(normalMatrix * normal);
    vViewDirection = normalize(-viewPosition.xyz);
    gl_Position = projectionMatrix * viewPosition;
  }
`,V=`
  uniform float uTime;
  uniform float uChapter;
  uniform float uOpacity;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDirection;

  void main() {
    float facing = abs(dot(normalize(vViewDirection), normalize(vNormal)));
    float fresnel = pow(1.0 - clamp(facing, 0.0, 1.0), 2.45);
    float travelling = pow(max(0.0, sin(vUv.x * 78.0 - uTime * 1.5 + uChapter)), 20.0);
    float chapterPulse = 0.55 + 0.45 * sin(uChapter * 2.2 + vUv.x * 6.283);

    vec3 carbon = vec3(0.025, 0.026, 0.025);
    vec3 paper = vec3(0.949, 0.941, 0.910);
    vec3 signal = vec3(0.337, 0.498, 0.294);

    vec3 color = mix(carbon, paper, fresnel * 0.9);
    color = mix(color, signal, travelling * (0.55 + chapterPulse * 0.35));
    float alpha = uOpacity * (0.38 + fresnel * 0.62 + travelling * 0.45);

    gl_FragColor = vec4(color, alpha);
  }
`;function w(o){return new O({uniforms:{uTime:{value:0},uChapter:{value:0},uEnergy:{value:.35},uOpacity:{value:o}},vertexShader:I,fragmentShader:V,transparent:!0,depthWrite:!1,blending:B})}function _({progressRef:o}){const t=r.useRef(null),i=r.useRef(null),n=r.useRef(null),s=r.useRef(null),a=r.useRef(null),p=r.useMemo(()=>new U([new l(-1.9,-5.2,.1),new l(-.85,-3.6,0),new l(.5,-2.2,.25),new l(-.45,-.55,0),new l(.75,1.1,-.15),new l(-.25,2.65,.1),new l(1.75,5.1,0)]),[]),x=r.useMemo(()=>new L(p,192,.035,7,!1),[p]),b=r.useMemo(()=>w(.92),[]),P=r.useMemo(()=>w(.26),[]),C=r.useMemo(()=>w(.18),[]),v=r.useMemo(()=>new N,[]),g=r.useMemo(()=>new l,[]),y=22;return r.useLayoutEffect(()=>{if(a.current){for(let u=0;u<y;u+=1){p.getPoint(u/(y-1),g),v.position.copy(g);const m=u%5===0?1.65:.75;v.scale.setScalar(m),v.updateMatrix(),a.current.setMatrixAt(u,v.matrix)}a.current.instanceMatrix.needsUpdate=!0}},[p,v,g]),j((u,m)=>{const h=o.current,M=h*6,E=u.clock.elapsedTime,T=c.smoothstep(M,1.45,3.7),z=1-c.smoothstep(M,4.7,6)*.55,f=T*z;if([b,P,C].forEach(d=>{d.uniforms.uTime.value=E,d.uniforms.uChapter.value=M,d.uniforms.uEnergy.value=.28+f*.72}),n.current&&s.current&&(n.current.position.x=c.damp(n.current.position.x,f*.62,4,m),s.current.position.x=c.damp(s.current.position.x,f*-.55,4,m),n.current.rotation.y=f*.22,s.current.rotation.y=f*-.18),t.current&&(t.current.rotation.z=c.damp(t.current.rotation.z,-.34+Math.sin(h*Math.PI*2)*.18,3,m),t.current.rotation.y=c.damp(t.current.rotation.y,(h-.5)*.34,3,m),t.current.position.x=c.damp(t.current.position.x,Math.sin(h*Math.PI*3)*.38,3,m)),a.current){const d=a.current.material;d.opacity=.22+f*.5+Math.sin(E*1.4)*.05}}),e.jsxs("group",{ref:t,scale:.9,children:[e.jsx("mesh",{ref:i,geometry:x,material:b}),e.jsx("mesh",{ref:n,geometry:x,material:P,scale:.985}),e.jsx("mesh",{ref:s,geometry:x,material:C,scale:1.015}),e.jsxs("instancedMesh",{ref:a,args:[void 0,void 0,y],children:[e.jsx("icosahedronGeometry",{args:[.052,1]}),e.jsx("meshBasicMaterial",{color:"#567f4b",transparent:!0,opacity:.28,depthWrite:!1})]})]})}function G(){const o=r.useRef(null),t=r.useMemo(()=>{const i=new Float32Array(540);let n=9173;const s=()=>(n=n*16807%2147483647,(n-1)/2147483646);for(let a=0;a<180;a+=1)i[a*3]=(s()-.5)*15,i[a*3+1]=(s()-.5)*11,i[a*3+2]=(s()-.5)*5-1;return i},[]);return j(i=>{o.current&&(o.current.rotation.y=i.clock.elapsedTime*.006,o.current.rotation.z=Math.sin(i.clock.elapsedTime*.05)*.02)}),e.jsxs("points",{ref:o,children:[e.jsx("bufferGeometry",{children:e.jsx("bufferAttribute",{attach:"attributes-position",args:[t,3]})}),e.jsx("pointsMaterial",{color:"#f2f0e8",size:.012,transparent:!0,opacity:.16,depthWrite:!1})]})}const W=new l(0,0,0);function q({progressRef:o}){return j(({camera:t},i)=>{const n=o.current,s=Math.sin(n*Math.PI*2.4)*.5,a=(.5-n)*.28,p=7.1-Math.sin(n*Math.PI)*.4;t.position.x=c.damp(t.position.x,s,3,i),t.position.y=c.damp(t.position.y,a,3,i),t.position.z=c.damp(t.position.z,p,3,i),t.lookAt(W)}),null}function X({progressRef:o,subtleEffects:t}){return e.jsxs(e.Fragment,{children:[e.jsx(q,{progressRef:o}),e.jsx("ambientLight",{color:"#11131a",intensity:.28}),e.jsx("directionalLight",{color:"#fff3e6",intensity:2.1,position:[4,5,3]}),e.jsx("directionalLight",{color:"#8da4c7",intensity:.45,position:[-5,2,2]}),e.jsx("directionalLight",{color:"#567f4b",intensity:.85,position:[0,3,-5]}),e.jsx(G,{}),e.jsx(_,{progressRef:o}),t&&e.jsxs(S,{multisampling:0,children:[e.jsx(D,{intensity:.24,luminanceThreshold:.68,luminanceSmoothing:.22,mipmapBlur:!0}),e.jsx(k,{eskil:!1,offset:.18,darkness:.35})]})]})}function $({progressRef:o,subtleEffects:t=!0}){const[i,n]=r.useState(()=>Math.min(window.devicePixelRatio,1.65));return e.jsx("div",{className:"webgl-layer","aria-hidden":"true",inert:!0,children:e.jsx(A,{dpr:i,camera:{fov:36,position:[0,0,7.1],near:.1,far:40},gl:{alpha:!0,antialias:!0,powerPreference:"high-performance",toneMapping:F,toneMappingExposure:1.05},children:e.jsx(R,{onDecline:()=>n(1),onIncline:()=>n(Math.min(window.devicePixelRatio,1.65)),children:e.jsx(X,{progressRef:o,subtleEffects:t})})})})}export{$ as ExperienceCanvas};
