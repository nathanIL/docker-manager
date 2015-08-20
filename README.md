## docker-manager

docker-manager is a web interface for the Docker Remote API and the Docker Registry API.
This project is currently in development and far from being usable, it is somewhat influenced by _startbootstrap-sb-admin_ and _dockerui_ projects (thanks!).

Forks and contributions are more than welcome!

### Goals
* Support all Docker Remote API from within the web UI.
* Support for all Docker Registry HTTP API.
* Support for Swarm API.


### Stack
* **Backend**
    * [Python](https://www.python.org/)
    * [Flask](http://flask.pocoo.org/)
* **Frontend**
    * [AngularJS](https://github.com/angular/angular.js)
    * [Bootstrap](http://getbootstrap.com/)
    * [morris.js](http://morrisjs.github.io/)
    * [Font Awesome](http://fortawesome.github.io/Font-Awesome/)
    * [webui-popover](https://github.com/sandywalker/webui-popover)

### Todo:
* Complete the Dashboard, Images section.
* Support for Registry (and complete the Registry section afterwards).
* Support for Swarm (?).
* More options for launching an image (should be as similar as possible to the CLI).
* Image search.
* Containerize the application.
* Unit tests.
* Use bower or grunt for javascript dependencies.

