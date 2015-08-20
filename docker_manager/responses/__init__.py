import flask
from .decorators import no_cache


@no_cache
def make_no_cache_response(response):
    return flask.make_response(response.text)


