import logging

import azure.functions as func
from transformers import RobertaTokenizerFast, TFRobertaForSequenceClassification, pipeline

tokenizer = RobertaTokenizerFast.from_pretrained("arpanghoshal/EmoRoBERTa")
model = TFRobertaForSequenceClassification.from_pretrained(
    "arpanghoshal/EmoRoBERTa")

emotion = pipeline('sentiment-analysis', model='arpanghoshal/EmoRoBERTa')


def main(req: func.HttpRequest) -> func.HttpResponse:

    logging.info('Python HTTP trigger function processed a request.')

    req_body = req.get_json()
    text = req_body.get('text')

    emotion_labels = emotion(text)
    print(emotion_labels)
    if text:
        return func.HttpResponse(f"Text: {text}, \nEmotion, {emotion_labels[0]['label']}")
    else:
        return func.HttpResponse(
            "This HTTP triggered function executed successfully. Pass a text in the request body for emotion.",
            status_code=400
        )
