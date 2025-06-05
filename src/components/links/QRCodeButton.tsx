"use client"

import Icon from "@/components/global/Icon"
import QRCodeDialog from "@/components/global/QRCodeDialog"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export default function QRCodeButton() {
  const [url, setUrl] = useState<string>("")

  useEffect(() => {
    // Get the current URL using client-side window object
    setUrl(window.location.href)
  }, [])

  return (
    <QRCodeDialog url={url}>
      <Button variant="outline" size="icon">
        <Icon.qrCode />
      </Button>
    </QRCodeDialog>
  )
}
