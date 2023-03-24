import logging


import azure.functions as func

import re
#import long_responses as long
import requests
import random
from flask import Flask, request, jsonify
from transformers import RobertaTokenizerFast, TFRobertaForSequenceClassification, pipeline

tokenizer = RobertaTokenizerFast.from_pretrained("arpanghoshal/EmoRoBERTa")
model = TFRobertaForSequenceClassification.from_pretrained(
    "arpanghoshal/EmoRoBERTa")

emotion = pipeline('sentiment-analysis', model='arpanghoshal/EmoRoBERTa')

app = Flask(__name__)

def getting_questions():
    response = requests.get(f"https://printhelloworldback.azurewebsites.net/api/questions")
    if response.status_code == 200:
        print("sucessfully fetched the data")
        questions = response.json()
        return questions
    else:
        print(f"Hello person, there's a {response.status_code} error with your request")

NegativeFollowUpResponse = {'sadness', 'fear', 'anger', 'disapointed', 'Frustrated'}
PositiveFollowUpResponse = {'joy', 'love', 'happy','excited', 'surprise' }
question_index =0
questions = getting_questions()
print("que",questions)
logging.info(questions)

questions_texts = set()
for question in questions:
    ques = question['question'].strip().lower()
    questions_texts.add(ques)

def unknown():
    response = ["Could you please re-phrase that? ",
                "...",
                "Sounds about right.",
                "What does that mean?"][
        random.randrange(4)]
    return response


            

def message_probability(user_message, recognised_words, single_response=False, required_words=[]):
    message_certainty = 0
    has_required_words = True
    # Counts how many words are present in each predefined message
    for word in user_message:
        if word in recognised_words:
            message_certainty += 1
        else:
            msg = " "
            msg = msg.join(user_message)
            if msg in recognised_words:
                message_certainty+=1
                
    # Calculates the percent of recognised words in a user message
    percentage = float(message_certainty) / float(len(recognised_words))

    # Checks that the required words are in the string
    for word in required_words:
        if word not in user_message:
            has_required_words = False
            break

    # Must either have the required words, or be a single response
    if has_required_words or single_response:
        return int(percentage * 100)
    else:
        return 0
def check_message_belongs_to_questions(msg):
    msg = msg.replace("?","")
    if msg in questions_texts:
        return True
    return False
    
def response_prediction(message):
    msg = " "
    msg=msg.join(message)  
    print(emotion(msg))
    
    emotionArr=emotion(msg)
    return emotionArr[0]['label']

def check_all_messages(message):
    highest_prob_list = {}
    global NegativeFollowUpResponse, PositiveFollowUpResponse, questions
    
    def response(bot_response, list_of_words, single_response=False, required_words=[]):
        nonlocal highest_prob_list
        highest_prob_list[bot_response] = message_probability(message, list_of_words, single_response, required_words)

    # Responses -------------------------------------------------------------------------------------------------------
    response('Hello!', ['hello', 'hi', 'hey', 'sup', 'heyo'], single_response=True)
    response('See you Again! I am hoping I am helpful to make your day cheerfull. Thankyou! ', 
             ['bye', 'goodbye', 'nice talking to you'], single_response=True)
    response('You\'re welcome!', ['thank', 'thanks'], single_response=True)
    
    best_match = max(highest_prob_list, key=highest_prob_list.get)
      
    if question_index == 0:
            res = best_match
            return res +'\n' +questions[question_index]['question']
    
    if highest_prob_list[best_match] < 1 :
        print(message)
        print("index",question_index)
        
        
        if len(message) != 0 and question_index > 0:
            predicted = response_prediction(message)
            if predicted in PositiveFollowUpResponse:
                res = questions[question_index-1]['positive']['followup']
                res += '\n'+ questions[question_index-1]['positive']['action']
                return res + '\n' + questions[question_index]['question']
            else:
                res = questions[question_index-1]['negative']['followup']
                res += '\n'+ questions[question_index-1]['negative']['action']
                return res + '\n' + questions[question_index]['question']
    else :
        return best_match
    return unknown()
# Used to get the response
def get_response(user_input):
    global question_index
    split_message = re.split(r'\s+|[,;?!.-]\s*', user_input.lower())
    response = check_all_messages(split_message)
    question_index+= 1
    # if not check_message_belongs_to_questions(user_input.lower()):
    #     split_message = re.split(r'\s+|[,;?!.-]\s*', user_input.lower())
    #     response = check_all_messages(split_message)
    # else:
    #     response = check_all_messages(user_input.lower())
    #     question_index+= 1
    return response



def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    name = req.params.get('name')
   
    print(name)
    if not name:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            name = req_body.get('name')

    if name:
        r = req.get_json()
        print(r)
        res = get_response(r['text'])
        print(res)
        return func.HttpResponse(res)
    else:
        return func.HttpResponse(
             "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
             status_code=200
        )
