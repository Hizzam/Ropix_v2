"use client"

import { useEffect, useRef, useState } from "react"

const EXPORT_WIDTH = 1920
const EXPORT_HEIGHT = 1080
const DISPLAY_WIDTH = 800
const DISPLAY_HEIGHT = 450
const MOVE_STEP = 50 // how many pixels to move per tap

interface TextItem {
  id: number
  text: string
  x: number
  y: number
  fontSize: number
  color: string
  fontFamily: string
  bold: boolean
  italic: boolean
  strokeColor: string
  strokeWidth: number
}

const FONTS = [
  { label: "Impact", value: "Impact" },
  { label: "Montserrat", value: "Montserrat" },
  { label: "Bangers", value: "Bangers" },
  { label: "Fredoka One", value: "Fredoka One" },
  { label: "Luckiest Guy", value: "Luckiest Guy" },
  { label: "Oswald", value: "Oswald" },
  { label: "Nunito", value: "Nunito" },
  { label: "Arimo", value: "Arimo" },
  { label: "Patrick Hand", value: "Patrick Hand" },
  { label: "Arial", value: "Arial" },
  { label: "Georgia", value: "Georgia" },
  { label: "Comic Sans", value: "Comic Sans MS" },
]

const STYLE_PRESETS = [
  { label: "🔥 Epic", fontSize: 130, color: "#ffcc00", strokeColor: "#ff4400", strokeWidth: 12, fontFamily: "Impact", bold: true, italic: false },
  { label: "❄️ Frost", fontSize: 120, color: "#aaddff", strokeColor: "#0055ff", strokeWidth: 10, fontFamily: "Montserrat", bold: true, italic: false },
  { label: "💀 Dark", fontSize: 120, color: "#ffffff", strokeColor: "#000000", strokeWidth: 14, fontFamily: "Oswald", bold: true, italic: false },
  { label: "🌈 Fun", fontSize: 120, color: "#ff44ff", strokeColor: "#ffff00", strokeWidth: 8, fontFamily: "Fredoka One", bold: true, italic: false },
  { label: "⚡ Neon", fontSize: 130, color: "#00ffcc", strokeColor: "#0000ff", strokeWidth: 10, fontFamily: "Bangers", bold: true, italic: false },
  { label: "🎮 Game", fontSize: 130, color: "#ffffff", strokeColor: "#ff8800", strokeWidth: 10, fontFamily: "Bangers", bold: true, italic: false },
]

type DragMode = "move" | "resize-br" | null

