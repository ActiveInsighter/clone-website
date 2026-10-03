import { HERO_ARTWORK, type HeroFrame } from "./hero-geometry"

export interface HeroRenderer {
  draw(frame: HeroFrame, width: number, height: number): void
  dispose(): void
}

const vertexSource = `
attribute vec2 aPosition;
void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }
`

// One textured pass per artwork. The circle correction keeps the photographic
// horizon on the shared panoramic arc without stretching the source into strips.
const fragmentSource = `
precision highp float;
uniform sampler2D uTexture;
uniform vec2 uView, uImage, uAnchor, uPivot, uBand;
uniform vec3 uHorizon, uArtworkCircle;
uniform float uDpr, uRotation, uScale, uBend, uEdge;
void main() {
  vec2 screen = vec2(gl_FragCoord.x / uDpr, uView.y - gl_FragCoord.y / uDpr);
  float torn = sin(screen.y * 0.021 + uEdge) * 0.55 + sin(screen.y * 0.39 + uEdge) * 0.2;
  if (screen.x < uBand.x + (uBand.x > 0.0 ? torn : 0.0) || screen.x > uBand.y + (uBand.y < uView.x ? torn : 0.0)) discard;
  vec2 ray = normalize(screen - uHorizon.xy);
  vec2 centers = uArtworkCircle.xy - uHorizon.xy;
  float projection = dot(ray, centers);
  float discriminant = projection * projection - dot(centers, centers) + uArtworkCircle.z * uArtworkCircle.z;
  float correction = clamp(projection + sqrt(max(discriminant, 0.0)) - uHorizon.z, -uBend, uBend);
  vec2 offset = screen + ray * correction - uAnchor;
  float cosine = cos(uRotation), sine = sin(uRotation);
  vec2 photo = vec2(offset.x * cosine + offset.y * sine, -offset.x * sine + offset.y * cosine) / uScale + uPivot;
  vec3 color = texture2D(uTexture, clamp(photo / uImage, vec2(0.0005), vec2(0.9995))).rgb;
  vec2 overflow = max(-photo, photo - uImage);
  float outside = max(overflow.x, overflow.y);
  color = mix(color, vec3(0.03, 0.035, 0.05), smoothstep(0.0, uImage.y * 0.08, outside));
  gl_FragColor = vec4(color, 1.0);
}
`

function loadArtwork(src: string, signal: AbortSignal): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    function clean() {
      image.onload = image.onerror = null
      signal.removeEventListener("abort", abort)
    }
    function abort() {
      clean()
      image.src = ""
      reject(new DOMException("Hero loading cancelled", "AbortError"))
    }
    image.onload = () => { clean(); resolve(image) }
    image.onerror = () => { clean(); reject(new Error("Hero artwork could not be loaded")) }
    if (signal.aborted) { abort(); return }
    signal.addEventListener("abort", abort, { once: true })
    image.decoding = "async"
    image.src = src
  })
}

