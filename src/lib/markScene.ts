import { markShape } from '../content/brand'
import { buildSegment, buildSphere, vertexStride, type Mesh } from './markMesh'

/**
 * The homepage hero's KMRL mark in WebGL2: three machined bracket segments around a glowing blue
 * core. It assembles the first time it's on screen, then drifts slowly, leans toward the pointer
 * and opens slightly while the pointer is over it. `still` (reduced motion) draws one resting frame;
 * so do software renderers, where a continuous loop would cost the page its smooth scrolling.
 */
export type MarkScene = {
  setActive(active: boolean): void
  dispose(): void
}

type Mat4 = Float32Array

function multiply(a: Mat4, b: Mat4): Mat4 {
  const out = new Float32Array(16)
  for (let column = 0; column < 4; column++) {
    for (let row = 0; row < 4; row++) {
      let sum = 0
      for (let k = 0; k < 4; k++) sum += a[k * 4 + row] * b[column * 4 + k]
      out[column * 4 + row] = sum
    }
  }
  return out
}

const translation = (x: number, y: number, z: number): Mat4 =>
  new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1])

const scaling = (s: number): Mat4 => new Float32Array([s, 0, 0, 0, 0, s, 0, 0, 0, 0, s, 0, 0, 0, 0, 1])

function rotationX(angle: number): Mat4 {
  const [c, s] = [Math.cos(angle), Math.sin(angle)]
  return new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1])
}

function rotationY(angle: number): Mat4 {
  const [c, s] = [Math.cos(angle), Math.sin(angle)]
  return new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1])
}

function rotationZ(angle: number): Mat4 {
  const [c, s] = [Math.cos(angle), Math.sin(angle)]
  return new Float32Array([c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
}

/** Rotation about a unit axis in the xy plane. */
function rotationAbout([x, y]: [number, number], angle: number): Mat4 {
  const [c, s] = [Math.cos(angle), Math.sin(angle)]
  const t = 1 - c
  return new Float32Array([
    t * x * x + c, t * x * y, -s * y, 0,
    t * x * y, t * y * y + c, s * x, 0,
    s * y, -s * x, c, 0,
    0, 0, 0, 1,
  ])
}

function perspective(fovY: number, aspect: number, near: number, far: number): Mat4 {
  const f = 1 / Math.tan(fovY / 2)
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) / (near - far), -1,
    0, 0, (2 * far * near) / (near - far), 0,
  ])
}

const vertexShader = `#version 300 es
in vec3 aPosition;
in vec3 aNormal;
in float aTrim;
uniform mat4 uModel;
uniform mat4 uViewProjection;
out vec3 vWorld;
out vec3 vNormal;
out float vTrim;
void main() {
  vec4 world = uModel * vec4(aPosition, 1.0);
  vWorld = world.xyz;
  vNormal = mat3(uModel) * aNormal;
  vTrim = aTrim;
  gl_Position = uViewProjection * world;
}`

