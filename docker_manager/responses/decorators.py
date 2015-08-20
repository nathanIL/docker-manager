"""
Some helpful decorators
"""
from functools import wraps

def no_cache(f):
    """
    Wraps a request method from docker_manager.responses and adds no_cache headers to it.

    :param f: the method to be wrapped
    :return: wrapped method
    """
    @wraps(f)
    def _wrapped(*args,**kwargs):
        response = f(*args,**kwargs)
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = 0
        return response
    return _wrapped