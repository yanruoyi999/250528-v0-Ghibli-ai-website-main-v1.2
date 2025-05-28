import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { prompt, aspectRatio, quality } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "请输入场景描述" }, { status: 400 })
    }

    // 构建完整的吉卜力风格提示词
    const ghibliPrompt = `Studio Ghibli anime style, masterpiece, ${prompt}, in the style of Hayao Miyazaki, Joe Hisaishi inspired, traditional 2D cel animation, hand-drawn watercolor backgrounds, soft natural lighting, dreamy pastel color palette, intricate environmental details, magical realism atmosphere, whimsical character design, nostalgic and peaceful mood, flowing organic shapes, detailed nature scenes with lush vegetation, gentle wind effects, ethereal clouds, warm golden hour lighting, traditional Japanese art influences, fantasy elements seamlessly integrated into natural settings, emotional depth, cinematic composition`

    // 获取对应的图片尺寸
    const sizeMap: Record<string, string> = {
      "1:1": "1024x1024",
      "4:3": "1152x896", 
      "3:4": "896x1152",
      "16:9": "1792x1024",
      "9:16": "1024x1792"
    }
    
    const imageSize = sizeMap[aspectRatio] || "1024x1024"
    
    // 检查API密钥
    if (!process.env.GHIBLI_API_KEY) {
      return NextResponse.json(
        { error: "API密钥未配置，请在环境变量中设置GHIBLI_API_KEY" },
        { status: 500 }
      )
    }

    console.log('🚀 开始图片生成请求...')
    console.log('参数:', { aspectRatio, imageSize, quality, promptLength: ghibliPrompt.length })

    // 使用经过测试确认可用的API端点
    const API_ENDPOINT = "https://api.gptsapi.net/v1/images/generations"
    
    const requestBody = {
      model: "dall-e-3",
      prompt: ghibliPrompt,
      n: 1,
      size: imageSize,
      quality: quality || "standard",
    }

    console.log('📡 请求数据:', requestBody)

    // 发送请求到可用的API端点
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GHIBLI_API_KEY}`,
        "Content-Type": "application/json",
        "User-Agent": "Ghibli-AI/1.0"
      },
      body: JSON.stringify(requestBody),
    })

    console.log(`📥 API响应: ${response.status} ${response.statusText}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ API错误:', {
        status: response.status,
        statusText: response.statusText,
        errorText: errorText.substring(0, 500)
      })
      
      return NextResponse.json(
        { 
          error: `图片生成失败: ${response.status} - ${response.statusText}`,
          details: errorText.substring(0, 200)
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    console.log('✅ API响应成功:', {
      hasData: !!data.data,
      dataLength: data.data?.length,
      hasUrl: !!data.data?.[0]?.url
    })

    if (data.data && data.data[0] && data.data[0].url) {
      return NextResponse.json({
        success: true,
        imageUrl: data.data[0].url,
        prompt: ghibliPrompt,
        usedSize: imageSize,
        usedAspectRatio: aspectRatio,
        usedApiEndpoint: API_ENDPOINT
      })
    } else {
      console.error('❌ 响应数据格式异常:', data)
      return NextResponse.json(
        { error: "未收到有效的图片数据", details: JSON.stringify(data) },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error("🚨 图片生成错误:", error)
    return NextResponse.json(
      {
        error: `图片生成失败: ${error instanceof Error ? error.message : '未知错误'}`,
        details: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      },
      { status: 500 },
    )
  }
} 