import React, {useState} from 'react'
import axios from 'axios'

export default function ReportAnalyzer(){
  const [file, setFile] = useState(null)
  const [summary, setSummary] = useState('')

  const submit = async e => {
    e.preventDefault()
    if(!file) return alert('Choose an image/pdf')
    const fd = new FormData()
    fd.append('report', file)
    const res = await axios.post('http://localhost:3001/api/analyze', fd, { headers: {'Content-Type': 'multipart/form-data'} })
    setSummary(res.data.summary || 'No summary returned')
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Report Analyzer</h2>
      <form onSubmit={submit} className="space-y-3">
        <input type="file" accept="image/*,application/pdf" onChange={e=>setFile(e.target.files[0])} />
        <div><button className="px-4 py-2 bg-blue-600 text-white rounded">Analyze</button></div>
      </form>
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold">Summary</h3>
        <pre className="whitespace-pre-wrap">{summary}</pre>
      </div>
    </div>
  )
}
