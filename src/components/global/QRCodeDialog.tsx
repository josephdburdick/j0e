"use client"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { cn } from "@/lib/utils"
import { PropsWithChildren } from "react"
import QRCode from "react-qr-code"

type Props = PropsWithChildren & {
  url: string
  title?: string
  description?: string
}

export default function QRCodeDialog({
  children,
  url,
  title = "Scan QR Code",
  description = "Scan to open on another device",
}: Props) {
  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="h-[96vh]">
        <div className="mx-auto flex h-full w-full max-w-md flex-col">
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-1 items-center justify-center px-4">
            <div className="w-full max-w-sm rounded-lg bg-white p-4 shadow-sm">
              <QRCode
                value={url}
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                viewBox="0 0 256 256"
              />
            </div>
          </div>

          <div className="p-4">
            <DrawerClose asChild>
              <Button className="w-full" variant="outline">
                Close
              </Button>
            </DrawerClose>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
