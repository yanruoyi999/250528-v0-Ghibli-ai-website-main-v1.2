import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { prompt, aspectRatio, quality } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "请输入场景描述" }, { status: 400 })
    }

    // 构建完整的吉卜力风格提示词 - 更专业和准确的风格描述
    const ghibliPrompt = `Studio Ghibli anime style, masterpiece, ${prompt}, in the style of Hayao Miyazaki, Joe Hisaishi inspired, traditional 2D cel animation, hand-drawn watercolor backgrounds, soft natural lighting, dreamy pastel color palette, intricate environmental details, magical realism atmosphere, whimsical character design, nostalgic and peaceful mood, flowing organic shapes, detailed nature scenes with lush vegetation, gentle wind effects, ethereal clouds, warm golden hour lighting, traditional Japanese art influences, fantasy elements seamlessly integrated into natural settings, emotional depth, cinematic composition`

    // 获取对应的图片尺寸 - 确保3:4比例正确
    const sizeMap: Record<string, string> = {
      "1:1": "1024x1024",
      "4:3": "1152x896", 
      "3:4": "896x1152",
      "16:9": "1792x1024",
      "9:16": "1024x1792"
    }
    
    const imageSize = sizeMap[aspectRatio] || "1024x1024"
    
    // 添加调试日志
    console.log('API调用参数:', {
      aspectRatio,
      imageSize,
      quality,
      promptLength: ghibliPrompt.length,
      apiKey: process.env.GHIBLI_API_KEY ? `已配置 (长度: ${process.env.GHIBLI_API_KEY.length})` : '未配置'
    })

    // 检查API密钥
    if (!process.env.GHIBLI_API_KEY) {
      throw new Error("API密钥未配置，请在环境变量中设置GHIBLI_API_KEY")
    }

    // 尝试多个API端点
    const apiEndpoints = [
      "https://api.openai.com/v1/images/generations", // 官方OpenAI API
      "https://api.gptsapi.net/v1/images/generations"  // 第三方API
    ]

    let lastError: Error | null = null

    for (const apiUrl of apiEndpoints) {
      try {
        console.log(`尝试API端点: ${apiUrl}`)
        
        const requestBody = {
          model: "dall-e-3",
          prompt: ghibliPrompt,
          n: 1,
          size: imageSize,
          quality: quality || "standard",
        }

        console.log('请求体:', JSON.stringify(requestBody, null, 2))

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.GHIBLI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        })

        console.log(`API响应状态: ${response.status} ${response.statusText}`)

        if (!response.ok) {
          const errorText = await response.text()
          console.error(`API错误详情 (${apiUrl}):`, {
            status: response.status,
            statusText: response.statusText,
            errorText: errorText
          })
          throw new Error(`API请求失败: ${response.status} - ${errorText}`)
        }

        const data = await response.json()
        
        console.log('API响应数据:', {
          hasData: !!data.data,
          dataLength: data.data?.length,
          hasUrl: !!data.data?.[0]?.url,
          fullResponse: JSON.stringify(data, null, 2)
        })

        if (data.data && data.data[0] && data.data[0].url) {
          return NextResponse.json({
            success: true,
            imageUrl: data.data[0].url,
            prompt: ghibliPrompt,
            usedSize: imageSize,
            usedAspectRatio: aspectRatio,
            usedApiEndpoint: apiUrl
          })
        } else {
          throw new Error(`未收到有效的图片数据，响应: ${JSON.stringify(data)}`)
        }
      } catch (error) {
        console.error(`API端点 ${apiUrl} 失败:`, error)
        lastError = error as Error
        continue // 尝试下一个端点
      }
    }

    // 如果所有端点都失败
    throw new Error(`所有API端点都失败，最后错误: ${lastError?.message}`)

  } catch (error) {
    console.error("图片生成错误:", error)
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