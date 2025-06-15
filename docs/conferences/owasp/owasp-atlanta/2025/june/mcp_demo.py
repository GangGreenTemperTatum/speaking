import asyncio
import rigging as rg
from loguru import logger

logger.enable("rigging")

rg.logging.configure_logging(
    log_level="debug",
    log_file=None,
    log_file_level="debug",
)

MCP_SSE_URL = "http://0.0.0.0:8000/sse"


async def main():
    logger.info("Starting MCP client connection...")

    async with rg.mcp("sse", url=MCP_SSE_URL) as mcp_client:
        logger.info(f"Discovered {len(mcp_client.tools)} MCP tools via SSE.")
        print(f"Discovered {len(mcp_client.tools)} MCP tools via SSE.")

        if mcp_client.tools:
            logger.info("Starting chat with available tools...")
            chat = (
                await rg.get_generator("openai/o3-mini")
                .chat("Use the tools available to me to tell me the weather in Atlanta")
                .using(*mcp_client.tools)
                .run()
            )
            print(chat.conversation)
        else:
            logger.warning("No MCP tools found.")
            print("No MCP tools found.")


if __name__ == "__main__":
    asyncio.run(main())
