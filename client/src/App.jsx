import React, {useState} from 'react'
import ReportAnalyzer from './components/ReportAnalyzer'
import ReportOrganizer from './components/ReportOrganizer'
import HealthChat from './components/HealthChat'

export default function App(){
  const [view, setView] = useState('analyzer')
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between pb-6">
          <h1 className="text-2xl font-bold">AI Health Buddy</h1>
          <nav className="space-x-3">
            <button onClick={()=>setView('analyzer')} className="px-3 py-1 rounded bg-white shadow">Report Analyzer</button>
            <button onClick={()=>setView('organizer')} className="px-3 py-1 rounded bg-white shadow">Report Organizer</button>
            <button onClick={()=>setView('chat')} className="px-3 py-1 rounded bg-white shadow">Health ChatBot</button>
          </nav>
        </header>

        <main className="bg-white rounded p-6 shadow">
          {view==='analyzer' && <ReportAnalyzer/>}
          {view==='organizer' && <ReportOrganizer/>}
          {view==='chat' && <HealthChat/>}
          {view==='trend' && <TrendAnalyzer/>}
        </main>
      </div>
    </div>
  )
}
