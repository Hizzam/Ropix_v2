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
  "Arial",
  "Impact",
  "Georgia",
  "Comic Sans MS",
  "Courier New",
  "Trebuchet MS",
  "Verdana",
]

const COLOR_PRESETS = [
  "#ffffff", "#ffff00", "#ff4444", "#44ff44",
  "#44aaff", "#ff44ff", "#ff8800", "#000000",
]

const STYLE_PRESETS = [
  {
    label: "🔥 Epic",
    fontSize: 130,
    color: "#ffcc00",
    strokeColor: "#ff4400",
    strokeWidth: 12,
    fontFamily: "Impact",
    bold: true,
    italic: false,
  },
  {
    label: "❄️ Frost",
    fontSize: 120,
    color: "#aaddff",
    strokeColor: "#0055ff",
    strokeWidth: 10,
    fontFamily: "Arial",
    bold: true,
    italic: false,
  },
  {
    label: "💀 Dark",
    fontSize: 120,
    color: "#ffffff",
    strokeColor: "#000000",
    strokeWidth: 14,
    fontFamily: "Georgia",
    bold: true,
    italic: false,
  },
  {
    label: "🌈 Fun",
    fontSize: 120,
    color: "#ff44ff",
    strokeColor: "#ffff00",
    strokeWidth: 8,
    fontFamily: "Comic Sans MS",
    bold: true,
    italic: false,
  },
  {
    label: "⚡ Neon",
    fontSize: 130,
    color: "#00ffcc",
    strokeColor: "#0000ff",
    strokeWidth: 10,
    fontFamily: "Verdana",
    bold: true,
    italic: false,
  },
]

