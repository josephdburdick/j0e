"use client"

import Icon from "@/components/global/Icon"
import QRCodeDialog from "@/components/global/QRCodeDialog"
import { useEffect, useState } from "react"

export default function QRCodeButton() {
  const [url, setUrl] = useState<string>("")

  useEffect(() => {
    setUrl(window.location.href)
  }, [])

  return (
    <QRCodeDialog url={url}>
      <button
        type="button"
        className="label flex items-center gap-2.5 border border-line px-4 py-3 transition-colors hover:border-brand hover:text-brand"
      >
        <Icon.qrCode className="size-4" />
        QR for this page
      </button>
    </QRCodeDialog>
  )
}
