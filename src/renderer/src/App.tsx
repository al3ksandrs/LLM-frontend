import { useState, useEffect, useRef } from 'react';
import './css/App.css';

interface Conversation {
  id: number;
  title: string;
}

interface Message {
  sender: 'user' | 'llm';
  text: string;
}

const dummyHistory: Conversation[] = [
  { id: 1, title: 'Python list comprehension help' },
  { id: 2, title: 'React component ideas' },
  { id: 3, title: 'What is distillation in AI?' },
];

function App() {
  const [modelPath, setModelPath] = useState<string>('C:\\Users\\YourUser\\Documents\\LLM_Models');
  const [selectedModel, setSelectedModel] = useState<string>('Llama-3.1-8B');
  const [prompt, setPrompt] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Message[]>([
    { sender: 'llm', text: 'Hello! How can I help you today?' }
  ]);
  
  const chatWindowRef = useRef<HTMLDivElement>(null);

  const availableModels: string[] = ['Llama-3.1-8B', 'Phi-3-mini', 'Gemma-2B', 'CodeGemma-2B'];

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userMessage: Message = { sender: 'user', text: prompt };
    setChatHistory(prevChat => [...prevChat, userMessage]);
    setPrompt('');

    setTimeout(() => {
      const llmResponse: Message = { 
        sender: 'llm', 
        text: `This is a simulated response for your prompt about "${prompt}". In a real application, the selected model (${selectedModel}) would process this.` 
      };
      setChatHistory(prevChat => [...prevChat, llmResponse]);
    }, 1000);
  };
  
  // Add a handler for the browse button
  const handleBrowse = async () => {
    const path = await window.electronAPI.openDirectory();
    if (path) {
      setModelPath(path);
    }
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2>History</h2>
        <ul>
          {dummyHistory.map(convo => (
            <li key={convo.id}>{convo.title}</li>
          ))}
        </ul>
        <div className="new-chat-button">
          + New Chat
        </div>
      </aside>

      <main className="main-content">
        <header className="model-selector">
          <div className="selector-group">
            <label htmlFor="model-select">Select Model</label>
            <select 
              id="model-select" 
              value={selectedModel} 
              onChange={e => setSelectedModel(e.target.value)}
            >
              {availableModels.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>
          <div className="selector-group path-group">
            <label htmlFor="model-path">Model Folder Location</label>
            <input 
              type="text" 
              id="model-path"
              value={modelPath}
              onChange={e => setModelPath(e.target.value)}
            />
            {/* Add the onClick handler to the button */}
            <button className="browse-button" onClick={handleBrowse}>Browse</button>
          </div>
        </header>

        <div className="chat-window" ref={chatWindowRef}>
          {chatHistory.map((message, index) => (
            <div key={index} className={`chat-message ${message.sender}`}>
              <div className="message-bubble">
                <p>{message.text}</p>
              </div>
            </div>
          ))}
        </div>

        <footer className="prompt-footer">
          <form onSubmit={handleSubmit} className="prompt-form">
            <textarea
              placeholder="Enter your prompt here..."
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  // The form's onSubmit will handle the logic
                  (e.target as HTMLTextAreaElement).form?.requestSubmit();
                }
              }}
            />
            <button type="submit">Send</button>
          </form>
        </footer>
      </main>
    </div>
  );
}

export default App;