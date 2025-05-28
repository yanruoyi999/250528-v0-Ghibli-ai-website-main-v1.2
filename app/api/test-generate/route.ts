import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    // 检查环境变量
    const apiKey = process.env.GHIBLI_API_KEY
    
    const diagnostics = {
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      environment: process.env.NODE_ENV,
      apiKeyStatus: apiKey ? {
        exists: true,
        length: apiKey.length,
        startsWithSk: apiKey.startsWith('sk-'),
        preview: apiKey.substring(0, 7) + '...' + apiKey.substring(apiKey.length - 4)
      } : {
        exists: false,
        message: "API密钥未配置"
      },
      availableEnvVars: Object.keys(process.env).filter(key => 
        key.includes('API') || key.includes('GHIBLI')
      )
    }

    return NextResponse.json({
      success: true,
      diagnostics
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { testPrompt = "a simple test image" } = await request.json()
    
    const apiKey = process.env.GHIBLI_API_KEY
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: "API密钥未配置，请在.env.local文件中设置GHIBLI_API_KEY"
      }, { status: 400 })
    }

    // 测试API连接
    const testRequest = {
      model: "dall-e-3",
      prompt: testPrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard"
    }

    console.log('测试API请求:', testRequest)

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(testRequest)
    })

    const responseText = await response.text()
    
    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: `API测试失败: ${response.status}`,
        details: responseText,
        apiKeyPreview: apiKey.substring(0, 7) + '...' + apiKey.substring(apiKey.length - 4)
      }, { status: response.status })
    }

    const data = JSON.parse(responseText)
    
    return NextResponse.json({
      success: true,
      message: "API测试成功！",
      hasImageUrl: !!data.data?.[0]?.url,
      responsePreview: {
        dataLength: data.data?.length,
        hasUrl: !!data.data?.[0]?.url
      }
    })

  } catch (error) {
    console.error('API测试错误:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
} 