"use client"

import { useEffect, useRef, useState } from "react"
import * as fabric from "fabric"

export default function ThumbnailEditor({ imageUrl }: { imageUrl: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<fabric.Canvas | null>(null)
  const [downloaded, setDownloaded] = useState(false)

  // ✅ INIT ONCE
  useEffect(() => {
    if (!canvasRef.current) return

    if (!fabricRef.current) {
      fabricRef.current = new fabric.Canvas(canvasRef.current)
    }

    return () => {
      fabricRef.current?.dispose()
      fabricRef.current = null
    }
  }, [])

  // ✅ LOAD IMAGE (FULL SIZE — NO SCALING)
  useEffect(() => {
    const canvas = fabricRef.current
    if (!canvas || !imageUrl) return

    canvas.clear()

    fabric.Image.fromURL(imageUrl, {
      crossOrigin: "anonymous",
    }).then((img) => {
      const width = img.width || 1024
      const height = img.height || 1024

      // ✅ SET REAL SIZE (same as history image)
      if (canvasRef.current) {
        canvasRef.current.width = width
        canvasRef.current.height = height
      }

      img.set({
        left: 0,
        top: 0,
        selectable: false,
      })

      canvas.add(img)
      canvas.renderAll()
    })
  }, [imageUrl])

  const addText = () => {
    const canvas = fabricRef.current
    if (!canvas) return

    const text = new fabric.Textbox("Your Text", {
      left: canvas.getWidth() / 2,
      top: canvas.getHeight() - 100,
      originX: "center",
      fontSize: 80,
      fill: "#ffffff",
      fontWeight: "bold",
      stroke: "#000000",
      strokeWidth: 5,
      shadow: new fabric.Shadow({
        color: "rgba(0,0,0,0.6)",
        blur: 10,
        offsetX: 3,
        offsetY: 3,
      }),
    })

    canvas.add(text)
    canvas.setActiveObject(text)
  }

  const downloadImage = () => {
    const canvas = fabricRef.current
    if (!canvas) return

    const dataURL = canvas.toDataURL({
  format: "png",
  quality: 1,
  multiplier: 2, // ✅ required
})

    const link = document.createElement("a")
    link.href = dataURL
    link.download = "thumbnail.png"
    link.click()

    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 2000)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      
      {/* 🔥 THIS IS THE KEY FIX */}
      <canvas
        ref={canvasRef}
        style={{
          maxWidth: "600px",  // 👈 display smaller
          width: "100%",
          height: "auto",
        }}
      />

      <div className="flex gap-4">
        <button
          onClick={addText}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          Add Text
        </button>

        <button
          onClick={downloadImage}
          className="bg-green-600 text-white px-5 py-2 rounded-lg"
        >
          Download
        </button>
      </div>

      {downloaded && <p className="text-green-600">✅ Downloaded</p>}
    </div>
  )
}