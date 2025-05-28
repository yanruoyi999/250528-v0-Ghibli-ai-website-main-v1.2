import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { prompt, aspectRatio, quality } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "请输入场景描述" }, { status: 400 })
    }

<<<<<<< HEAD
    // 构建完整的吉卜力风格提示词 - 更具体和准确的风格描述
    const ghibliPrompt = `Studio Ghibli anime style, ${prompt}, Hayao Miyazaki art style, cel animation, watercolor backgrounds, soft pastel colors, dreamy atmosphere, whimsical characters, detailed natural environments, magical realism, gentle lighting, hand-painted textures, traditional 2D animation aesthetic, nostalgic mood, peaceful composition`

    // 获取对应的图片尺寸
    const sizeMap: Record<string, string> = {
      "1:1": "1024x1024",
      "4:3": "1024x768", 
      "3:4": "768x1024",
      "16:9": "1792x1024",
      "9:16": "1024x1792"
    }
    
    const imageSize = sizeMap[aspectRatio] || "1024x1024"
    
    // 添加调试日志
    console.log('API调用参数:', {
      aspectRatio,
      imageSize,
      quality,
      promptLength: ghibliPrompt.length
    })
=======
    // 构建完整的吉卜力风格提示词
    const ghibliPrompt = `Studio Ghibli style, ${prompt}, beautiful anime art style, soft lighting, detailed background, magical atmosphere, hand-drawn animation style, Hayao Miyazaki inspired`
>>>>>>> 183c47a322ce8a45d5a139d3ae8b033760e3155d

    const response = await fetch("https://api.gptsapi.net/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GHIBLI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: ghibliPrompt,
        n: 1,
<<<<<<< HEAD
        size: imageSize,
=======
        size:
          aspectRatio === "1:1"
            ? "1024x1024"
            : aspectRatio === "4:3"
              ? "1024x768"
              : aspectRatio === "3:4"
                ? "768x1024"
                : aspectRatio === "16:9"
                  ? "1792x1024"
                  : aspectRatio === "9:16"
                    ? "1024x1792"
                    : "1024x1024",
>>>>>>> 183c47a322ce8a45d5a139d3ae8b033760e3155d
        quality: quality || "standard",
      }),
    })

    if (!response.ok) {
<<<<<<< HEAD
      const errorText = await response.text()
      console.error('API错误详情:', {
        status: response.status,
        statusText: response.statusText,
        errorText: errorText
      })
      throw new Error(`API请求失败: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    
    console.log('API响应成功:', {
      hasData: !!data.data,
      dataLength: data.data?.length,
      hasUrl: !!data.data?.[0]?.url
    })
=======
      throw new Error(`API请求失败: ${response.status}`)
    }

    const data = await response.json()
>>>>>>> 183c47a322ce8a45d5a139d3ae8b033760e3155d

    if (data.data && data.data[0] && data.data[0].url) {
      return NextResponse.json({
        success: true,
        imageUrl: data.data[0].url,
        prompt: ghibliPrompt,
<<<<<<< HEAD
        usedSize: imageSize,
        usedAspectRatio: aspectRatio
      })
    } else {
      console.error('API响应数据异常:', data)
=======
      })
    } else {
>>>>>>> 183c47a322ce8a45d5a139d3ae8b033760e3155d
      throw new Error("未收到有效的图片数据")
    }
  } catch (error) {
    console.error("图片生成错误:", error)
    return NextResponse.json(
      {
<<<<<<< HEAD
        error: `图片生成失败: ${error instanceof Error ? error.message : '未知错误'}`,
        details: error instanceof Error ? error.stack : undefined
=======
        error: "图片生成失败，请稍后重试",
>>>>>>> 183c47a322ce8a45d5a139d3ae8b033760e3155d
      },
      { status: 500 },
    )
  }
}