const fragmentShader = `#version 300 es
precision highp float;
in vec3 vWorld;
in vec3 vNormal;
in float vTrim;
uniform vec3 uEye;
uniform float uCore;
uniform float uTrim;
uniform int uKind;
out vec4 outColor;

const float PI = 3.14159265;

float ggx(float nh, float a) {
  float a2 = a * a;
  float d = nh * nh * (a2 - 1.0) + 1.0;
  return a2 / (PI * d * d);
}

float visibility(float nv, float nl, float a) {
  float k = a * 0.5;
  return 0.25 / ((nv * (1.0 - k) + k) * (nl * (1.0 - k) + k));
}

vec3 fresnel(vec3 f0, float vh) {
  return f0 + (1.0 - f0) * pow(1.0 - vh, 5.0);
}

vec3 shade(vec3 n, vec3 v, vec3 l, vec3 radiance, vec3 albedo, vec3 f0, float metal, float rough) {
  vec3 h = normalize(l + v);
  float nl = max(dot(n, l), 0.0);
  float nv = max(dot(n, v), 1e-4);
  float a = rough * rough;
  vec3 f = fresnel(f0, max(dot(v, h), 0.0));
  vec3 specular = ggx(max(dot(n, h), 0.0), a) * visibility(nv, nl, a) * f;
  vec3 diffuse = (1.0 - f) * (1.0 - metal) * albedo / PI;
  return (diffuse + specular) * radiance * nl;
}

// A dark studio: a soft light overhead and a tall strip to the upper left. The strip is a few units
// away, so where it lands shifts across a face (p) and flat faces get a gradient, not a flat grey.
vec3 studio(vec3 r, vec3 p, float rough) {
  float overhead = smoothstep(0.4, 1.0, r.y);
  float strip = exp(-pow((r.x + 0.5 + p.x * 0.45 - p.y * 0.2) / (0.14 + rough * 0.5), 2.0));
  strip *= smoothstep(-0.2, 0.6, r.y + p.y * 0.3);
  return vec3(0.006, 0.007, 0.009) + vec3(0.55, 0.58, 0.64) * overhead * 0.22 + vec3(1.0) * strip * 0.7;
}

vec3 lamp(vec3 position, vec3 n, vec3 v, vec3 radiance, vec3 albedo, vec3 f0, float metal, float rough) {
  return shade(n, v, normalize(position - vWorld), radiance, albedo, f0, metal, rough);
}

vec3 toneMap(vec3 x) {
  x = x * (2.51 * x + 0.03) / (x * (2.43 * x + 0.59) + 0.14);
  return pow(clamp(x, 0.0, 1.0), vec3(1.0 / 2.2));
}

void main() {
  vec3 n = normalize(vNormal);
  vec3 v = normalize(uEye - vWorld);
  float nv = max(dot(n, v), 0.0);

  if (uKind == 1) {
    // The core: brand blue, brightest where it faces you, with a small glassy highlight.
    vec3 deep = vec3(0.003, 0.05, 0.80);
    vec3 hot = vec3(0.10, 0.34, 1.00);
    vec3 glow = mix(deep, hot, pow(nv, 1.8)) * (0.3 + 1.0 * uCore);
    vec3 h = normalize(normalize(vec3(2.6, 4.2, 3.2) - vWorld) + v);
    glow += vec3(1.0) * pow(max(dot(n, h), 0.0), 120.0) * 0.45;
    glow += vec3(0.15, 0.35, 1.0) * pow(1.0 - nv, 2.5) * 0.35 * uCore;
    outColor = vec4(toneMap(glow), 1.0);
    return;
  }

  float trim = vTrim * uTrim;
  vec3 albedo = mix(vec3(0.007, 0.007, 0.008), vec3(0.76, 0.56, 0.28), trim);
  float metal = trim;
  float rough = mix(0.42, 0.26, trim);
  vec3 f0 = mix(vec3(0.04), albedo, metal);

  // The key is up and to the right, away from where the faces mirror the camera, so the faces stay
  // dark and the edges catch it; cool rims from behind outline both sides.
  vec3 color = vec3(0.0);
  color += lamp(vec3(2.6, 4.2, 3.2), n, v, vec3(3.0, 2.9, 2.75), albedo, f0, metal, rough);
  color += lamp(vec3(4.4, 1.2, -2.8), n, v, vec3(1.9, 2.1, 2.5), albedo, f0, metal, rough);
  color += lamp(vec3(-4.2, 2.4, -2.4), n, v, vec3(1.5, 1.65, 2.0), albedo, f0, metal, rough);
  color += lamp(vec3(-1.0, -3.6, 4.0), n, v, vec3(0.22), albedo, f0, metal, rough);

  // The core lights the faces turned toward it.
  vec3 toCore = -vWorld;
  float distance = length(toCore);
  vec3 coreLight = vec3(0.05, 0.26, 1.0) * uCore * 2.6 / (1.0 + 7.0 * distance * distance);
  color += shade(n, v, toCore / distance, coreLight, albedo, f0, metal, rough);

  vec3 r = reflect(-v, n);
  color += studio(r, vWorld, rough) * fresnel(f0, nv) * (1.0 - rough * 0.5);
  color += albedo * 0.02;
  outColor = vec4(toneMap(color), 1.0);
}`

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function upload(gl: WebGL2RenderingContext, program: WebGLProgram, mesh: Mesh) {
  const vao = gl.createVertexArray()
  gl.bindVertexArray(vao)
  const vertices = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vertices)
  gl.bufferData(gl.ARRAY_BUFFER, mesh.vertices, gl.STATIC_DRAW)
  const indices = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW)
  const stride = vertexStride * 4
  const attribute = (name: string, size: number, offset: number) => {
    const location = gl.getAttribLocation(program, name)
    if (location < 0) return
    gl.enableVertexAttribArray(location)
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, stride, offset * 4)
  }
  attribute('aPosition', 3, 0)
  attribute('aNormal', 3, 3)
  attribute('aTrim', 1, 6)
  gl.bindVertexArray(null)
  return { vao, count: mesh.indices.length, buffers: [vertices, indices] }
}

