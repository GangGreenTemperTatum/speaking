# pip install rigging==3.0.3a0

import base64
from rigging import Message, GenerateParams
from rigging.transform.base import PostTransform
import rigging as rg

LOGFIRE_IGNORE_NO_CONFIG = 1


async def base64_transform(
    messages: list[Message],
    params: GenerateParams,
    /,
) -> tuple[list[Message], GenerateParams, PostTransform | None]:
    """
    Creates a new list of messages with all content encoded in base64.
    """
    if not messages:
        return messages, params, None

    for message in messages:
        if isinstance(message.content, str):
            encoded_content = base64.b64encode(message.content.encode("utf-8")).decode(
                "utf-8"
            )
            message.content = encoded_content

    print(f"Transformed messages: {messages}")

    return messages, params, None


async def main():
    generator = rg.get_generator("groq/meta-llama/llama-4-scout-17b-16e-instruct")

    try:
        pipeline = (
            await generator.chat(
                [
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": "What is the capital of France?"},
                ]
            )
            .transform(base64_transform)
            .run()
        )

        print("pipeline result:", pipeline)
    finally:
        if hasattr(generator, "client") and hasattr(generator.client, "close"):
            await generator.client.close()


if __name__ == "__main__":
    import asyncio

    asyncio.run(main())
