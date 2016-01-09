## docker-manager
docker-manager is a web user interface for Docker and Docker Registry.
This project is currently in development, many features are still missing and are under development. 
It is somewhat influenced by _startbootstrap-sb-admin_ and _dockerui_ projects (thanks!).

The project itself consists of several sections, each section has its own functionality and corresponds to a section in Docker or Docker Registry:
##### Dashboard (landing page)
![Dashboard](/dashboard.png)

##### Images
![Images](/images.png)


There are helpful tooltips / popovers in each section based on the official docker documentation, so you basically learn
along the way on what docker is
![Popover](/popover1.png)

Forks and contributions are more than welcome!

### Goals
There are no planned goals other than what is listed in the [issues section](https://github.com/nathanIL/docker-manager/issues). suggestions and contributions are welcome.

### Installation
Installation is done using _make_ and depends on the following which must be installed prior running _make_

1. _virtualenv_
2. _bower_

#### How to install
There are few targets configured for _make_. you can either _build_ it only and then run it manually, or you can _build_ it and _run_ it at the same time.

* __build only:__ `make build`
* __build and run:__ `make run`

In case you choose to only build it, before running it, switch to the virtual environment first:
`source environment/bin/activate`
You can deactivate it later on by: `deactivate`



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
    * [UI Boostrap](https://angular-ui.github.io)
    * [bootstrap-waitingfor](https://github.com/ehpc/bootstrap-waitingfor)
    * [angular-formly](http://angular-formly.com/)

### Todo:
Please check the [Issues section](https://github.com/nathanIL/docker-manager/issues)

### Contributions
Pull requests will be accepted only to the _develop_ branch.
