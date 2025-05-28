import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "请输入提示词" }, { status: 400 })
    }

    // 简化的提示词
    const simplePrompt = `${prompt}, anime style, studio ghibli`

    console.log('测试API调用参数:', {
      prompt: simplePrompt,
      apiKey: process.env.GHIBLI_API_KEY ? `已配置 (前4位: ${process.env.GHIBLI_API_KEY.substring(0, 4)}...)` : '未配置'
    })

    // 检查API密钥
    if (!process.env.GHIBLI_API_KEY) {
      return NextResponse.json({ 
        error: "API密钥未配置", 
        details: "请在Vercel环境变量中设置GHIBLI_API_KEY" 
      }, { status: 500 })
    }

    // 最简单的请求配置
    const requestBody = {
      model: "dall-e-3",
      prompt: simplePrompt,
      n: 1,
      size: "1024x1024"
    }

    console.log('发送请求体:', JSON.stringify(requestBody, null, 2))

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GHIBLI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    console.log('API响应状态:', response.status, response.statusText)

    const responseText = await response.text()
    console.log('API响应原始文本:', responseText)

    if (!response.ok) {
      return NextResponse.json({
        error: "API调用失败",
        status: response.status,
        statusText: response.statusText,
        details: responseText
      }, { status: 500 })
    }

    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      return NextResponse.json({
        error: "解析API响应失败",
        details: responseText
      }, { status: 500 })
    }

    console.log('解析后的响应数据:', JSON.stringify(data, null, 2))

    if (data.data && data.data[0] && data.data[0].url) {
      return NextResponse.json({
        success: true,
        imageUrl: data.data[0].url,
        prompt: simplePrompt,
        testMode: true
      })
    } else {
      return NextResponse.json({
        error: "未收到有效的图片数据",
        responseData: data
      }, { status: 500 })
    }

  } catch (error) {
    console.error("测试生成错误:", error)
    return NextResponse.json({
      error: "测试失败",
      message: error instanceof Error ? error.message : '未知错误',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
} 