/** Creates only local resources; callers dispose on unmount and context loss. */
export async function createHeroRenderer(canvas: HTMLCanvasElement, signal: AbortSignal): Promise<HeroRenderer> {
  const gl = canvas.getContext("webgl", { alpha: false, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: false, powerPreference: "low-power" })
  if (!gl) throw new Error("WebGL unavailable; use the local artwork fallback")
  const textures = new Map<string, WebGLTexture>()
  const shaders: WebGLShader[] = []
  let program: WebGLProgram | null = null
  let buffer: WebGLBuffer | null = null
  let disposed = false
  function dispose() {
    if (disposed) return
    disposed = true
    // Unbind before deletion: a currently bound program stays alive otherwise.
    gl?.useProgram(null)
    gl?.bindBuffer(gl.ARRAY_BUFFER, null)
    gl?.bindTexture(gl.TEXTURE_2D, null)
    textures.forEach((texture) => gl?.deleteTexture(texture))
    textures.clear()
    shaders.forEach((shader) => gl?.deleteShader(shader))
    if (buffer) gl?.deleteBuffer(buffer)
    if (program) gl?.deleteProgram(program)
  }
  function compile(kind: number, source: string) {
    const shader = gl?.createShader(kind)
    if (!shader || !gl) throw new Error("Hero shader allocation failed")
    shaders.push(shader)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? "Hero shader compilation failed")
    return shader
  }
  try {
    program = gl.createProgram()
    if (!program) throw new Error("Hero program allocation failed")
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource))
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource))
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? "Hero program link failed")
    const images = await Promise.all(HERO_ARTWORK.map((artwork) => loadArtwork(artwork.src, signal)))
    if (signal.aborted || gl.isContextLost()) throw new DOMException("Hero context interrupted", "AbortError")
    images.forEach((image, index) => {
      const texture = gl.createTexture()
      if (!texture) throw new Error("Hero texture allocation failed")
      textures.set(HERO_ARTWORK[index].id, texture)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    })
    gl.useProgram(program)
    buffer = gl.createBuffer()
    if (!buffer) throw new Error("Hero vertex allocation failed")
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, "aPosition")
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
    const names = ["uTexture", "uView", "uImage", "uAnchor", "uPivot", "uBand", "uHorizon", "uArtworkCircle", "uDpr", "uRotation", "uScale", "uBend", "uEdge"] as const
    const uniforms = Object.fromEntries(names.map((name) => [name, gl.getUniformLocation(program!, name)])) as Record<typeof names[number], WebGLUniformLocation | null>
    return {
      draw(frame, width, height) {
        if (disposed || gl.isContextLost() || !program || width <= 0 || height <= 0) return
        // Limit framebuffer area as well as DPR on unusually large displays.
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5, Math.sqrt(3500000 / (width * height)))
        const pixelWidth = Math.max(1, Math.round(width * dpr)), pixelHeight = Math.max(1, Math.round(height * dpr))
        if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
          canvas.width = pixelWidth
          canvas.height = pixelHeight
        }
        gl.viewport(0, 0, pixelWidth, pixelHeight)
        gl.useProgram(program)
        gl.uniform2f(uniforms.uView, width, height)
        gl.uniform1f(uniforms.uDpr, dpr)
        gl.uniform3f(uniforms.uHorizon, frame.circle.cx, frame.circle.cy, frame.circle.radius)
        gl.uniform1i(uniforms.uTexture, 0)
        gl.activeTexture(gl.TEXTURE0)
        gl.clearColor(0.05, 0.047, 0.043, 1)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.enable(gl.SCISSOR_TEST)
        for (const layer of frame.layers) {
          const { artwork, placement } = layer
          // Scissoring makes narrow side panels inexpensive, even on mobile GPUs.
          const start = Math.max(0, Math.floor(layer.band[0] * dpr) - 2)
          const end = Math.min(pixelWidth, Math.ceil(layer.band[1] * dpr) + 2)
          gl.scissor(start, 0, end - start, pixelHeight)
          gl.bindTexture(gl.TEXTURE_2D, textures.get(artwork.id) ?? null)
          gl.uniform2f(uniforms.uImage, artwork.width, artwork.height)
          gl.uniform2f(uniforms.uAnchor, placement.anchor.x, placement.anchor.y)
          gl.uniform2f(uniforms.uPivot, placement.pivot.x, placement.pivot.y)
          gl.uniform2f(uniforms.uBand, layer.band[0], layer.band[1])
          gl.uniform3f(uniforms.uArtworkCircle, placement.circle.cx, placement.circle.cy, placement.circle.radius)
          gl.uniform1f(uniforms.uRotation, placement.rotation)
          gl.uniform1f(uniforms.uScale, placement.scale)
          gl.uniform1f(uniforms.uBend, layer.bend)
          gl.uniform1f(uniforms.uEdge, artwork.id === "left" ? 7 : 13)
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
        }
        gl.disable(gl.SCISSOR_TEST)
      },
      dispose,
    }
  } catch (error) {
    dispose()
    throw error
  }
}
