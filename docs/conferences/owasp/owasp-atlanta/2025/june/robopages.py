import rigging as rg
import asyncio
import logfire
import traceback
import os
import httpx
from unittest.mock import patch
from loguru import logger

logger.enable("rigging")


# ======== LOGGING ========

logfire.configure()
os.environ.setdefault("LOGFIRE_TOKEN", "")  # (1)!

# URL of your running Robopages server
ROBOPAGES_URL = "http://localhost:8000"


async def main():
    generator = None
    try:
        original_init = httpx.AsyncClient.__init__

        def patched_init(self, *args, **kwargs):
            if "timeout" not in kwargs:
                kwargs["timeout"] = httpx.Timeout(120.0)  # 2 minutes
            return original_init(self, *args, **kwargs)

        with patch.object(httpx.AsyncClient, "__init__", patched_init):
            # Fetch tools from the server
            robopages_tools = rg.robopages(ROBOPAGES_URL)
            print(
                f"Loaded {len(robopages_tools)} tools: {[t.name for t in robopages_tools]}"
            )

            generator = rg.get_generator("openai/o3-mini")
            chat = (
                await generator.chat(
                    "Use the available Robopages tool presented to you in order to enumerate open ports on localhost and return the results"
                )
                .using(*robopages_tools)
                .run()
            )
            logger.success(chat.conversation)

    except Exception as e:
        logger.warning(f"Error type: {type(e).__name__}")
        logger.warning(f"Error message: '{str(e)}'")
        logger.warning(f"Error repr: {repr(e)}")
        logger.warning("Full traceback:")
        traceback.print_exc()
    finally:
        if (
            generator
            and hasattr(generator, "client")
            and hasattr(generator.client, "close")
        ):
            await generator.client.close()


if __name__ == "__main__":
    asyncio.run(main())
