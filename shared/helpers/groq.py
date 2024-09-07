import json
import logging

from groq import Groq

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
        json_content = json.loads(content)

        sentiment: str = json_content['sentiment']
        summary: str = json_content['summary']

        logging.info(sentiment)
        logging.info(summary)

        return sentiment, summary
    except Exception as e:
        logging.error(e)
        return None, None
