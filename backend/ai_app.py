
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import sqlite3
def init_db():
    conn = sqlite3.connect("poems.db")
    cur = conn.cursor()
    cur.execute('''CREATE TABLE IF NOT EXISTS poems (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    date TEXT DEFAULT CURRENT_TIMESTAMP,
                    topic TEXT NOT NULL,
                    poem TEXT NOT NULL)''')
    conn.commit()
    conn.close()

key='AIzaSyAXu4EJPl2-_G1K4x3KfLxQfLHdLspZdu4'
genai.configure(api_key=key)
model = genai.GenerativeModel("gemini-1.5-flash")

model2=genai.GenerativeModel(model_name='tunedModels/generate-num-6607')
print(model2)
app = Flask(__name__)
CORS(app)


init_db()


@app.route('/')  #for homepage
def home():
    return (render_template("home.html")) #printing this would print the home.html html code

@app.route('/summarizer')           #When button in html is pressed, it is routed to the url for summarizer page which is used to trigger the following function to render the html
def summarizer():
    return render_template("summarizer.html")
@app.route('/poetry')           #When button in html is pressed, it is routed to the url for summarizer page which is used to trigger the following function to render the html
def poetry():
   return render_template("poetry.html")

@app.route('/summary', methods=['POST'])
def summary():

    data = request.get_json()

    # Get the number and calculate the square
    text = data['text']

    response=model.generate_content("Summarize the following text: "+text)
  
    summ=response.text
    print(summ)

    # Return the result as JSON
    return jsonify({'text': text, 'summ': summ})
@app.route('/poem', methods=['POST'])
def poem():

    data = request.get_json()


    topic = data['topic']
    response=model2.generate_content(f"Write a prose poem about{topic} in style of me.")
    poem=response.text
    conn = sqlite3.connect("poems.db")
    cur = conn.cursor()
    cur.execute("INSERT INTO poems (topic, poem) VALUES (?, ?)", (topic, poem))
    conn.commit()
    conn.close()
    return jsonify({'topic': topic, 'poem': poem})
@app.route("/get_poems", methods=["GET"])
def get_poems():
    conn = sqlite3.connect("poems.db")
    cur = conn.cursor()
    cur.execute("SELECT id, date, topic, poem FROM poems")
    poems = [{"id": row[0], "date": row[1], "topic": row[2], "poem": row[3]} for row in cur.fetchall()]
    conn.close()
    return jsonify(poems)
# main driver function
if __name__ == '__main__':

    app.run()                                         #running flask to run a set of webpages, and in their form putting # to send data to running flask

#Flask needs python in main folder, then static folder to have js, css, images, subfolders then files. html files in templates folder