
var cls = require("./lib/class"),
    url = require('url'),
    http = require('http'),
    WebSocketServer = require('ws').WebSocketServer,
    Utils = require('./utils'),
    _ = require('underscore'),
    WS = {};

module.exports = WS;

/**
 * Abstract Server and Connection classes
 */
var Server = cls.Class.extend({
    init: function(port) {
        this.port = port;
    },
    
    onConnect: function(callback) {
        this.connection_callback = callback;
    },
    
    onError: function(callback) {
        this.error_callback = callback;
    },
    
    broadcast: function(message) {
        throw "Not implemented";
    },
    
    forEachConnection: function(callback) {
        _.each(this._connections, callback);
    },
    
    addConnection: function(connection) {
        this._connections[connection.id] = connection;
    },
    
    removeConnection: function(id) {
        delete this._connections[id];
    },
    
    getConnection: function(id) {
        return this._connections[id];
    }
});

var Connection = cls.Class.extend({
    init: function(id, connection, server) {
        this._connection = connection;
        this._server = server;
        this.id = id;
    },
    
    onClose: function(callback) {
        this.close_callback = callback;
    },
    
    listen: function(callback) {
        this.listen_callback = callback;
    },
    
    broadcast: function(message) {
        throw "Not implemented";
    },
    
    send: function(message) {
        throw "Not implemented";
    },
    
    sendUTF8: function(data) {
        throw "Not implemented";
    },
    
    close: function(logError) {
        var address = this._connection._socket ? this._connection._socket.remoteAddress : 'unknown';
        console.log("Closing connection to " + address + ". Error: " + logError);
        this._connection.close();
    }
});

/**
 * Modern WebSocket Server using ws library
 */
WS.MultiVersionWebsocketServer = Server.extend({
    _connections: {},
    _counter: 0,
    
    init: function(port) {
        var self = this;
        
        this._super(port);
        
        // Create HTTP server
        this._httpServer = http.createServer(function(request, response) {
            var path = url.parse(request.url).pathname;
            switch(path) {
                case '/status':
                    if(self.status_callback) {
                        response.writeHead(200, {'Content-Type': 'application/json'});
                        response.write(self.status_callback());
                        break;
                    }
                default:
                    response.writeHead(404);
            }
            response.end();
        });
        
        this._httpServer.listen(port, function() {
            console.log("Server is listening on port " + port);
        });
        
        // Create WebSocket server
        this._wsServer = new WebSocketServer({ 
            server: this._httpServer,
            perMessageDeflate: false
        });
        
        this._wsServer.on('connection', function(ws, request) {
            ws.remoteAddress = request.socket.remoteAddress;
            
            var c = new WS.WebSocketConnection(self._createId(), ws, self);
            
            if(self.connection_callback) {
                self.connection_callback(c);
            }
            self.addConnection(c);
        });
        
        this._wsServer.on('error', function(error) {
            console.log('WebSocket server error:', error);
            if(self.error_callback) {
                self.error_callback(error);
            }
        });
    },
    
    _createId: function() {
        return '5' + Utils.random(99) + '' + (this._counter++);
    },
    
    broadcast: function(message) {
        this.forEachConnection(function(connection) {
            connection.send(message);
        });
    },
    
    onRequestStatus: function(status_callback) {
        this.status_callback = status_callback;
    }
});

/**
 * Modern WebSocket Connection
 */
WS.WebSocketConnection = Connection.extend({
    init: function(id, connection, server) {
        var self = this;
        
        this._super(id, connection, server);
        
        this._connection.on('message', function(data) {
            if(self.listen_callback) {
                try {
                    var message = JSON.parse(data.toString());
                    self.listen_callback(message);
                } catch(e) {
                    if(e instanceof SyntaxError) {
                        self.close("Received message was not valid JSON.");
                    } else {
                        console.error('Message parsing error:', e);
                    }
                }
            }
        });
        
        this._connection.on('close', function() {
            if(self.close_callback) {
                self.close_callback();
            }
            self._server.removeConnection(self.id);
        });
        
        this._connection.on('error', function(error) {
            console.error('WebSocket connection error:', error);
        });
    },
    
    send: function(message) {
        var data = JSON.stringify(message);
        this.sendUTF8(data);
    },
    
    sendUTF8: function(data) {
        if(this._connection.readyState === 1) { // OPEN
            try {
                this._connection.send(data);
            } catch(e) {
                console.error('Error sending message:', e);
            }
        }
    }
});
