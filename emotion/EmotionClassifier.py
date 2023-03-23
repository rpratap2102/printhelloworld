import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

# Reading the training.csv file and storing it in a data frame called df.
df = pd.read_csv('training.csv')

df.head()
df.info

X_test, y_test = df['text'], df['label']

mapping = ['sadness', 'joy', 'love', 'anger', 'fear', 'disappointed']

vectorizer = CountVectorizer()
X_test = vectorizer.fit_transform(X_test)
clf = MultinomialNB()

clf.fit(X_test, y_test)

accuracy = clf.score(X_test, y_test)

text = "I am not in a good mood right now"
X_new = vectorizer.transform([text])
prediction = clf.predict(X_new)[0]
print("Text: ",text," - Prediction: ", mapping[prediction])