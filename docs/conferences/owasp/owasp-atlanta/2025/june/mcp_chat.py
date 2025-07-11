import asyncio
import logfire
import os
import rigging as rg
from loguru import logger
import click

logfire.configure()
os.environ.setdefault("LOGFIRE_TOKEN", "")
logger.enable("rigging")

MCP_SSE_URL = "http://0.0.0.0:9001/sse"


async def interactive_chat_session(
    mcp_client, generator_id: str = "groq/llama-3.3-70b-versatile"
):
    """Run an interactive chat session with MCP tools"""
    logger.info("Starting interactive chat session...")

    # Initialize the base pipeline with system context about available tools
    tools_info = "\n".join(
        [f"- {tool.name}: {tool.description}" for tool in mcp_client.tools]
    )

    # Show available resources if any
    resources_info = ""
    if hasattr(mcp_client, "resources") and mcp_client.resources:
        resources_info = "\n\nAvailable resources:\n" + "\n".join(
            [f"- {resource}" for resource in mcp_client.resources]
        )

    system_prompt = f"""You are a helpful assistant with access to the following tools:

{tools_info}{resources_info}

You can use these tools to help answer questions and perform tasks. Always explain what you're doing when you use a tool. When a user asks for information, try to use the available tools to help them."""

    # Create the initial pipeline
    pipeline = (
        rg.get_generator(generator_id)
        .chat([{"role": "system", "content": system_prompt}])
        .using(*mcp_client.tools)
        .with_(
            max_tokens=2000,
            temperature=0.1,
        )
    )

    print("Interactive MCP Chat Started!")
    print(f"Connected to MCP server with {len(mcp_client.tools)} tools")
    print(f"Available tools: {', '.join([tool.name for tool in mcp_client.tools])}")

    if hasattr(mcp_client, "resources"):
        print(f"Available resources: {mcp_client.resources}")

    print(
        "Type your messages below. Type 'quit', 'exit', or 'bye' to end the session.\n"
    )

    while True:
        try:
            user_input = input("You: ").strip()

            if user_input.lower() in ["quit", "exit", "bye", "q"]:
                print("Goodbye!")
                break

            if not user_input:
                continue

            pipeline = pipeline.add(user_input)

            print("Thinking...")

            try:
                chat = await asyncio.wait_for(pipeline.run(), timeout=60)

                assistant_response = chat.last.content
                print(f"Assistant: {assistant_response}")

                if hasattr(chat.last, "tool_calls") and chat.last.tool_calls:
                    used_tools = [call.function.name for call in chat.last.tool_calls]
                    logger.info(f"Tools used: {used_tools}")

                pipeline = chat.restart(include_all=True)

            except asyncio.TimeoutError:
                print("Response timed out. Please try again.")
                logger.error("Chat generation timed out")
                continue

            except Exception as e:
                print(f" Error: {e}")
                logger.error(f"Error during chat generation: {e}")
                continue

        except KeyboardInterrupt:
            print("\nChat interrupted. Goodbye!")
            break
        except EOFError:
            print("\nGoodbye!")
            break


async def single_prompt_mode(
    mcp_client, prompt: str, generator_id: str = "groq/llama-3.3-70b-versatile"
):
    """Run a single prompt (original functionality)"""
    logger.info("Running single prompt mode...")

    generator = (
        rg.get_generator(generator_id)
        .chat(prompt)
        .using(*mcp_client.tools)
        .with_(
            max_tokens=2000,
            temperature=0.1,
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
        print(f"Response: {final_message.content}")

    except asyncio.TimeoutError:
        logger.error("Chat generation timed out after 60 seconds")
        print("Chat generation timed out")
    except Exception as e:
        logger.error(f"Error during chat generation: {e}")
        print(f"Error: {e}")


async def main():
    logger.info("Starting MCP client connection...")

    async with rg.mcp("sse", url=MCP_SSE_URL) as mcp_client:
        logger.info(f"Discovered {len(mcp_client.tools)} MCP tools via SSE.")
        print(f"Connected to MCP server")
        print(f"Discovered {len(mcp_client.tools)} MCP tools via SSE.")

        if mcp_client.tools:
            await interactive_chat_session(mcp_client)
        else:
            logger.warning("No MCP tools found.")
            print("No MCP tools found.")


@click.command()
@click.option(
    "--mode",
    type=click.Choice(["interactive", "single"]),
    default="interactive",
    help="Chat mode: interactive for multi-turn, single for one-shot",
)
@click.option(
    "--prompt", type=str, help="Prompt for single mode (required when mode=single)"
)
@click.option(
    "--generator",
    type=str,
    default="gemini/gemini-1.5-pro",  # USE GEMINI and https://www.anthropic.com/research/agentic-misalignment?utm_source=alphasignal THREATENING AGENTIC MISALIGNMENT
    help="Generator ID to use",
)
def cli(mode: str, prompt: str, generator: str):
    """
    Interactive MCP Chat Client

    Run in interactive mode for multi-turn conversations, or single mode for one-shot prompts.
    """
    if mode == "single" and not prompt:
        click.echo("Error: --prompt is required when using single mode")
        return

    async def run_mode():
        logger.info("Starting MCP client connection...")

        async with rg.mcp("sse", url=MCP_SSE_URL) as mcp_client:
            logger.info(f"Discovered {len(mcp_client.tools)} MCP tools via SSE.")

            if not mcp_client.tools:
                logger.warning("No MCP tools found.")
                print("No MCP tools found.")
                return

            if mode == "interactive":
                await interactive_chat_session(mcp_client, generator)
            else:
                await single_prompt_mode(mcp_client, prompt, generator)

    asyncio.run(run_mode())


if __name__ == "__main__":
    cli()
