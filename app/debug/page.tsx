"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugPage() {
  const [diagnostics, setDiagnostics] = useState<any>(null)
  const [testResult, setTestResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const runDiagnostics = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/test-generate')
      const data = await response.json()
      setDiagnostics(data)
    } catch (error) {
      setDiagnostics({ success: false, error: 'Failed to fetch diagnostics' })
    }
    setLoading(false)
  }

  const testAPI = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/test-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testPrompt: 'a beautiful sunset over mountains' })
      })
      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      setTestResult({ success: false, error: 'Failed to test API' })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-slate-800 to-amber-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-amber-100 mb-8">🔧 Ghibli AI 诊断工具</h1>
        
        <div className="grid gap-6">
          {/* 诊断信息 */}
          <Card className="bg-slate-800/50 border-amber-600/20">
            <CardHeader>
              <CardTitle className="text-amber-100">环境诊断</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={runDiagnostics} 
                disabled={loading}
                className="mb-4 bg-amber-600 hover:bg-amber-700"
              >
                {loading ? '检查中...' : '运行诊断'}
              </Button>
              
              {diagnostics && (
                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <pre className="text-amber-200 text-sm overflow-auto">
                    {JSON.stringify(diagnostics, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>

          {/* API测试 */}
          <Card className="bg-slate-800/50 border-amber-600/20">
            <CardHeader>
              <CardTitle className="text-amber-100">API测试</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={testAPI} 
                disabled={loading}
                className="mb-4 bg-emerald-600 hover:bg-emerald-700"
              >
                {loading ? '测试中...' : '测试API连接'}
              </Button>
              
              {testResult && (
                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <pre className="text-amber-200 text-sm overflow-auto">
                    {JSON.stringify(testResult, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 配置说明 */}
          <Card className="bg-slate-800/50 border-amber-600/20">
            <CardHeader>
              <CardTitle className="text-amber-100">配置说明</CardTitle>
            </CardHeader>
            <CardContent className="text-amber-200">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-amber-100 mb-2">1. 配置API密钥</h3>
                  <p className="text-sm">在项目根目录创建 <code className="bg-slate-700 px-2 py-1 rounded">.env.local</code> 文件：</p>
                  <pre className="bg-slate-900 p-3 rounded mt-2 text-sm">
GHIBLI_API_KEY=sk-your-openai-api-key-here
                  </pre>
                </div>
                
                <div>
                  <h3 className="font-semibold text-amber-100 mb-2">2. 获取OpenAI API密钥</h3>
                  <p className="text-sm">
                    访问 <a href="https://platform.openai.com/api-keys" target="_blank" className="text-amber-400 underline">OpenAI API Keys</a> 页面创建新的API密钥
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-amber-100 mb-2">3. 重启服务器</h3>
                  <p className="text-sm">修改环境变量后需要重启开发服务器</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 