import { useEffect, useRef } from 'react';

// The exact procedural washi from the portfolio's fluid DISPLAY_SHADER, minus
// the ink: three octaves of value-noise fibre over the warm paper base, with a
// soft deckled-edge vignette. Rendered live in WebGL so it's genuinely computed,
// not a texture asset. Static (drawn once per size), so there's no per-frame
// GPU cost competing with the MapLibre map.
const VERTEX_SHADER = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;
varying vec2 vUv;
uniform vec3 uPaper;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

void main() {
  // Procedural washi fibre: three octaves of soft value noise.
  float fibre = noise(vUv * 420.0) * 0.028
              + noise(vUv * 180.0) * 0.022
              + noise(vUv * 60.0) * 0.018;

  vec3 col = uPaper + fibre;

  // Soft darkening toward the edges, like the deckled rim of a sheet.
  vec2 uv2 = vUv * (1.0 - vUv.yx);
  float vign = pow(uv2.x * uv2.y * 15.0, 0.18);
  col *= 0.92 + 0.08 * vign;

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

// #efeae0 in linear 0-1.
const PAPER_RGB: [number, number, number] = [239 / 255, 234 / 255, 224 / 255];

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function PaperShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      antialias: false,
      preserveDrawingBuffer: false,
    });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    // Full-screen quad (two triangles).
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const aPosition = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const uPaper = gl.getUniformLocation(program, 'uPaper');
    gl.uniform3fv(uPaper, PAPER_RGB);

    const render = () => {
      // Cap DPR so the grain stays fine without over-allocating on retina.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    render();

    let resizeRaf = 0;
    const onResize = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(render);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(resizeRaf);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-screen w-screen"
    />
  );
}
