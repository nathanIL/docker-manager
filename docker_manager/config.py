from __future__ import print_function
import sys
import os

"""
    Some default configuration options. Can be overriden by environment variables. see config_loader below.
    HOST points to 0.0.0.0 which stands for INADDR_ANY which mean it will listen on all interfaces.
"""
DEFAULTS = [('SOCKET', '/var/run/docker.sock'),
            ('PORT', 9000,),
            ('HOST', '0.0.0.0'),
            ('DEBUG', False),
            ('BOWER_COMPONENTS_ROOT', '../static/assets/public')]


def config_loader(app):
    """
        Loading the configurations into the Flask app.
        It first loads the DEFAULTS (above) and then any value provided as an environment variables starting with DOCKER_.
        For instance, if we want to override DEBUG and set it to True, we can export DOCKER_DEBUG=True, etc.
    """
    app.config.update(DEFAULTS)
    for docker_env_variable, docker_env_value in filter(lambda k: k[0].startswith('DOCKER_'), os.environ.items()):
        debug_property = docker_env_variable.replace('DOCKER_', '')
        print(" * Using environment {0} as debug property {1} with value: {2}".format(docker_env_variable,
                                                                                      debug_property,
                                                                                      docker_env_value),
              file=sys.stderr)
        app.config[debug_property] = docker_env_value
