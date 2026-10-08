/**
 * Geometry for the 3D KMRL mark: each bracket segment extruded into a solid with rounded
 * edges, and a sphere for the dot. Units are world units: the dot sits at the origin and the mark
 * spans about ±0.9 in x and y, facing +z.
 */

type Point = [number, number]

/** Interleaved vertices: position (3), normal (3), trim (1, 1 on the front rounded edge). */
export const vertexStride = 7

export type Mesh = { vertices: Float32Array; indices: Uint16Array }
export type SegmentMesh = Mesh & { centre: Point }

/** Samples an absolute M/L/C SVG path into a polyline, `steps` points per curve. */
function samplePath(d: string, steps: number): Point[] {
  const tokens = d.match(/[MLC]|-?\d*\.?\d+/g) ?? []
  const points: Point[] = []
  let command = 'M'
  let index = 0
  const read = () => Number(tokens[index++])

  while (index < tokens.length) {
    const token = tokens[index]
    if (token === 'M' || token === 'L' || token === 'C') {
      command = token
      index++
    } else if (command === 'C') {
      const [x0, y0] = points[points.length - 1]
      const [x1, y1, x2, y2, x3, y3] = [read(), read(), read(), read(), read(), read()]
      for (let step = 1; step <= steps; step++) {
        const t = step / steps
        const u = 1 - t
        const a = u * u * u
        const b = 3 * u * u * t
        const c = 3 * u * t * t
        const e = t * t * t
        points.push([a * x0 + b * x1 + c * x2 + e * x3, a * y0 + b * y1 + c * y2 + e * y3])
      }
    } else {
      points.push([read(), read()])
    }
  }

  const [first, last] = [points[0], points[points.length - 1]]
  if (Math.hypot(first[0] - last[0], first[1] - last[1]) < 1e-6) points.pop()
  return points
}

function distanceToLine(p: Point, a: Point, b: Point) {
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const length = Math.hypot(dx, dy)
  if (length < 1e-9) return Math.hypot(p[0] - a[0], p[1] - a[1])
  return Math.abs(dx * (a[1] - p[1]) - dy * (a[0] - p[0])) / length
}

/** Ramer–Douglas–Peucker on an open run of points, keeping both ends. */
function simplifyRun(points: Point[], tolerance: number): Point[] {
  if (points.length < 3) return points
  let farthest = 0
  let index = 0
  for (let i = 1; i < points.length - 1; i++) {
    const distance = distanceToLine(points[i], points[0], points[points.length - 1])
    if (distance > farthest) {
      farthest = distance
      index = i
    }
  }
  if (farthest <= tolerance) return [points[0], points[points.length - 1]]
  const left = simplifyRun(points.slice(0, index + 1), tolerance)
  return [...left.slice(0, -1), ...simplifyRun(points.slice(index), tolerance)]
}

/** Simplifies a closed outline by splitting it at the point farthest from its first point. */
function simplifyLoop(points: Point[], tolerance: number): Point[] {
  let split = 0
  let farthest = 0
  points.forEach((point, i) => {
    const distance = Math.hypot(point[0] - points[0][0], point[1] - points[0][1])
    if (distance > farthest) {
      farthest = distance
      split = i
    }
  })
  const first = simplifyRun(points.slice(0, split + 1), tolerance)
  const second = simplifyRun([...points.slice(split), points[0]], tolerance)
  return [...first.slice(0, -1), ...second.slice(0, -1)]
}

function signedArea(points: Point[]) {
  let area = 0
  points.forEach(([x0, y0], i) => {
    const [x1, y1] = points[(i + 1) % points.length]
    area += x0 * y1 - x1 * y0
  })
  return area / 2
}

/** Outward vertex normals of a counter-clockwise outline, weighting each edge by its length. */
function outlineNormals(points: Point[]): Point[] {
  return points.map((point, i) => {
    const previous = points[(i + points.length - 1) % points.length]
    const next = points[(i + 1) % points.length]
    const nx = point[1] - previous[1] + (next[1] - point[1])
    const ny = previous[0] - point[0] + (point[0] - next[0])
    const length = Math.hypot(nx, ny) || 1
    return [nx / length, ny / length]
  })
}

function cross(a: Point, b: Point, c: Point) {
  return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
}

function inTriangle(p: Point, a: Point, b: Point, c: Point) {
  return cross(a, b, p) >= 0 && cross(b, c, p) >= 0 && cross(c, a, p) >= 0
}

/** Ear-clips a simple counter-clockwise polygon into triangles (indices into `points`). */
function triangulate(points: Point[]): number[] {
  const triangles: number[] = []
  const remaining = points.map((_, i) => i)

  while (remaining.length > 3) {
    let clipped = false
    for (let i = 0; i < remaining.length && !clipped; i++) {
      const a = remaining[(i + remaining.length - 1) % remaining.length]
      const b = remaining[i]
      const c = remaining[(i + 1) % remaining.length]
      const turn = cross(points[a], points[b], points[c])
      if (turn <= 0) continue
      const blocked = remaining.some(
        (j) => j !== a && j !== b && j !== c && inTriangle(points[j], points[a], points[b], points[c]),
      )
      if (blocked) continue
      triangles.push(a, b, c)
      remaining.splice(i, 1)
      clipped = true
    }
    // Only collinear or degenerate corners are left: drop the flattest one and carry on.
    if (!clipped) {
      let flattest = 0
      let smallest = Infinity
      remaining.forEach((b, i) => {
        const a = remaining[(i + remaining.length - 1) % remaining.length]
        const c = remaining[(i + 1) % remaining.length]
        const turn = Math.abs(cross(points[a], points[b], points[c]))
        if (turn < smallest) {
          smallest = turn
          flattest = i
        }
      })
      remaining.splice(flattest, 1)
    }
  }
  triangles.push(...remaining)
  return triangles
}

