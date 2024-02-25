from flask import Flask, redirect, url_for, render_template, request
import json

app = Flask(__name__)

latitude = 69
longitude = 22
numEmployees = 2

@app.route("/")
def home():
  return render_template("home.html", latitude=latitude, longitude=longitude, numEmployees=numEmployees)

@app.route('/')
def coord():
    return render_template('home.html')

@app.route('/login')
def login():
  return render_template('login.html', latitude=latitude, longitude=longitude, numEmployees=numEmployees)

@app.route('/signup')
def signup():
  return render_template('signup.html', latitude=latitude, longitude=longitude, numEmployees=numEmployees)

@app.route('/dashboard')
def dashboard():
  return render_template('dashboard.html', latitude=latitude, longitude=longitude, numEmployees=numEmployees)

@app.route('/meet')
def meet():
  return render_template('meet.html', latitude=latitude, longitude=longitude, numEmployees=numEmployees)

if __name__ == "__main__":
  app.run(debug=True)


@app.route('/test', methods=['POST'])
def test():
  output = request.get_json()
  result = json.loads(output)

  person = {"name": result.get(fullName), "age":  result.get(age), "instagram": result.get(insta)}
  print(person)
  
  print(output)

  print(output.get(fullName))
  return result