from flask import (Flask,render_template,request)
from .dispatcher import dockerapi_dispatcher
from .responses import make_no_cache_response


app = Flask(__name__,static_folder='../static', template_folder='../templates')


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/dockerapi/<path:path>',methods=['GET', 'POST','DELETE','PUT'])
def dockerapi(path):
    """
    Flask route for any request that should be proxies to the docker daemon.
    See Docker's remote API for additional info.
    """
    docker_response = dockerapi_dispatcher(app,request)
    response = make_no_cache_response(docker_response)
    return response


@app.route('/repositoryapi/<path:path>',methods=['GET', 'POST','DELETE','PUT'])
def repositoryapi(path):
    """
    Flask route for any request that should be proxied to the docker repository API.
    See Docker's repository API for additional info.
    """
    #TODO: Implement
    pass
