"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AdminSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cài đặt chung</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site-name">Tên trang web</Label>
              <Input id="site-name" defaultValue="SlideShare Clone" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="site-description">Mô tả trang web</Label>
              <Textarea id="site-description" defaultValue="Nền tảng chia sẻ bài thuyết trình" />
            </div>
            <Button type="submit">Lưu cài đặt</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Cài đặt email</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="smtp-host">SMTP Host</Label>
              <Input id="smtp-host" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-port">SMTP Port</Label>
              <Input id="smtp-port" type="number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-user">SMTP User</Label>
              <Input id="smtp-user" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-password">SMTP Password</Label>
              <Input id="smtp-password" type="password" />
            </div>
            <Button type="submit">Lưu cài đặt email</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

