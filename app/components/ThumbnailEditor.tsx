"use client"

import { useEffect, useRef, useState } from "react"

const EXPORT_WIDTH = 1920
const EXPORT_HEIGHT = 1080
const DISPLAY_WIDTH = 800
const DISPLAY_HEIGHT = 450

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
  const dragMode = useRef<DragMode>(null)
  const dragOffset = useRef({ x: 0, y: 0 })
  const dragStartFontSize = useRef(0)
  const dragStartY = useRef(0)
  const isDragging = useRef(false)

  const selectedText = texts.find((t) => t.id === selectedId) ?? null

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
    const canvas = canvasRef.current!
    const ctx = canvas.getContext("2d")!
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
        t.id === selectedId
          ? { ...t, x: pos.x - dragOffset.current.x, y: pos.y - dragOffset.current.y }
          : t
      ))
    } else if (dragMode.current === "resize-br") {
      const delta = pos.y - dragStartY.current
      const newSize = Math.max(30, Math.min(400, dragStartFontSize.current + delta))
      setTexts(prev => prev.map(t =>
        t.id === selectedId ? { ...t, fontSize: Math.round(newSize) } : t
      ))
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

  // ✅ Helper to convert hex to rgb display string
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `${r}, ${g}, ${b}`
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={EXPORT_WIDTH}
        height={EXPORT_HEIGHT}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{
          width: `${DISPLAY_WIDTH}px`,
          height: `${DISPLAY_HEIGHT}px`,
          borderRadius: "12px",
          cursor: "move",
          display: "block",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      />

      <p className="text-xs text-white/20">Click text to edit · Drag to move · Drag ⤡ handle to resize</p>

      {/* Edit input */}
      {editingId !== null && (
        <div className="flex gap-2 items-center bg-white/5 border border-white/10 p-3 rounded-xl w-full max-w-2xl">
          <input
            autoFocus
            type="text"
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleEditSave()}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-yellow-400/50 text-sm"
            placeholder="Type your text..."
          />
          <button onClick={handleEditSave} className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-4 py-2 rounded-lg text-sm">
            Save
          </button>
          <button onClick={() => setEditingId(null)} className="bg-white/10 text-white/60 px-4 py-2 rounded-lg text-sm hover:bg-white/20 transition">
            Cancel
          </button>
        </div>
      )}

      {/* Style controls */}
      {selectedText && (
        <div className="w-full max-w-2xl bg-[#1a1a2e] border border-white/10 rounded-2xl p-5 flex flex-col gap-5">

          {/* Presets */}
          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-2">Style Presets</p>
            <div className="flex gap-2 flex-wrap">
              {STYLE_PRESETS.map((preset) => (
                <button key={preset.label} onClick={() => applyPreset(preset)}
                  className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-semibold text-white hover:border-yellow-400/40 hover:bg-white/10 transition">
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Font */}
          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-2">Font</p>
            <div className="flex gap-2 flex-wrap">
              {FONTS.map((font) => (
                <button key={font.value} onClick={() => updateSelected({ fontFamily: font.value })}
                  style={{ fontFamily: font.value }}
                  className={`px-3 py-1.5 rounded-lg border text-sm transition ${
                    selectedText.fontFamily === font.value
                      ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black border-transparent font-bold"
                      : "bg-white/5 border-white/10 text-white/70 hover:border-yellow-400/30"
                  }`}>
                  {font.label}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-2">
              Size: <span className="text-yellow-400">{Math.round(selectedText.fontSize / 10)}pt</span>
              <span className="text-white/20 ml-2 normal-case text-xs">(or drag ⤡ on canvas)</span>
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
                selectedText.bold
                  ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black border-transparent"
                  : "bg-white/5 border-white/10 text-white/60 hover:border-yellow-400/30"
              }`}>B</button>
            <button onClick={() => updateSelected({ italic: !selectedText.italic })}
              className={`px-5 py-1.5 rounded-lg border italic text-sm transition ${
                selectedText.italic
                  ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black border-transparent"
                  : "bg-white/5 border-white/10 text-white/60 hover:border-yellow-400/30"
              }`}>I</button>
          </div>

          {/* ✅ Text Color — RGB picker */}
          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-3">Text Color</p>
            <div className="flex items-center gap-4">
              {/* Big color picker button */}
              <label className="relative cursor-pointer group">
                <div
                  style={{ backgroundColor: selectedText.color }}
                  className="w-12 h-12 rounded-xl border-2 border-white/20 group-hover:border-yellow-400/60 transition shadow-lg"
                />
                <input
                  type="color"
                  value={selectedText.color}
                  onChange={(e) => updateSelected({ color: e.target.value })}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </label>
              {/* RGB value display */}
              <div className="flex flex-col gap-0.5">
                <span className="text-white font-bold text-sm">{selectedText.color.toUpperCase()}</span>
                <span className="text-white/30 text-xs">RGB({hexToRgb(selectedText.color)})</span>
              </div>
              {/* Quick white/black shortcuts */}
              <div className="flex gap-2 ml-auto">
                <button
                  onClick={() => updateSelected({ color: "#ffffff" })}
                  className="w-8 h-8 rounded-lg border border-white/20 hover:border-yellow-400/60 transition"
                  style={{ backgroundColor: "#ffffff" }}
                  title="White"
                />
                <button
                  onClick={() => updateSelected({ color: "#000000" })}
                  className="w-8 h-8 rounded-lg border border-white/20 hover:border-yellow-400/60 transition"
                  style={{ backgroundColor: "#000000" }}
                  title="Black"
                />
                <button
                  onClick={() => updateSelected({ color: "#ffff00" })}
                  className="w-8 h-8 rounded-lg border border-white/20 hover:border-yellow-400/60 transition"
                  style={{ backgroundColor: "#ffff00" }}
                  title="Yellow"
                />
                <button
                  onClick={() => updateSelected({ color: "#ff4444" })}
                  className="w-8 h-8 rounded-lg border border-white/20 hover:border-yellow-400/60 transition"
                  style={{ backgroundColor: "#ff4444" }}
                  title="Red"
                />
                <button
                  onClick={() => updateSelected({ color: "#00ffcc" })}
                  className="w-8 h-8 rounded-lg border border-white/20 hover:border-yellow-400/60 transition"
                  style={{ backgroundColor: "#00ffcc" }}
                  title="Neon"
                />
              </div>
            </div>
          </div>

          {/* ✅ Outline Color — RGB picker */}
          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-3">Outline Color</p>
            <div className="flex items-center gap-4">
              <label className="relative cursor-pointer group">
                <div
                  style={{ backgroundColor: selectedText.strokeColor }}
                  className="w-12 h-12 rounded-xl border-2 border-white/20 group-hover:border-yellow-400/60 transition shadow-lg"
                />
                <input
                  type="color"
                  value={selectedText.strokeColor}
                  onChange={(e) => updateSelected({ strokeColor: e.target.value })}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </label>
              <div className="flex flex-col gap-0.5">
                <span className="text-white font-bold text-sm">{selectedText.strokeColor.toUpperCase()}</span>
                <span className="text-white/30 text-xs">RGB({hexToRgb(selectedText.strokeColor)})</span>
              </div>
              <div className="flex gap-2 ml-auto">
                <button
                  onClick={() => updateSelected({ strokeColor: "#000000" })}
                  className="w-8 h-8 rounded-lg border border-white/20 hover:border-yellow-400/60 transition"
                  style={{ backgroundColor: "#000000" }}
                  title="Black"
                />
                <button
                  onClick={() => updateSelected({ strokeColor: "#ffffff" })}
                  className="w-8 h-8 rounded-lg border border-white/20 hover:border-yellow-400/60 transition"
                  style={{ backgroundColor: "#ffffff" }}
                  title="White"
                />
                <button
                  onClick={() => updateSelected({ strokeColor: "#ff4400" })}
                  className="w-8 h-8 rounded-lg border border-white/20 hover:border-yellow-400/60 transition"
                  style={{ backgroundColor: "#ff4400" }}
                  title="Orange"
                />
                <button
                  onClick={() => updateSelected({ strokeColor: "#0055ff" })}
                  className="w-8 h-8 rounded-lg border border-white/20 hover:border-yellow-400/60 transition"
                  style={{ backgroundColor: "#0055ff" }}
                  title="Blue"
                />
                <button
                  onClick={() => updateSelected({ strokeColor: "#ff00ff" })}
                  className="w-8 h-8 rounded-lg border border-white/20 hover:border-yellow-400/60 transition"
                  style={{ backgroundColor: "#ff00ff" }}
                  title="Purple"
                />
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
      <div className="flex gap-3 mt-1">
        <button onClick={addText}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black px-6 py-2.5 rounded-xl hover:opacity-90 transition shadow-lg shadow-orange-500/20">
          + Add Text
        </button>
        {selectedId !== null && (
          <button onClick={handleDelete}
            className="bg-red-500/10 border border-red-500/30 text-red-400 font-bold px-6 py-2.5 rounded-xl hover:bg-red-500/20 transition">
            🗑 Delete
          </button>
        )}
        <button onClick={downloadImage}
          className="bg-white/5 border border-white/10 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-white/10 transition">
          ⬇ Download
        </button>
      </div>

      {downloaded && <p className="text-green-400 font-semibold text-sm">✅ Downloaded!</p>}
    </div>
  )
}