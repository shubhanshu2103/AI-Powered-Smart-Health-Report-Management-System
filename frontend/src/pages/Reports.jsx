import { useEffect, useState, useRef } from 'react';
import api from '../api/axios';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState(null);
  const fileRef = useRef();

  const fetchReports = () =>
    api.get('/reports').then(r => setReports(r.data.data || [])).catch(() => {});

  useEffect(() => { fetchReports(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    const file = fileRef.current?.files[0];
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    setUploading(true);
    try {
      await api.post('/reports', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      fileRef.current.value = '';
      setTimeout(fetchReports, 2000);
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Medical Reports</h1>

      <form onSubmit={handleUpload} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Report</label>
          <input ref={fileRef} type="file" accept=".pdf,.txt,.png,.jpg,.jpeg"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        </div>
        <button type="submit" disabled={uploading}
          className="bg-blue-700 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-800 disabled:opacity-50 transition">
          {uploading ? 'Uploading…' : 'Upload'}
        </button>
      </form>

      <div className="space-y-4">
        {reports.map(r => (
          <div key={r.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-800 truncate">{r.file_url?.split('/').pop() || 'Report'}</span>
              <StatusBadge status={r.status} />
            </div>
            <p className="text-xs text-gray-400 mb-3">{new Date(r.created_at).toLocaleString()}</p>
            {r.ai_summary && (
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs font-semibold text-blue-700 mb-1">AI Summary</p>
                <p className="text-sm text-gray-700">{r.ai_summary}</p>
              </div>
            )}
            {r.status === 'PROCESSING' && (
              <p className="text-xs text-yellow-600 mt-2">Processing… refresh in a moment.</p>
            )}
          </div>
        ))}
        {reports.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">No reports yet.</p>
            <p className="text-sm">Upload your first medical report above.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = { PROCESSING: 'bg-yellow-100 text-yellow-700', COMPLETED: 'bg-green-100 text-green-700', FAILED: 'bg-red-100 text-red-700' };
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[status] || ''}`}>{status}</span>;
}