export default function ThumbnailEditor({ imageUrl }: { imageUrl: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const [texts, setTexts] = useState<TextItem[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingText, setEditingText] = useState("")
  const [downloaded, setDownloaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const dragMode = useRef<DragMode>(null)
  const dragOffset = useRef({ x: 0, y: 0 })
  const dragStartFontSize = useRef(0)
  const dragStartY = useRef(0)
  const isDragging = useRef(false)

  const selectedText = texts.find((t) => t.id === selectedId) ?? null

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => { imgRef.current = img; redraw(img, texts, selectedId) }
    img.src = imageUrl
  }, [imageUrl])

  useEffect(() => {
    if (imgRef.current) redraw(imgRef.current, texts, selectedId)
  }, [texts, selectedId])

  const getFont = (item: TextItem) =>
    `${item.italic ? "italic " : ""}${item.bold ? "bold " : ""}${item.fontSize}px "${item.fontFamily}"`

  const getTextBounds = (ctx: CanvasRenderingContext2D, item: TextItem) => {
    ctx.font = getFont(item)
    const width = ctx.measureText(item.text).width
    const height = item.fontSize
    return {
      left: item.x - width / 2 - 12,
      top: item.y - height - 8,
      right: item.x + width / 2 + 12,
      bottom: item.y + 16,
      width: width + 24,
      height: height + 24,
    }
  }

  const HANDLE_SIZE = 40

  const redraw = (img: HTMLImageElement, textItems: TextItem[], activeId: number | null) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    ctx.clearRect(0, 0, EXPORT_WIDTH, EXPORT_HEIGHT)

    const imgAspect = img.naturalWidth / img.naturalHeight
    const canvasAspect = EXPORT_WIDTH / EXPORT_HEIGHT
    let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight
    if (imgAspect > canvasAspect) {
      sw = img.naturalHeight * canvasAspect
      sx = (img.naturalWidth - sw) / 2
    } else {
      sh = img.naturalWidth / canvasAspect
      sy = (img.naturalHeight - sh) / 2
    }
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, EXPORT_WIDTH, EXPORT_HEIGHT)

    textItems.forEach((item) => {
      ctx.save()
      ctx.font = getFont(item)
      ctx.textAlign = "center"
      ctx.shadowColor = "rgba(0,0,0,0.7)"
      ctx.shadowBlur = 18
      ctx.shadowOffsetX = 5
      ctx.shadowOffsetY = 5
      if (item.strokeWidth > 0) {
        ctx.strokeStyle = item.strokeColor
        ctx.lineWidth = item.strokeWidth
        ctx.lineJoin = "round"
        ctx.strokeText(item.text, item.x, item.y)
      }
      ctx.fillStyle = item.color
      ctx.fillText(item.text, item.x, item.y)
      if (item.id === activeId) {
        const b = getTextBounds(ctx, item)
        ctx.shadowColor = "transparent"
        ctx.strokeStyle = "#facc15"
        ctx.lineWidth = 4
        ctx.setLineDash([12, 6])
        ctx.strokeRect(b.left, b.top, b.width, b.height)
        ctx.setLineDash([])
        ctx.fillStyle = "#facc15"
        ctx.beginPath()
        ctx.roundRect(b.right - HANDLE_SIZE / 2, b.bottom - HANDLE_SIZE / 2, HANDLE_SIZE, HANDLE_SIZE, 6)
        ctx.fill()
        ctx.fillStyle = "#000"
        ctx.font = "bold 22px Arial"
        ctx.textAlign = "center"
        ctx.fillText("⤡", b.right, b.bottom + 8)
      }
      ctx.restore()
    })
  }

  const getMousePos = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left) * (EXPORT_WIDTH / rect.width),
      y: (e.clientY - rect.top) * (EXPORT_HEIGHT / rect.height),
    }
  }

  const hitTest = (pos: { x: number; y: number }) => {
    const ctx = canvasRef.current!.getContext("2d")!
    if (selectedId !== null) {
      const sel = texts.find(t => t.id === selectedId)
      if (sel) {
        const b = getTextBounds(ctx, sel)
        if (pos.x >= b.right - HANDLE_SIZE && pos.x <= b.right + HANDLE_SIZE / 2 &&
          pos.y >= b.bottom - HANDLE_SIZE && pos.y <= b.bottom + HANDLE_SIZE / 2) {
          return { item: sel, mode: "resize-br" as DragMode }
        }
      }
    }
    for (let i = texts.length - 1; i >= 0; i--) {
      const item = texts[i]
      const b = getTextBounds(ctx, item)
      if (pos.x >= b.left && pos.x <= b.right && pos.y >= b.top && pos.y <= b.bottom) {
        return { item, mode: "move" as DragMode }
      }
    }
    return null
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    const pos = getMousePos(e)
    const hit = hitTest(pos)
    if (hit) {
      dragMode.current = hit.mode
      isDragging.current = false
      setSelectedId(hit.item.id)
      if (hit.mode === "move") {
        dragOffset.current = { x: pos.x - hit.item.x, y: pos.y - hit.item.y }
      } else if (hit.mode === "resize-br") {
        dragStartY.current = pos.y
        dragStartFontSize.current = hit.item.fontSize
      }
    } else {
      setSelectedId(null)
      dragMode.current = null
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragMode.current === null || selectedId === null) return
    isDragging.current = true
    const pos = getMousePos(e)
    if (dragMode.current === "move") {
      setTexts(prev => prev.map(t =>
        t.id === selectedId ? { ...t, x: pos.x - dragOffset.current.x, y: pos.y - dragOffset.current.y } : t
      ))
    } else if (dragMode.current === "resize-br") {
      const delta = pos.y - dragStartY.current
      const newSize = Math.max(30, Math.min(400, dragStartFontSize.current + delta))
      setTexts(prev => prev.map(t => t.id === selectedId ? { ...t, fontSize: Math.round(newSize) } : t))
    }
    if (canvasRef.current) canvasRef.current.style.cursor = dragMode.current === "resize-br" ? "nwse-resize" : "move"
  }

  const handleMouseUp = () => {
    if (!isDragging.current && dragMode.current === "move" && selectedId !== null) {
      const hit = texts.find(t => t.id === selectedId)
      if (hit) { setEditingId(hit.id); setEditingText(hit.text) }
    }
    dragMode.current = null
    isDragging.current = false
    if (canvasRef.current) canvasRef.current.style.cursor = "move"
  }

  const handleMouseLeave = () => {
    dragMode.current = null
    isDragging.current = false
    if (canvasRef.current) canvasRef.current.style.cursor = "move"
  }

  // ✅ Mobile directional movement
  const moveText = (dx: number, dy: number) => {
    if (selectedId === null) return
    setTexts(prev => prev.map(t =>
      t.id === selectedId
        ? { ...t, x: t.x + dx, y: t.y + dy }
        : t
    ))
  }

  // ✅ Mobile font size
  const changeFontSize = (delta: number) => {
    if (selectedId === null) return
    setTexts(prev => prev.map(t =>
      t.id === selectedId
        ? { ...t, fontSize: Math.max(30, Math.min(400, t.fontSize + delta)) }
        : t
    ))
  }

  const updateSelected = (updates: Partial<TextItem>) => {
    if (selectedId === null) return
    setTexts(prev => prev.map(t => t.id === selectedId ? { ...t, ...updates } : t))
  }

  const applyPreset = (preset: typeof STYLE_PRESETS[0]) => {
    if (selectedId === null) return
    setTexts(prev => prev.map(t => t.id === selectedId ? { ...t, ...preset } : t))
  }

  const addText = () => {
    const newText: TextItem = {
      id: Date.now(), text: "Your Text",
      x: EXPORT_WIDTH / 2, y: EXPORT_HEIGHT / 2,
      fontSize: 130, color: "#ffffff",
      fontFamily: "Impact", bold: true, italic: false,
      strokeColor: "#000000", strokeWidth: 12,
    }
    setTexts(prev => [...prev, newText])
    setSelectedId(newText.id)
    setEditingId(newText.id)
    setEditingText("Your Text")
  }

  const handleDelete = () => {
    if (selectedId === null) return
    setTexts(prev => prev.filter(t => t.id !== selectedId))
    setSelectedId(null)
  }

  const handleEditSave = () => {
    setTexts(prev => prev.map(t => t.id === editingId ? { ...t, text: editingText } : t))
    setEditingId(null)
    setEditingText("")
  }

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (imgRef.current) redraw(imgRef.current, texts, null)
    setTimeout(() => {
      const link = document.createElement("a")
      link.href = canvas.toDataURL("image/png")
      link.download = "ropix-thumbnail.png"
      link.click()
      setDownloaded(true)
      setTimeout(() => setDownloaded(false), 2000)
      if (imgRef.current) redraw(imgRef.current, texts, selectedId)
    }, 50)
  }

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `${r}, ${g}, ${b}`
  }

  const TEXT_QUICK_COLORS = ["#ffffff", "#000000", "#ffff00", "#ff4444", "#00ffcc"]
  const OUTLINE_QUICK_COLORS = ["#000000", "#ffffff", "#ff4400", "#0055ff", "#ff00ff"]

  return (
    <div className="flex flex-col items-center gap-4 w-full">

      {/* Mobile notice */}
      {isMobile && (
        <div className="w-full bg-yellow-400/10 border border-yellow-400/20 rounded-xl p-3 text-center">
          <p className="text-yellow-400 font-bold text-xs">💻 For optimal experience use desktop</p>
          <p className="text-white/40 text-xs mt-0.5">Use the arrow buttons below to move text on mobile</p>
        </div>
      )}

      {/* Canvas */}
      <div className="w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          width={EXPORT_WIDTH}
          height={EXPORT_HEIGHT}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          style={{
            width: "100%",
            maxWidth: `${DISPLAY_WIDTH}px`,
            height: "auto",
            borderRadius: "12px",
            cursor: "move",
            display: "block",
            margin: "0 auto",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        />
      </div>

      <p className="text-xs text-white/20 text-center hidden md:block">Click text to edit · Drag to move · Drag ⤡ to resize</p>

      {/* Edit input */}
      {editingId !== null && (
        <div className="flex gap-2 items-center bg-white/5 border border-white/10 p-3 rounded-xl w-full">
          <input
            autoFocus
            type="text"
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleEditSave()}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-yellow-400/50 text-sm min-w-0"
            placeholder="Type your text..."
          />
          <button onClick={handleEditSave} className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-3 py-2 rounded-lg text-sm whitespace-nowrap">
            Save
          </button>
          <button onClick={() => setEditingId(null)} className="bg-white/10 text-white/60 px-3 py-2 rounded-lg text-sm hover:bg-white/20 transition whitespace-nowrap">
            Cancel
          </button>
        </div>
      )}

      {/* Style controls */}
      {selectedText && (
        <div className="w-full bg-[#1a1a2e] border border-white/10 rounded-2xl p-4 flex flex-col gap-4">

          {/* ✅ Mobile directional controls */}
          {isMobile && (
            <div>
              <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-3">Move Text</p>
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => moveText(0, -MOVE_STEP)}
                  className="w-12 h-12 bg-white/10 border border-white/20 rounded-xl text-white text-xl font-bold hover:bg-white/20 transition flex items-center justify-center"
                >
                  ▲
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => moveText(-MOVE_STEP, 0)}
                    className="w-12 h-12 bg-white/10 border border-white/20 rounded-xl text-white text-xl font-bold hover:bg-white/20 transition flex items-center justify-center"
                  >
                    ◀
                  </button>
                  <button
                    onClick={() => {
                      if (selectedId !== null) {
                        const hit = texts.find(t => t.id === selectedId)
                        if (hit) { setEditingId(hit.id); setEditingText(hit.text) }
                      }
                    }}
                    className="w-12 h-12 bg-yellow-400/20 border border-yellow-400/30 rounded-xl text-yellow-400 text-xs font-bold hover:bg-yellow-400/30 transition flex items-center justify-center"
                  >
                    EDIT
                  </button>
                  <button
                    onClick={() => moveText(MOVE_STEP, 0)}
                    className="w-12 h-12 bg-white/10 border border-white/20 rounded-xl text-white text-xl font-bold hover:bg-white/20 transition flex items-center justify-center"
                  >
                    ▶
                  </button>
                </div>
                <button
                  onClick={() => moveText(0, MOVE_STEP)}
                  className="w-12 h-12 bg-white/10 border border-white/20 rounded-xl text-white text-xl font-bold hover:bg-white/20 transition flex items-center justify-center"
                >
                  ▼
                </button>
                {/* Size controls */}
                <div className="flex gap-3 mt-1">
                  <button
                    onClick={() => changeFontSize(-20)}
                    className="px-5 py-2 bg-white/10 border border-white/20 rounded-xl text-white font-bold hover:bg-white/20 transition text-sm"
                  >
                    A-
                  </button>
                  <span className="text-white/40 text-xs self-center">Size: {Math.round(selectedText.fontSize / 10)}pt</span>
                  <button
                    onClick={() => changeFontSize(20)}
                    className="px-5 py-2 bg-white/10 border border-white/20 rounded-xl text-white font-bold hover:bg-white/20 transition text-sm"
                  >
                    A+
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Presets */}
          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-2">Style Presets</p>
            <div className="grid grid-cols-3 gap-2">
              {STYLE_PRESETS.map((preset) => (
                <button key={preset.label} onClick={() => applyPreset(preset)}
                  className="px-2 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-white hover:border-yellow-400/40 transition text-center">
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Font */}
          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-2">Font</p>
            <div className="grid grid-cols-3 gap-2">
              {FONTS.map((font) => (
                <button key={font.value} onClick={() => updateSelected({ fontFamily: font.value })}
                  style={{ fontFamily: font.value }}
                  className={`px-2 py-1.5 rounded-lg border text-xs transition truncate ${
                    selectedText.fontFamily === font.value
                      ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black border-transparent font-bold"
                      : "bg-white/5 border-white/10 text-white/70 hover:border-yellow-400/30"
                  }`}>
                  {font.label}
                </button>
              ))}
            </div>
          </div>

          {/* Size — desktop only slider */}
          <div className="hidden md:block">
            <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-2">
              Size: <span className="text-yellow-400">{Math.round(selectedText.fontSize / 10)}pt</span>
            </p>
            <input type="range" min={50} max={300} value={selectedText.fontSize}
              onChange={(e) => updateSelected({ fontSize: Number(e.target.value) })}
              className="w-full accent-yellow-400"
            />
          </div>

          {/* Bold / Italic */}
          <div className="flex gap-3">
            <button onClick={() => updateSelected({ bold: !selectedText.bold })}
              className={`px-5 py-1.5 rounded-lg border font-black text-sm transition ${
                selectedText.bold ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black border-transparent" : "bg-white/5 border-white/10 text-white/60"
              }`}>B</button>
            <button onClick={() => updateSelected({ italic: !selectedText.italic })}
              className={`px-5 py-1.5 rounded-lg border italic text-sm transition ${
                selectedText.italic ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black border-transparent" : "bg-white/5 border-white/10 text-white/60"
              }`}>I</button>
          </div>

          {/* Text Color */}
          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-2">Text Color</p>
            <div className="flex items-center gap-3 flex-wrap">
              <label className="relative cursor-pointer">
                <div style={{ backgroundColor: selectedText.color }} className="w-10 h-10 rounded-xl border-2 border-white/20 flex-shrink-0" />
                <input type="color" value={selectedText.color}
                  onChange={(e) => updateSelected({ color: e.target.value })}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
              </label>
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-white font-bold text-xs">{selectedText.color.toUpperCase()}</span>
                <span className="text-white/30 text-xs">RGB({hexToRgb(selectedText.color)})</span>
              </div>
              <div className="flex gap-2 ml-auto flex-wrap">
                {TEXT_QUICK_COLORS.map(c => (
                  <button key={c} onClick={() => updateSelected({ color: c })}
                    style={{ backgroundColor: c, border: selectedText.color === c ? "3px solid #facc15" : "2px solid rgba(255,255,255,0.15)", width: 28, height: 28, borderRadius: "50%", flexShrink: 0 }} />
                ))}
              </div>
            </div>
          </div>

          {/* Outline Color */}
          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-2">Outline Color</p>
            <div className="flex items-center gap-3 flex-wrap">
              <label className="relative cursor-pointer">
                <div style={{ backgroundColor: selectedText.strokeColor }} className="w-10 h-10 rounded-xl border-2 border-white/20 flex-shrink-0" />
                <input type="color" value={selectedText.strokeColor}
                  onChange={(e) => updateSelected({ strokeColor: e.target.value })}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
              </label>
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-white font-bold text-xs">{selectedText.strokeColor.toUpperCase()}</span>
                <span className="text-white/30 text-xs">RGB({hexToRgb(selectedText.strokeColor)})</span>
              </div>
              <div className="flex gap-2 ml-auto flex-wrap">
                {OUTLINE_QUICK_COLORS.map(c => (
                  <button key={c} onClick={() => updateSelected({ strokeColor: c })}
                    style={{ backgroundColor: c, border: selectedText.strokeColor === c ? "3px solid #facc15" : "2px solid rgba(255,255,255,0.15)", width: 28, height: 28, borderRadius: "50%", flexShrink: 0 }} />
                ))}
              </div>
            </div>
          </div>

          {/* Outline Thickness */}
          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-2">
              Outline Thickness: <span className="text-yellow-400">{selectedText.strokeWidth}px</span>
            </p>
            <input type="range" min={0} max={30} value={selectedText.strokeWidth}
              onChange={(e) => updateSelected({ strokeWidth: Number(e.target.value) })}
              className="w-full accent-yellow-400"
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 mt-1 w-full">
        <button onClick={addText}
          className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black px-4 py-2.5 rounded-xl hover:opacity-90 transition shadow-lg shadow-orange-500/20 text-sm">
          + Add Text
        </button>
        {selectedId !== null && (
          <button onClick={handleDelete}
            className="bg-red-500/10 border border-red-500/30 text-red-400 font-bold px-4 py-2.5 rounded-xl hover:bg-red-500/20 transition text-sm">
            Delete
          </button>
        )}
        <button onClick={downloadImage}
          className="flex-1 bg-white/5 border border-white/10 text-white font-bold px-4 py-2.5 rounded-xl hover:bg-white/10 transition text-sm">
          Download
        </button>
      </div>

      {downloaded && <p className="text-green-400 font-semibold text-sm">Downloaded!</p>}
    </div>
  )
}