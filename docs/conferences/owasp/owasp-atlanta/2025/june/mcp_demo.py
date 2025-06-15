import asyncio
import rigging as rg

# URL of the MCP SSE endpoint
MCP_SSE_URL = "http://0.0.0.0:8000/sse"


async def main():
    async with rg.mcp("sse", url=MCP_SSE_URL) as mcp_client:
        print(f"Discovered {len(mcp_client.tools)} MCP tools via SSE.")

        if mcp_client.tools:
            chat = (
                await rg.get_generator("openai/o3-mini")
                .chat("Use the tools available to me to tell me the weather in Atlanta")
                .using(*mcp_client.tools)
                .run()
            )
            print(chat.conversation)
        else:
            print("No MCP tools found.")


if __name__ == "__main__":
    asyncio.run(main())
