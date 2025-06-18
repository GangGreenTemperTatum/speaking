import asyncio
import logfire
import os
import rigging as rg
from loguru import logger

logfire.configure()

os.environ.setdefault("LOGFIRE_TOKEN", "")

logger.enable("rigging")

rg.logging.configure_logging(
    log_level="debug",
    log_file=None,
    log_file_level="debug",
)

# code ~/Library/Application\ Support/Claude/claude_desktop_config.json
# go to ~/git/mcp/weather
# uv run weather-server --sse
# python docs/conferences/owasp/owasp-atlanta/2025/june/mcp_demo.py

MCP_SSE_URL = "http://0.0.0.0:8000/sse"


async def main():
    logger.info("Starting MCP client connection...")

    async with rg.mcp("sse", url=MCP_SSE_URL) as mcp_client:
        logger.info(f"Discovered {len(mcp_client.tools)} MCP tools via SSE.")
        print(f"Discovered {len(mcp_client.tools)} MCP tools via SSE.")

        if mcp_client.tools:
            logger.info("Starting chat with available tools...")
            logger.info(f"Available tools: {[tool.name for tool in mcp_client.tools]}")

            generator = (
                rg.get_generator("openai/o3-mini")
                .chat("Use the tools available to me to tell me the weather in Atlanta")
                .using(*mcp_client.tools)
                .with_(
                    max_tokens=2000,
                    temperature=0.1,
                    # Add timeout settings if supported
                )
            )

            try:
                logger.info("Starting chat generation...")
                chat = await asyncio.wait_for(generator.run(), timeout=60)

                logger.info(f"Chat completed with {len(chat.messages)} messages")
                for i, message in enumerate(chat.messages):
                    logger.info(f"Message {i + 1} ({message.role}): {message.content}")
                    if hasattr(message, "tool_calls") and message.tool_calls:
                        logger.info(
                            f"Tool calls: {[call.function.name for call in message.tool_calls]}"
                        )

                final_message = chat.last
                logger.info(f"Final response: {final_message.content}")

                print(chat.conversation)

            except asyncio.TimeoutError:
                logger.error("Chat generation timed out after 3 minutes")
                print("Chat generation timed out")
            except Exception as e:
                logger.error(f"Error during chat generation: {e}")
                print(f"Error: {e}")

        else:
            logger.warning("No MCP tools found.")
            print("No MCP tools found.")


if __name__ == "__main__":
    asyncio.run(main())
