import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const mockConversations = [
  { id: '1', name: 'Ava Brooks • Adidas Campaign', note: 'Pinned: deliverables due Friday' },
  { id: '2', name: 'Jordan Lee • Travel Logistics', note: 'System note: flights confirmed' },
  { id: '3', name: 'Team Ops • Q2 Partnerships', note: '3 unread updates' },
];

const mockMessages = [
  { id: 'a', from: 'Agent', text: 'Please confirm approval for revised caption before 4 PM ET.' },
  { id: 'b', from: 'System', text: 'Pinned update: #AD post obligation due April 22.' },
  { id: 'c', from: 'Athlete', text: 'Approved. Uploaded final media and draft in files.' },
];

export default function Conversations() {
  const [activeConversation, setActiveConversation] = useState(mockConversations[0]);
  const [draft, setDraft] = useState('');

  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto rounded-2xl border border-border bg-card overflow-hidden">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] min-h-[78vh]">
          <aside className="border-r border-border bg-surface p-4">
            <p className="text-sm font-medium">Conversations</p>
            <div className="mt-3 space-y-2">
              {mockConversations.map((conversation) => (
                <button key={conversation.id} onClick={() => setActiveConversation(conversation)} className={`w-full rounded-xl border p-3 text-left ${activeConversation.id === conversation.id ? 'border-[#01FB64] bg-background' : 'border-border bg-card'}`}>
                  <p className="text-sm font-medium">{conversation.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{conversation.note}</p>
                </button>
              ))}
            </div>
          </aside>

          <section className="p-4 md:p-6 flex flex-col">
            <div className="pb-4 border-b border-border">
              <h1 className="text-2xl">{activeConversation.name}</h1>
              <p className="text-sm text-muted-foreground mt-1">Shared thread with pinned notes, reminders, and context-aware updates.</p>
            </div>

            <div className="flex-1 py-4 space-y-3">
              {mockMessages.map((message) => (
                <div key={message.id} className={`rounded-xl border p-3 text-sm ${message.from === 'System' ? 'border-accent/50 bg-accent/10' : 'border-border bg-surface'}`}>
                  <p className="font-medium mb-1">{message.from}</p>
                  <p className="text-muted-foreground">{message.text}</p>
                </div>
              ))}
              <div className="rounded-xl border border-border bg-surface p-3 text-xs text-muted-foreground">Shared files: campaign-brief.pdf • shotlist-v2.docx • obligations.xlsx</div>
            </div>

            <form className="flex gap-2 pt-3 border-t border-border" onSubmit={(e) => e.preventDefault()}>
              <Input placeholder="Write an update or reminder…" value={draft} onChange={(e) => setDraft(e.target.value)} />
              <Button type="submit">Send</Button>
            </form>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