export default function ThumbnailEditor({ imageUrl }: { imageUrl: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const [texts, setTexts] = useState<TextItem[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingText, setEditingText] = useState("")
  const [downloaded, setDownloaded] = useState(false)
  const dragTarget = useRef<number | null>(null)
  const dragOffset = useRef({ x: 0, y: 0 })
  const isDragging = useRef(false)

  const selectedText = texts.find((t) => t.id === selectedId) ?? null

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      imgRef.current = img
      redraw(img, texts, selectedId)
    }
    img.src = imageUrl
  }, [imageUrl])

  useEffect(() => {
    if (imgRef.current) redraw(imgRef.current, texts, selectedId)
  }, [texts, selectedId])

  const getFont = (item: TextItem) =>
    `${item.italic ? "italic " : ""}${item.bold ? "bold " : ""}${item.fontSize}px "${item.fontFamily}"`

  const redraw = (img: HTMLImageElement, textItems: TextItem[], activeId: number | null) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    ctx.clearRect(0, 0, EXPORT_WIDTH, EXPORT_HEIGHT)
    ctx.drawImage(img, 0, 0, EXPORT_WIDTH, EXPORT_HEIGHT)

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
        const width = ctx.measureText(item.text).width
        const height = item.fontSize
        ctx.shadowColor = "transparent"
        ctx.strokeStyle = "#00aaff"
        ctx.lineWidth = 3
        ctx.setLineDash([10, 5])
        ctx.strokeRect(item.x - width / 2 - 12, item.y - height, width + 24, height + 16)
        ctx.setLineDash([])
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

  const getHitText = (pos: { x: number; y: number }) => {
    const ctx = canvasRef.current!.getContext("2d")!
    for (let i = texts.length - 1; i >= 0; i--) {
      const item = texts[i]
      ctx.font = getFont(item)
      const width = ctx.measureText(item.text).width
      const height = item.fontSize
      if (
        pos.x >= item.x - width / 2 - 12 &&
        pos.x <= item.x + width / 2 + 12 &&
        pos.y >= item.y - height &&
        pos.y <= item.y + 16
      ) return item
    }
    return null
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    const pos = getMousePos(e)
    const hit = getHitText(pos)
    if (hit) {
      dragTarget.current = hit.id
      dragOffset.current = { x: pos.x - hit.x, y: pos.y - hit.y }
      isDragging.current = false
      setSelectedId(hit.id)
    } else {
      setSelectedId(null)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragTarget.current === null) return
    isDragging.current = true
    const pos = getMousePos(e)
    setTexts((prev) =>
      prev.map((t) =>
        t.id === dragTarget.current
          ? { ...t, x: pos.x - dragOffset.current.x, y: pos.y - dragOffset.current.y }
          : t
      )
    )
  }

  const handleMouseUp = () => {
    if (!isDragging.current && dragTarget.current !== null) {
      const hit = texts.find((t) => t.id === dragTarget.current)
      if (hit) { setEditingId(hit.id); setEditingText(hit.text) }
    }
    dragTarget.current = null
    isDragging.current = false
  }

  const updateSelected = (updates: Partial<TextItem>) => {
    if (selectedId === null) return
    setTexts((prev) => prev.map((t) => t.id === selectedId ? { ...t, ...updates } : t))
  }

  const applyPreset = (preset: typeof STYLE_PRESETS[0]) => {
    if (selectedId === null) return
    setTexts((prev) =>
      prev.map((t) => t.id === selectedId ? { ...t, ...preset } : t)
    )
  }

  const addText = () => {
    const newText: TextItem = {
      id: Date.now(),
      text: "Your Text",
      x: EXPORT_WIDTH / 2,
      y: EXPORT_HEIGHT / 2,
      fontSize: 130,
      color: "#ffffff",
      fontFamily: "Impact",
      bold: true,
      italic: false,
      strokeColor: "#000000",
      strokeWidth: 12,
    }
    setTexts((prev) => [...prev, newText])
    setSelectedId(newText.id)
    setEditingId(newText.id)
    setEditingText("Your Text")
  }

  const handleDelete = () => {
    if (selectedId === null) return
    setTexts((prev) => prev.filter((t) => t.id !== selectedId))
    setSelectedId(null)
  }

  const handleEditSave = () => {
    setTexts((prev) => prev.map((t) => t.id === editingId ? { ...t, text: editingText } : t))
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

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-4xl mx-auto">

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={EXPORT_WIDTH}
        height={EXPORT_HEIGHT}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          width: `${DISPLAY_WIDTH}px`,
          height: `${DISPLAY_HEIGHT}px`,
          border: "2px solid #ccc",
          borderRadius: "8px",
          cursor: "move",
          display: "block",
        }}
      />

      {/* Edit text input */}
      {editingId !== null && (
        <div className="flex gap-2 items-center bg-gray-100 p-3 rounded-lg border w-full">
          <input
            autoFocus
            type="text"
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleEditSave()}
            className="border px-3 py-1 rounded text-black flex-1"
            placeholder="Enter text..."
          />
          <button onClick={handleEditSave} className="bg-blue-600 text-white px-3 py-1 rounded">Save</button>
          <button onClick={() => setEditingId(null)} className="bg-gray-400 text-white px-3 py-1 rounded">Cancel</button>
        </div>
      )}

      {/* Style controls — only show when text is selected */}
      {selectedText && (
        <div className="w-full bg-gray-50 border rounded-xl p-4 flex flex-col gap-4">

          {/* Style Presets */}
          <div>
            <p className="text-sm font-semibold mb-2">Style Presets</p>
            <div className="flex gap-2 flex-wrap">
              {STYLE_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => applyPreset(preset)}
                  className="px-3 py-1 rounded-full border text-sm font-semibold hover:bg-gray-200"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Font Family */}
          <div>
            <p className="text-sm font-semibold mb-2">Font</p>
            <div className="flex gap-2 flex-wrap">
              {FONTS.map((font) => (
                <button
                  key={font}
                  onClick={() => updateSelected({ fontFamily: font })}
                  style={{ fontFamily: font }}
                  className={`px-3 py-1 rounded border text-sm ${selectedText.fontFamily === font ? "bg-blue-600 text-white" : "hover:bg-gray-200"}`}
                >
                  {font}
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div>
            <p className="text-sm font-semibold mb-2">Size: {Math.round(selectedText.fontSize / 10)}px</p>
            <input
              type="range"
              min={50}
              max={300}
              value={selectedText.fontSize}
              onChange={(e) => updateSelected({ fontSize: Number(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Bold / Italic */}
          <div className="flex gap-3">
            <button
              onClick={() => updateSelected({ bold: !selectedText.bold })}
              className={`px-4 py-1 rounded border font-bold ${selectedText.bold ? "bg-blue-600 text-white" : "hover:bg-gray-200"}`}
            >
              B
            </button>
            <button
              onClick={() => updateSelected({ italic: !selectedText.italic })}
              className={`px-4 py-1 rounded border italic ${selectedText.italic ? "bg-blue-600 text-white" : "hover:bg-gray-200"}`}
            >
              I
            </button>
          </div>

          {/* Text Color */}
          <div>
            <p className="text-sm font-semibold mb-2">Text Color</p>
            <div className="flex gap-2 flex-wrap items-center">
              {COLOR_PRESETS.map((c) => (
                <button
                  key={c}
                  onClick={() => updateSelected({ color: c })}
                  style={{ backgroundColor: c, border: selectedText.color === c ? "3px solid #00aaff" : "2px solid #ccc" }}
                  className="w-8 h-8 rounded-full"
                />
              ))}
              <input
                type="color"
                value={selectedText.color}
                onChange={(e) => updateSelected({ color: e.target.value })}
                className="w-8 h-8 rounded cursor-pointer border"
                title="Custom color"
              />
            </div>
          </div>

          {/* Stroke Color */}
          <div>
            <p className="text-sm font-semibold mb-2">Outline Color</p>
            <div className="flex gap-2 flex-wrap items-center">
              {COLOR_PRESETS.map((c) => (
                <button
                  key={c}
                  onClick={() => updateSelected({ strokeColor: c })}
                  style={{ backgroundColor: c, border: selectedText.strokeColor === c ? "3px solid #00aaff" : "2px solid #ccc" }}
                  className="w-8 h-8 rounded-full"
                />
              ))}
              <input
                type="color"
                value={selectedText.strokeColor}
                onChange={(e) => updateSelected({ strokeColor: e.target.value })}
                className="w-8 h-8 rounded cursor-pointer border"
                title="Custom outline color"
              />
            </div>
          </div>

          {/* Stroke Width */}
          <div>
            <p className="text-sm font-semibold mb-2">Outline Thickness: {selectedText.strokeWidth}</p>
            <input
              type="range"
              min={0}
              max={30}
              value={selectedText.strokeWidth}
              onChange={(e) => updateSelected({ strokeWidth: Number(e.target.value) })}
              className="w-full"
            />
          </div>

        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-4 mt-2">
        <button onClick={addText} className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
          + Add Text
        </button>
        {selectedId !== null && (
          <button onClick={handleDelete} className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700">
            🗑 Delete Text
          </button>
        )}
        <button onClick={downloadImage} className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700">
          ⬇ Download
        </button>
      </div>

      {downloaded && <p className="text-green-500 font-semibold">✅ Downloaded!</p>}
    </div>
  )
}