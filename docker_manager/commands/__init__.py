from __future__ import print_function
from flask.ext.script import Command
import os
import sys
import stat
import grp
import getpass


class Prerequisites(Command):

    def __init__(self,*args,**kwargs):
        self.app = kwargs.pop('app')
        super(Prerequisites,self).__init__(*args,**kwargs)

    def check_socket_status(self):
        if not stat.S_ISSOCK( os.stat(self.app.config['SOCKET']).st_mode ):
            raise SystemError("Docker's unix socket does not exists")

    def check_group(self):
        user = getpass.getuser()
        groups = [ g.gr_gid for g in grp.getgrall() if user in g.gr_mem ]
        if not os.stat(self.app.config['SOCKET']).st_gid in groups:
            raise SystemError("Permissions: executing user does not belong to docker's socket group")


    def run(self):
        try:
            self.check_socket_status()
            self.check_group()
        except SystemError as se:
            print(se.message,file=sys.stderr)