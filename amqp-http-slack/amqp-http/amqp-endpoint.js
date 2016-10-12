#!/usr/bin/env node

/**
 * @file
 * Binding Component implementation automatically generated by
 * the Social Communication Platform.
 *
 * Characteristics:
 * - Type: AMQP subscriber.
 * - Social Communication Platform Bus: AMQP.
 */

var amqp = require('amqplib/callback_api');
var conf = require('./conf/amqp-endpoint.conf');
var out = require('./http-sender');
var Message = require('./lib/message');

/**
 * Receives a message from a Social Entity.
 * After receiving a message, it forwards it
 * to the Social Communication Platform Bus.
 * Protocol: AMQP.
 */

exports.listen = function() {

    connection = 'amqp://' + conf.user + ':' + conf.password +
        '@' + conf.address + ':' + conf.port;
    amqp.connect(connection, function(err, conn) {
        if (err) {
            console.log(err.stack);
        } else {
            //connection error handling
            conn.on('error', function(err) {
                console.log('An error occurred: ' + err.stack);
            });

            conn.createChannel(function(err, ch) {
                if (err) {
                    console.log(err.stack);
                } else {
                    connect(ch);
                }
            });
        }
    });
};


function connect(ch) {

    ex = 'slack';
    ch.assertExchange(ex, conf.exchange.type, {
        durable: true
    });
    ch.assertQueue('slack', {
        exclusive: true
    }, function(err, q) {
        if (err) {
            console.log(err.stack);
        } else {
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
            ch.bindQueue(q.queue, ex, '');

            ch.consume(q.queue, function(msg) {
                var message = JSON.parse(msg.content.toString());
                message.__proto__ = Message.prototype;
                console.log(" [x] %s", message);
                out.post(message);
            });
        }

    }, {
        noAck: true
    });
}
