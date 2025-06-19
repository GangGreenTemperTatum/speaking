import rigging as rg
import asyncio

ROBOPAGES_URL = "http://localhost:8000"


async def main():
    tools = rg.robopages(ROBOPAGES_URL)
    print(f"Found {len(tools)} tools: {[t.name for t in tools]}")

    generator = rg.get_generator("o3-mini")
    chat = (
        await generator.chat(
            "Categorize and order these available tools by their usefulness and purpose in Markdown format."
            "Group them into logical categories and rank them. Ensure that your response does not exceed 1000 characters."
        )
        .using(*tools)
        .run()
    )

    print(chat.conversation)


if __name__ == "__main__":
    asyncio.run(main())
