from __future__ import print_function
from flask.ext.script import Command,Server
import os
import sys
import stat
import grp
import re
import getpass


class Prerequisites(Command):
    """
        Allow running the prerequisites command for Flask-Script's manage.
    """
    def __init__(self,*args,**kwargs):
        self.app = kwargs.pop('app')
        super(Prerequisites,self).__init__(*args,**kwargs)

    def check_socket_status(self):
        if not stat.S_ISSOCK( os.stat(self.app.config['SOCKET']).st_mode ):
            raise SystemError("ERROR: Docker's unix socket does not exists")

    def check_group(self):
        user = getpass.getuser()
        groups = [ g.gr_gid for g in grp.getgrall() if user in g.gr_mem ]
        if not os.stat(self.app.config['SOCKET']).st_gid in groups:
            raise SystemError("ERROR: Permissions issue. Executing user does not belong to docker's group")

    def check_proxies(self):
        if os.getenv('HTTP_PROXY') or os.getenv('HTTPS_PROXY'):
            raise RuntimeWarning("WARNING: specifying proxies (HTTP_PROXY / HTTPS_PROXY) is not supported with AF_UNIX sockets")

    def run(self):
        try:
            self.check_socket_status()
            self.check_group()
            self.check_proxies()
        except SystemError as se:
            print(se.message,file=sys.stderr)


class DMServer(Server):
    """
        Make pre-run modifications before executing the flask application with runserver.
    """
    def __init__(self,*args,**kwargs):
        self.unset_proxies()
        super(DMServer,self).__init__(*args,**kwargs)

    def unset_proxies(self):
        """
            Unset HTTP_PROXY and HTTPS_PROXY according to requests (http://www.python-requests.org/en/latest/user/advanced/#proxies)
            This is because requests_unixsocket doesnt work when proxies are set.
        """
        proxies = filter( lambda v: re.compile(r"http(?:s)?_proxy",re.I).match(v) , os.environ.keys() )
        try:
            for proxy in proxies:
                del(os.environ[proxy])
        except:
            pass
