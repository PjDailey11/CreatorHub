'use client'

import { useState } from 'react'
import { useSubscribers } from '@/hooks/use-subscribers'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { SubscriberTable } from '@/components/dashboard/subscriber-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { Subscriber } from '@/types'

export default function SubscribersPage() {
  const { subscribers, stats, loading, addSubscriber, updateSubscriber, deleteSubscriber } = useSubscribers()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingSubscriber, setEditingSubscriber] = useState<Subscriber | null>(null)
  const [formData, setFormData] = useState({
    subscriber_name: '',
    subscriber_tier: 'standard',
    subscription_price: '',
    status: 'active',
  })

  const resetForm = () => {
    setFormData({
      subscriber_name: '',
      subscriber_tier: 'standard',
      subscription_price: '',
      status: 'active',
    })
  }

  const handleAdd = async () => {
    await addSubscriber({
      subscriber_name: formData.subscriber_name,
      subscriber_tier: formData.subscriber_tier,
      subscription_price: parseFloat(formData.subscription_price) || null,
      status: formData.status,
      last_engaged_at: null,
      total_spent: 0,
    })
    setIsAddOpen(false)
    resetForm()
  }

  const handleEdit = (subscriber: Subscriber) => {
    setEditingSubscriber(subscriber)
    setFormData({
      subscriber_name: subscriber.subscriber_name || '',
      subscriber_tier: subscriber.subscriber_tier || 'basic',
      subscription_price: subscriber.subscription_price?.toString() || '',
      status: subscriber.status || 'active',
    })
    setIsEditOpen(true)
  }

  const handleUpdate = async () => {
    if (!editingSubscriber) return
    await updateSubscriber(editingSubscriber.id, {
      subscriber_name: formData.subscriber_name,
      subscriber_tier: formData.subscriber_tier,
      subscription_price: parseFloat(formData.subscription_price) || null,
      status: formData.status,
    })
    setIsEditOpen(false)
    setEditingSubscriber(null)
    resetForm()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this subscriber?')) {
      await deleteSubscriber(id)
    }
  }

  const renderFormFields = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Subscriber Name</Label>
        <Input
          id="name"
          value={formData.subscriber_name}
          onChange={(e) => setFormData({ ...formData, subscriber_name: e.target.value })}
          placeholder="Enter subscriber name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tier">Tier</Label>
        <Select
          value={formData.subscriber_tier}
          onValueChange={(value) => setFormData({ ...formData, subscriber_tier: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
            <SelectItem value="vip">VIP</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="price">Subscription Price ($)</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          value={formData.subscription_price}
          onChange={(e) => setFormData({ ...formData, subscription_price: e.target.value })}
          placeholder="9.99"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => setFormData({ ...formData, status: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="churned">Churned</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Subscribers</h1>
          <p className="text-muted-foreground">Manage and track your subscriber base</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Subscriber
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Subscriber</DialogTitle>
              <DialogDescription>
                Add a new subscriber to track their engagement and revenue.
              </DialogDescription>
            </DialogHeader>
            {renderFormFields()}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={handleAdd} className="bg-gradient-to-r from-pink-500 to-purple-600">
                Add Subscriber
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <StatsCards stats={stats} loading={loading} />

      <SubscriberTable
        subscribers={subscribers}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subscriber</DialogTitle>
            <DialogDescription>
              Update subscriber information.
            </DialogDescription>
          </DialogHeader>
          {renderFormFields()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate} className="bg-gradient-to-r from-pink-500 to-purple-600">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
