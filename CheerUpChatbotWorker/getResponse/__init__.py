import logging
import json

import azure.functions as func

import re
#import long_responses as long
import requests
import random
from flask import Flask, request, jsonify

app = Flask(__name__)

def getting_questions():
    response = requests.get(f"https://printhelloworldback.azurewebsites.net/api/questions")
    if response.status_code == 200:
        print("sucessfully fetched the data")
        questions = response.json()
        return questions
    else:
        print(f"Hello person, there's a {response.status_code} error with your request")

NegativeFollowUpResponse = {'sadness','annoyance','disappointment','fear','disapproval','disgust','anger','embarrassment','grief','remorse','realization','nervousness','confusion','neutral'}
PositiveFollowUpResponse = {'approval','caring','amusement','curiosity','optimism','desire','admiration','relief','joy','excitement','gratitude','love','surprise','pride'}
questions = getting_questions()

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
    r= requests.post("https://api-inference.huggingface.co/models/arpanghoshal/EmoRoBERTa", json={'inputs':message},headers={'Authorization':"Bearer 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"})
    logging.info(f'predict emotion {message}')
    if r.status_code == 200:
        logging.info(r.status_code)
        body = r.json() 
        pred = body[0][0]
        if(pred['label'] == 'neutral'):
            pred = body[0][1]
        logging.info(pred)
        return{"body": pred, 'success': True}
    else :
        return {"success": False , 'message': f"Unable to predict the emotion {r.status_code}"}

def check_all_messages(message, predicted, question_index):
    highest_prob_list = {}
    global NegativeFollowUpResponse, PositiveFollowUpResponse, questions
    
    def response(bot_response, list_of_words, single_response=False, required_words=[]):
        nonlocal highest_prob_list
        highest_prob_list[bot_response] = message_probability(message, list_of_words, single_response, required_words)

    byeResponse = 'See you Again! I am hoping I was able to make your day cheerfull. Thankyou! '
    # Responses -------------------------------------------------------------------------------------------------------
    response('Hello!', ['hello', 'hi', 'hey', 'sup', 'heyo'], single_response=True)
    response(byeResponse, 
             ['bye', 'goodbye', 'nice talking to you'], single_response=True)
    response('You\'re welcome!', ['thank', 'thanks'], single_response=True)
    
    best_match = max(highest_prob_list, key=highest_prob_list.get)
    
    
    if question_index >= len(questions):
        res = byeResponse
        return res
    if question_index == 0:
        res = best_match
        return res +'\n' +questions[question_index]['question']
    
    if highest_prob_list[best_match] < 1 :
        print(message)
        print("index",question_index)
        
        if len(message) != 0 and question_index > 0:
            print(predicted)
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

# update the progress of user
def setting_progress(userName, input, emotion, index):
    path = f"https://printhelloworldback.azurewebsites.net/api/status?u={userName}"
    logging.info({"qi":index,"r":input,"e":emotion})
    response = requests.post(path, json={"qi":index,"r":input,"e":emotion})
    if response.status_code == 201:
        logging.info(f"Successfully updated progress")
        body = response.json()
        res = {'data': body, 'code' : 200 }
        return res
    else:
        res = {'code' : response.status_code, 'message': 'unable to update the progress' }
        logging.info(f"Hello person, there's a {response.status_code} error with your request")
        return res

# get the progress of user
def getting_progress(userName):
    path = f"https://printhelloworldback.azurewebsites.net/api/status?u={userName}"
    response = requests.get(path)
    if response.status_code == 200:
        logging.info(f"Successfully fetched progress")
        body = response.json()
        res = {'data': body,'code': response.status_code}
        return res
    elif response.status_code == 204:
        logging.info("Record is not created")
        return {'code': 204}
    else:
        logging.info(f"Hello person, there's a {response.status_code} error with your request")
        return {'code': response.status_code}

#welcomeText = "Hi, I’m hello world bot, a personalized chatbot curated to understand human emotions and cheer them up. I am here to listen and would try to make you feel better.\n In case, you want a friendly talk and want to laugh out loud, I can share some of my favorite memes and jokes."

# Used to get the response
def get_response(user_input, userName):
    split_message = re.split(r'\s+|[,;?!.-]\s*', user_input.lower())
    prediction = response_prediction(user_input)
    if (prediction['success'] == False):
        return {'success': False, 'message': prediction['message']}
    logging.info(f"Prediction: {prediction}")
    progress = getting_progress(userName);
    index = 0
    if progress['code'] == 200 :
        index = progress['data']['q_index']
    elif progress['code'] == 204 :
        update = setting_progress(userName, user_input, prediction['body'], index)
        if update['code'] != 200:
            return {'success': False, 'message': 'unable to update progress'}
        response = {'body': 'Lets get started with your name then.', 'prediction': prediction['body'], 'index': index, 'success': True }
        return response
    else:
        return {'success': False, 'message': 'unable to fetch progress'} 
    index = index + 1
    logging.info(f"un : {userName}, ui : {user_input}, p : {prediction}, i : {index}")
    if index < len(questions):
        update = setting_progress(userName, user_input, prediction['body'], index)
        if update['code'] != 200:
            return {'success': False, 'message': 'unable to update progress'}
    body = check_all_messages(split_message, prediction['body']['label'], index - 1 )
    response = {'body': body, 'prediction': prediction['body'], 'index': index, 'success': True }
    return response

def main(req: func.HttpRequest) -> func.HttpResponse:
    userName = req.params.get('u')
    if userName:
        r = req.get_json()
        res = get_response(r['text'], userName)
        print(res)
        if res['success'] == True :
            return func.HttpResponse(json.dumps(res))
        else:
            return func.HttpResponse(f"Internal error : {res['message']}")
    else:
        return func.HttpResponse(
             "No userName is provided",
             status_code=400
        )