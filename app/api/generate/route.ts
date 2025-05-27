import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { prompt, aspectRatio, quality } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "请输入场景描述" }, { status: 400 })
    }

    // 构建完整的吉卜力风格提示词
    const ghibliPrompt = `Studio Ghibli style, ${prompt}, beautiful anime art style, soft lighting, detailed background, magical atmosphere, hand-drawn animation style, Hayao Miyazaki inspired`

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
        quality: quality || "standard",
      }),
    })

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`)
    }

    const data = await response.json()

    if (data.data && data.data[0] && data.data[0].url) {
      return NextResponse.json({
        success: true,
        imageUrl: data.data[0].url,
        prompt: ghibliPrompt,
      })
    } else {
      throw new Error("未收到有效的图片数据")
    }
  } catch (error) {
    console.error("图片生成错误:", error)
    return NextResponse.json(
      {
        error: "图片生成失败，请稍后重试",
      },
      { status: 500 },
    )
  }
}
