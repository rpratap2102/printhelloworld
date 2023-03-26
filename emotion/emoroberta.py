from transformers import RobertaTokenizerFast, TFRobertaForSequenceClassification, pipeline

tokenizer = RobertaTokenizerFast.from_pretrained("rohitLearning/emotionModel")
model = TFRobertaForSequenceClassification.from_pretrained("rohitLearning/emotionModel")

emotion = pipeline('sentiment-analysis', 
                    model=model, tokenizer=tokenizer)

emotion_labels = emotion("I am not in a good mood")
print(emotion_labels)