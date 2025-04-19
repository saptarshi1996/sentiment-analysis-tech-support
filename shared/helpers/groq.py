import traceback

from groq import Groq

from shared.config.logger import logger
from shared.config.environment import GROQ_API_KEY

MAX_TOKEN = 8192
TEMPERATURE = 0
MODEL = "llama-8b-8192"

client = Groq(api_key=GROQ_API_KEY)


def get_completion(content):
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": content,
                }
            ],
            model=MODEL,
            temperature=TEMPERATURE,
            max_tokens=MAX_TOKEN
        )

        message = chat_completion.choices[0].message
        content = message.content
        return content
    except Exception as e:
        logger.error("An error occurred:", str(e))
        logger.error("Stack trace:", traceback.format_exc())
        return None
