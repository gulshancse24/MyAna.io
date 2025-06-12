from werkzeug.exceptions import HTTPException

class ConnectionTerminated(HTTPException):
    code = 625
    name = 'Connection Terminated'
    description = 'Oops! The connection was unexpectedly terminated.'

class PathNotFound(ConnectionTerminated):
    code = 625
    name = 'Path Not Found'
    description = 'The requested path could not be found. Please check the URL and try again.'