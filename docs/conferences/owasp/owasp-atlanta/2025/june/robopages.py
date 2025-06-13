import rigging as rg
import asyncio

# URL of your running Robopages server
# Run `robopages serve` in a terminal to start the server
ROBOPAGES_URL = "http://localhost:8000"  # Example URL


async def main():
    try:
        # Fetch tools from the server
        robopages_tools = rg.robopages(ROBOPAGES_URL)
        print(
            f"Loaded {len(robopages_tools)} tools: {[t.name for t in robopages_tools]}"
        )

        # Use the fetched tools in a pipeline
        chat = (
            await rg.get_generator("openai/o3-mini")
            .chat(
                "Use the available Robopages tool presented to you in order to enumerate open ports on localhost and return the results."
            )
            .using(*robopages_tools)
            .run()
        )
        print(chat.conversation)

    except Exception as e:
        print(f"Failed to connect to Robopages or use tools: {e}")
        # Handle connection errors or cases where no tools are found


# Entry point
asyncio.run(main())
