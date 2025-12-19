import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { generateAIResponse, generateConversationTitle } from '@/lib/ai-engine';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Привет! Я Яппер — ваш ИИ-ассистент от fantomInsight и DeepSeek. Чем могу помочь?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Новый разговор',
      messages: [],
      timestamp: new Date(),
    },
  ]);
  const [savedMessages, setSavedMessages] = useState<Message[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarView, setSidebarView] = useState<'history' | 'saved' | 'profile' | 'about'>('history');

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: 'Это демо-версия Яппера. Я обрабатываю ваш запрос...',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage, aiResponse]);
    setInputValue('');
  };

  const handleNewChat = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: 'Новый разговор',
      messages: [],
      timestamp: new Date(),
    };
    setConversations([newConv, ...conversations]);
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Привет! Я Яппер — ваш ИИ-ассистент от fantomInsight и DeepSeek. Чем могу помочь?',
        timestamp: new Date(),
      },
    ]);
  };

  const handleSaveMessage = (msg: Message) => {
    if (!savedMessages.find(m => m.id === msg.id)) {
      setSavedMessages([...savedMessages, msg]);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, isTyping]);

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-sidebar">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-xl font-bold text-primary-foreground">Я</span>
          </div>
          <div>
            <h2 className="font-semibold text-sidebar-foreground">YAPPERTAR-ai</h2>
            <p className="text-xs text-muted-foreground">fantomInsight × DeepSeek</p>
          </div>
        </div>

        <Button onClick={handleNewChat} className="w-full" variant="default">
          <Icon name="Plus" className="mr-2" size={18} />
          Новый чат
        </Button>
      </div>

      <div className="flex border-b border-sidebar-border">
        <button
          onClick={() => setSidebarView('history')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            sidebarView === 'history'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          История
        </button>
        <button
          onClick={() => setSidebarView('saved')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            sidebarView === 'saved'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Сохранённое
        </button>
        <button
          onClick={() => setSidebarView('profile')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            sidebarView === 'profile'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Настройки
        </button>
      </div>

      <ScrollArea className="flex-1 p-4">
        {sidebarView === 'history' && (
          <div className="space-y-2">
            {conversations.map(conv => (
              <Card
                key={conv.id}
                className="p-3 hover:bg-accent cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{conv.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {conv.timestamp.toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                  <Icon name="MessageSquare" size={16} className="text-muted-foreground" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {sidebarView === 'saved' && (
          <div className="space-y-3">
            {savedMessages.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Нет сохранённых сообщений
              </p>
            ) : (
              savedMessages.map(msg => (
                <Card key={msg.id} className="p-3">
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {msg.timestamp.toLocaleString('ru-RU')}
                  </p>
                </Card>
              ))
            )}
          </div>
        )}

        {sidebarView === 'profile' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold mb-3">Внешний вид</h3>
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode">Тёмная тема</Label>
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={(checked) => {
                    setDarkMode(checked);
                    document.documentElement.classList.toggle('dark', checked);
                  }}
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3">Параметры ИИ</h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Модель</Label>
                  <p className="text-sm font-medium">DeepSeek-V2</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Температура</Label>
                  <p className="text-sm font-medium">0.7</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3">О приложении</h3>
              <button
                onClick={() => setSidebarView('about')}
                className="text-sm text-primary hover:underline"
              >
                О Яппере и fantomInsight →
              </button>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Icon name="Menu" size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <SidebarContent />
              </SheetContent>
            </Sheet>

            <div className="hidden md:flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">Я</span>
              </div>
              <div>
                <h1 className="text-sm font-semibold">YAPPERTAR-ai</h1>
                <p className="text-xs text-muted-foreground">Powered by DeepSeek</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleNewChat}>
              <Icon name="Plus" size={20} />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="hidden md:block w-80 border-r border-border">
          <SidebarContent />
        </aside>

        <main className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 p-4">
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        Я
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border border-border'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-border/50">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2"
                          onClick={() => handleSaveMessage(msg)}
                        >
                          <Icon name="Bookmark" size={14} className="mr-1" />
                          <span className="text-xs">Сохранить</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2">
                          <Icon name="Copy" size={14} className="mr-1" />
                          <span className="text-xs">Копировать</span>
                        </Button>
                      </div>
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-accent text-accent-foreground text-sm">
                        U
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="border-t border-border bg-card p-4">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <Input
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    placeholder="Напишите сообщение Япперу..."
                    className="pr-10 min-h-[48px] resize-none"
                  />
                </div>
                <Button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isTyping}
                  size="icon"
                  className="h-12 w-12 flex-shrink-0"
                >
                  <Icon name="Send" size={20} />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-3">
                {isTyping ? 'Яппер печатает...' : 'YAPPERTAR-ai может ошибаться. Проверяйте важную информацию.'}
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;