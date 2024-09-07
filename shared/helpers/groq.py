import traceback

from groq import Groq

from shared.config.logger import logger
from shared.config.environment import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)


def get_completion(content: str):
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": content,
                }
            ],
            model="llama3-8b-8192",
            temperature=0,
            max_tokens=8192
        )

        message = chat_completion.choices[0].message
        content = message.content
        return content
    except Exception as e:
        logger.error("An error occurred:", str(e))
        logger.error("Stack trace:", traceback.format_exc())
        return None