type SegmentOptions = {
  /** Half the extrusion depth. */
  halfDepth: number
  /** Radius of the rounded edges. */
  bevel: number
  /** Rings in each quarter-round edge. */
  bevelSteps: number
}

/**
 * Extrudes one traced segment. `dot` and `unit` map the 512-unit SVG box into world units around
 * the dot (y up).
 */
export function buildSegment(
  d: string,
  dot: { cx: number; cy: number },
  unit: number,
  { halfDepth, bevel, bevelSteps }: SegmentOptions,
): SegmentMesh {
  let outline = simplifyLoop(samplePath(d, 16), 0.18).map(
    ([x, y]): Point => [(x - dot.cx) / unit, (dot.cy - y) / unit],
  )
  if (signedArea(outline) < 0) outline = outline.reverse()
  const normals = outlineNormals(outline)
  const count = outline.length

  // Rings from the front face's edge, around the rounded edge and down the wall to the back face.
  const rings: { inset: number; z: number; nScale: number; nz: number; trim: number }[] = []
  for (let step = bevelSteps; step >= 0; step--) {
    const angle = (step / bevelSteps) * (Math.PI / 2)
    rings.push({
      inset: bevel * (1 - Math.cos(angle)),
      z: halfDepth - bevel + bevel * Math.sin(angle),
      nScale: Math.cos(angle),
      nz: Math.sin(angle),
      trim: step > 0 && step < bevelSteps ? 1 : 0,
    })
  }
  for (let step = 0; step <= bevelSteps; step++) {
    const angle = (step / bevelSteps) * (Math.PI / 2)
    rings.push({
      inset: bevel * (1 - Math.cos(angle)),
      z: -(halfDepth - bevel + bevel * Math.sin(angle)),
      nScale: Math.cos(angle),
      nz: -Math.sin(angle),
      trim: 0,
    })
  }

  const vertices = new Float32Array(rings.length * count * vertexStride)
  let offset = 0
  for (const ring of rings) {
    outline.forEach(([x, y], i) => {
      const [nx, ny] = normals[i]
      vertices.set(
        [x - nx * ring.inset, y - ny * ring.inset, ring.z, nx * ring.nScale, ny * ring.nScale, ring.nz, ring.trim],
        offset,
      )
      offset += vertexStride
    })
  }

  const indices: number[] = []
  for (let r = 0; r < rings.length - 1; r++) {
    const a = r * count
    const b = (r + 1) * count
    for (let i = 0; i < count; i++) {
      const j = (i + 1) % count
      indices.push(a + i, b + i, b + j, a + i, b + j, a + j)
    }
  }

  // Faces: the first ring is the front face's outline, the last the back face's.
  const face = triangulate(outline.map(([x, y], i): Point => [
    x - normals[i][0] * bevel,
    y - normals[i][1] * bevel,
  ]))
  const back = (rings.length - 1) * count
  for (let t = 0; t < face.length; t += 3) {
    indices.push(face[t], face[t + 1], face[t + 2])
    indices.push(back + face[t], back + face[t + 2], back + face[t + 1])
  }

  // The segment's area centroid, which it turns about and moves away from.
  let area = 0
  let cx = 0
  let cy = 0
  outline.forEach(([x0, y0], i) => {
    const [x1, y1] = outline[(i + 1) % count]
    const step = x0 * y1 - x1 * y0
    area += step
    cx += (x0 + x1) * step
    cy += (y0 + y1) * step
  })

  return {
    vertices,
    indices: new Uint16Array(indices),
    centre: [cx / (3 * area), cy / (3 * area)],
  }
}

/** A UV sphere at the origin, in the same vertex layout. */
export function buildSphere(radius: number, rings: number, sectors: number): Mesh {
  const vertices = new Float32Array((rings + 1) * (sectors + 1) * vertexStride)
  let offset = 0
  for (let r = 0; r <= rings; r++) {
    const polar = (r / rings) * Math.PI
    for (let s = 0; s <= sectors; s++) {
      const azimuth = (s / sectors) * Math.PI * 2
      const nx = Math.sin(polar) * Math.cos(azimuth)
      const ny = Math.cos(polar)
      const nz = Math.sin(polar) * Math.sin(azimuth)
      vertices.set([nx * radius, ny * radius, nz * radius, nx, ny, nz, 0], offset)
      offset += vertexStride
    }
  }
  const indices: number[] = []
  for (let r = 0; r < rings; r++) {
    for (let s = 0; s < sectors; s++) {
      const a = r * (sectors + 1) + s
      const b = a + sectors + 1
      indices.push(a, a + 1, b, a + 1, b + 1, b)
    }
  }
  return { vertices, indices: new Uint16Array(indices) }
}