/** Ease out with a little overshoot, for pieces springing into place. */
function settle(t: number) {
  const x = Math.min(1, Math.max(0, t))
  const s = 1.15
  return 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2)
}

const pose = { yaw: -0.46, pitch: -0.22 }
const camera = { distance: 6.6, fov: (22 * Math.PI) / 180 }

export function createMarkScene(
  canvas: HTMLCanvasElement,
  { still, onLost }: { still: boolean; onLost: () => void },
): MarkScene | null {
  const gl = canvas.getContext('webgl2', { antialias: true, alpha: true, premultipliedAlpha: true })
  if (!gl) return null

  const vertex = compile(gl, gl.VERTEX_SHADER, vertexShader)
  const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentShader)
  const program = gl.createProgram()
  if (!vertex || !fragment || !program) return null
  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null

  const unit = 256
  const segments = markShape.segments.map((d) => {
    const mesh = buildSegment(d, markShape.dot, unit, { halfDepth: 0.125, bevel: 0.026, bevelSteps: 6 })
    const length = Math.hypot(...mesh.centre)
    return {
      ...upload(gl, program, mesh),
      centre: mesh.centre,
      outward: [mesh.centre[0] / length, mesh.centre[1] / length] as [number, number],
    }
  })
  const core = upload(gl, program, buildSphere(markShape.dot.r / unit, 24, 40))

  const uniforms = {
    model: gl.getUniformLocation(program, 'uModel'),
    viewProjection: gl.getUniformLocation(program, 'uViewProjection'),
    eye: gl.getUniformLocation(program, 'uEye'),
    core: gl.getUniformLocation(program, 'uCore'),
    trim: gl.getUniformLocation(program, 'uTrim'),
    kind: gl.getUniformLocation(program, 'uKind'),
  }

  const info = gl.getExtension('WEBGL_debug_renderer_info')
  const renderer = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER))
  const animate = !still && !/swiftshader|llvmpipe|software/i.test(renderer)

  const state = { yaw: pose.yaw, pitch: pose.pitch, open: 0 }
  const target = { yaw: 0, pitch: 0, open: 0 }
  let elapsed = animate ? 0 : 10
  let frame = 0
  let last = 0
  let active = false
  let lost = false

  function draw() {
    const width = canvas.width
    const height = canvas.height
    gl!.viewport(0, 0, width, height)
    gl!.clearColor(0, 0, 0, 0)
    gl!.clear(gl!.COLOR_BUFFER_BIT | gl!.DEPTH_BUFFER_BIT)
    gl!.enable(gl!.DEPTH_TEST)
    gl!.enable(gl!.CULL_FACE)
    gl!.useProgram(program)

    const projection = perspective(camera.fov, width / Math.max(1, height), 0.1, 20)
    gl!.uniformMatrix4fv(uniforms.viewProjection, false, multiply(projection, translation(0, 0, -camera.distance)))
    gl!.uniform3f(uniforms.eye, 0, 0, camera.distance)
    gl!.uniform1f(uniforms.trim, 1)

    // The mark faces you while its pieces arrive and turns into its three-quarter pose as they land.
    const turn = 1 - Math.pow(1 - Math.min(1, elapsed / 1.8), 3)
    const drift = animate ? Math.min(1, elapsed / 2.5) : 0
    const yaw = state.yaw * turn + drift * 0.15 * Math.sin(elapsed * 0.33)
    const pitch = state.pitch * turn + drift * 0.06 * Math.sin(elapsed * 0.26 + 1.3)
    const mark = multiply(rotationY(yaw), rotationX(pitch))

    segments.forEach((segment, index) => {
      // Each segment springs in from behind and outside along its own direction, turning into
      // place; while the pointer is over the mark, the segments part and come forward a little.
      const intro = 1 - settle((elapsed - 0.1 - index * 0.2) / 1.1)
      const spread = intro * 0.13 + state.open * 0.42
      const [cx, cy] = segment.centre
      const [ox, oy] = segment.outward
      const model = multiply(
        mark,
        multiply(
          translation(cx + ox * spread, cy + oy * spread, state.open * 0.3 - intro * 0.5),
          multiply(
            multiply(rotationZ(-0.7 * intro - 0.08 * state.open), rotationAbout([-oy, ox], 0.4 * intro)),
            translation(-cx, -cy, 0),
          ),
        ),
      )
      gl!.uniformMatrix4fv(uniforms.model, false, model)
      gl!.uniform1i(uniforms.kind, 0)
      gl!.uniform1f(uniforms.core, Math.min(1, Math.max(0, (elapsed - 0.8) / 0.9)) * (1 + state.open * 0.6))
      gl!.bindVertexArray(segment.vao)
      gl!.drawElements(gl!.TRIANGLES, segment.count, gl!.UNSIGNED_SHORT, 0)
    })

    const landed = Math.max(0, Math.min(1, (elapsed - 0.75) / 0.8))
    gl!.uniformMatrix4fv(uniforms.model, false, multiply(mark, scaling(Math.max(0.001, settle(landed)))))
    gl!.uniform1i(uniforms.kind, 1)
    gl!.bindVertexArray(core.vao)
    gl!.drawElements(gl!.TRIANGLES, core.count, gl!.UNSIGNED_SHORT, 0)
    gl!.bindVertexArray(null)
  }

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2)
    const width = Math.max(1, Math.round(canvas.clientWidth * ratio))
    const height = Math.max(1, Math.round(canvas.clientHeight * ratio))
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
    }
    if (!frame && !lost) draw()
  }

  function tick(now: number) {
    frame = requestAnimationFrame(tick)
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016)
    last = now
    elapsed += dt
    const ease = 1 - Math.exp(-dt * 3.2)
    state.yaw += (pose.yaw + target.yaw - state.yaw) * ease
    state.pitch += (pose.pitch + target.pitch - state.pitch) * ease
    state.open += (target.open - state.open) * (1 - Math.exp(-dt * 4.5))
    draw()
  }

  function pointer(event: PointerEvent) {
    if (event.pointerType === 'touch') return
    const box = canvas.getBoundingClientRect()
    const x = (event.clientX - (box.left + box.width / 2)) / (box.width / 2)
    const y = (event.clientY - (box.top + box.height / 2)) / (box.height / 2)
    target.yaw = Math.max(-1, Math.min(1, x)) * 0.2
    target.pitch = Math.max(-1, Math.min(1, y)) * 0.14
    target.open = Math.hypot(x, y) < 0.62 ? 0.11 : 0
  }

  function leave(event: PointerEvent) {
    if (event.relatedTarget) return
    target.yaw = 0
    target.pitch = 0
    target.open = 0
  }

  function contextLost(event: Event) {
    event.preventDefault()
    lost = true
    cancelAnimationFrame(frame)
    frame = 0
    onLost()
  }

  const observer = new ResizeObserver(resize)
  observer.observe(canvas)
  canvas.addEventListener('webglcontextlost', contextLost)
  resize()

  return {
    setActive(next) {
      if (!animate || lost || next === active) return
      active = next
      if (active) {
        last = 0
        frame = requestAnimationFrame(tick)
        document.addEventListener('pointermove', pointer, { passive: true })
        document.addEventListener('pointerout', leave, { passive: true })
      } else {
        cancelAnimationFrame(frame)
        frame = 0
        document.removeEventListener('pointermove', pointer)
        document.removeEventListener('pointerout', leave)
      }
    },
    dispose() {
      this.setActive(false)
      cancelAnimationFrame(frame)
      observer.disconnect()
      canvas.removeEventListener('webglcontextlost', contextLost)
      for (const mesh of [...segments, core]) {
        gl.deleteVertexArray(mesh.vao)
        mesh.buffers.forEach((buffer) => gl.deleteBuffer(buffer))
      }
      gl.deleteProgram(program)
      gl.deleteShader(vertex)
      gl.deleteShader(fragment)
    },
  }
}
