from __future__ import print_function
import sys
import os

# Can be overriden by environment variables. see config_loader below.
DEFAULTS = [('SOCKET','/var/run/docker.sock'),
            ('PORT',9000),
            ('DEBUG',False)]

def config_loader(app):
    app.config.update(DEFAULTS)
    for docker_env_variable,docker_env_value in filter( lambda k: k[0].startswith('DOCKER_'), os.environ.items() ):
        debug_property = docker_env_variable.replace('DOCKER_','')
        print(" * Using environment {0} as debug property {1} with value: {2}".format(docker_env_variable,
                                                                                      debug_property,
                                                                                      docker_env_value),
              file=sys.stderr)
        app.config[debug_property] = docker_env_value
