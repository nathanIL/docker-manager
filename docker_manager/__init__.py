from flask import (Flask,render_template,request)
from flask.ext.bower import Bower
from .dispatcher import dockerapi_dispatcher


app = Flask(__name__,static_folder='../static', template_folder='../templates')
Bower(app)

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/dockerapi/<path:path>',methods=['GET', 'POST','DELETE','PUT'])
def dockerapi(path):
    """
    Flask route for any request that should be proxies to the docker daemon.
    See Docker's remote API for additional info.
    """
    resp = dockerapi_dispatcher(request)
    return (resp.text, resp.status_code, resp.headers.items())


@app.route('/repositoryapi/<path:path>',methods=['GET', 'POST','DELETE','PUT'])
def repositoryapi(path):
    """
    Flask route for any request that should be proxied to the docker repository API.
    See Docker's repository API for additional info.
    """
    #TODO: Implement
    pass
