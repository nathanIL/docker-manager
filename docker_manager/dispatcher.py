import requests_unixsocket
import urllib
import re
from flask import current_app


def dockerapi_dispatcher(request):
    method = request.method
    uri = re.match(r"^.+/dockerapi/(.+)", request.url).group(1)
    session = requests_unixsocket.Session()
    unix_socket = urllib.quote_plus( current_app.config['SOCKET'] )
    return getattr(session,method.lower())('http+unix://{0}/{1}'.format(unix_socket,uri),json=request.json, stream=True)
