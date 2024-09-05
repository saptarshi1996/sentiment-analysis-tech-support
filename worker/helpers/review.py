from groq import Groq

GROQ_API_KEY = ''

client = Groq(api_key=GROQ_API_KEY)

result = client.chat.completions.create(messages=[
        {
            "role": "user",
            "content": "Explain the importance of fast language models",
        }
    ], model="llama3-8b-8192"),
stream=False,
response_format={"type": "json_object"}

print(result[0].choices[0].message.content)
