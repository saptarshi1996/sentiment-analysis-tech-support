PROMPT = [
    "Analyze the following message and determine its sentiment",
    "as Positive, Negative, Neutral, or Mixed. Provide a concise summary",
    "in English explaining the reason for this sentiment. Your response",
    "should be a JSON object with two keys: 'sentiment' (with values: ",
    "Positive, Negative, Neutral, or Mixed) and 'summary' (a single",
    "sentence summary in English of why the sentiment was assigned).",
    "Only return the JSON object. Here is the message: "
]
QUEUE = {
    "PROCESS_RECORDS": "PROCESS_RECORDS"
}
